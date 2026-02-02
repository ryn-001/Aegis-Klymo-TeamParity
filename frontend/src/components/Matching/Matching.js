import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Typography, Avatar, Button } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { config } from "../../index";
import './Matching.css';

const Matching = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Finding someone special...');
  const [elapsedTime, setElapsedTime] = useState(0);

  const localUser = (() => {
    try {
      const data = localStorage.getItem('aegis_user');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Storage parse error", err);
      return null;
    }
  })();

  const userId = localUser?._id || localUser?.data?._id;

  useEffect(() => {

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    let matchInterval;
    if (userId) {
      matchInterval = setInterval(async () => {
        try {
          const response = await axios.get(`${config.backendPoint}/match/check/${userId}`);

          if (response.data?.matchFound) {
            clearInterval(matchInterval);
            clearInterval(timer);
            setStatus('Match Found! Connecting...');

            setTimeout(() => {
              navigate(`/room/${response.data.roomId}`, {
                state: { partner: response.data.partner }
              });
            }, 1500);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000);
    }

    return () => {
      clearInterval(timer);
      if (matchInterval) clearInterval(matchInterval);
    };
  }, [userId, navigate]);

  return (
    <Box className="matching-container">
      <Box className="radar-wrapper">
        <Box className="pulse-ring" />
        <Box className="pulse-ring-delayed" />
        <Avatar
          src={localUser?.image?.url || ''}
          className="matching-avatar"
        >
          {localUser?.username?.charAt(0) || '?'}
        </Avatar>
      </Box>

      <Typography variant="h5" className="status-text">
        {status}
      </Typography>

      <Typography className="timer-text">
        Wait time: {elapsedTime}s
      </Typography>

      <Button
        variant="text"
        startIcon={<Close />}
        onClick={() => navigate('/interests')}
        className="cancel-btn"
      >
        Back to Interests
      </Button>
    </Box>
  );
};

export default Matching;