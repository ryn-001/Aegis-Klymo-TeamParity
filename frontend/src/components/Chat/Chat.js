import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:8082');

const Chat = ({ roomId, senderId, nickname }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        socket.emit('join_room', roomId);
        socket.on('receive_message', (data) => {
            setChatHistory((prev) => [...prev, data]);
        });
        return () => socket.off('receive_message');
    }, [roomId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        const messageData = {
            roomId: "TEST_ROOM_12345",
            senderId,
            text: message,
            nickname,
            timestamp: new Date()
        };

        socket.emit('send_message', messageData);
        setChatHistory((prev) => [...prev, messageData]);
        setMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <span className="room-id">Room: {roomId?.slice(-5)}</span>
                <span className="user-badge">{nickname}</span>
            </div>

            <div className="messages-area">
                <div className="message-list">
                    {chatHistory.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`message-row ${msg.senderId === senderId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`message-bubble ${msg.senderId === senderId ? 'message-sent' : 'message-received'}`}>
                                <p className="sender-name">
                                    {msg.senderId === senderId ? 'You' : msg.nickname}
                                </p>
                                <p className="message-text">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="send-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default Chat;