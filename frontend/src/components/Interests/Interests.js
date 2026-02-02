import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Box, Typography, Button, Paper, Chip, Stack, Modal, Switch, TextField, IconButton, CircularProgress } from '@mui/material';
import { config } from "../../index";
import { ChatBubble, Close, Add } from '@mui/icons-material';
import axios from 'axios';
import './Interests.css';

const Interests = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [interests, setInterests] = useState(['Gaming', 'Anime', 'Politics']);
  const [genderFilter, setGenderFilter] = useState('Both');
  const [openModal, setOpenModal] = useState(false);
  const [useInterests, setUseInterests] = useState(true);
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleDeleteInterest = (toDelete) => {
    setInterests(interests.filter((i) => i !== toDelete));
  };

  const handleStartChatting = async () => {
    console.log("Start button clicked. User state:", user);
    setLoading(true);
    try {
      const payload = {
        username: user?.username || "Guest",
        bio: user?.bio || "",
        gender: user?.gender || "Unknown",
        interests: useInterests ? interests : [genderFilter]
      };
      const response = await axios.post(`${config.backendPoint}/api/users/register`, payload);
      
      if (response.data) {
        localStorage.setItem('aegis_user', JSON.stringify(response.data));
        navigate('/chat');
      }
    } catch (error) {
      console.error("Chat Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="aegis-flat-bg">
      <Box className="aegis-flat-container">
        <Box className="brand-header">
          <Typography onClick={() => navigate('/')} variant="h3" className="brand-text-flat">
            Aegis<span className="dot">.chat</span>
          </Typography>
        </Box>

        <Paper className="flat-card" elevation={0}>
          <Box className="flat-section">
            <Box className="section-header">
              <Typography className="flat-label">Interests</Typography>
              <Typography className="edit-link" onClick={() => setOpenModal(true)}>Edit</Typography>
            </Box>
            <Box className="interests-grid" onClick={() => setOpenModal(true)}>
              {interests.map((item) => (
                <Chip key={item} label={item} className="flat-chip" />
              ))}
              <Chip label="+ Add" className="flat-chip-add" variant="outlined" />
            </Box>
          </Box>

          <Box className="flat-section">
            <Typography className="flat-label">Match Preference</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {['Male', 'Both', 'Female'].map((type) => (
                <Box
                  key={type}
                  className={`selection-box ${genderFilter === type ? 'selected' : ''}`}
                  onClick={() => setGenderFilter(type)}
                >
                  <Typography className="selection-emoji">
                    {type === 'Male' && '♂️'}
                    {type === 'Both' && '👥'}
                    {type === 'Female' && '♀️'}
                  </Typography>
                  <Typography className="selection-text">{type}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Button 
            className="flat-start-btn" 
            fullWidth 
            disableElevation 
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ChatBubble />}
            onClick={handleStartChatting}
            disabled={loading}
          >
            {loading ? 'Finding Match...' : 'Start Chatting'}
          </Button>
        </Paper>

        <Typography className="flat-footer">
          Verified as <strong>{user?.gender || 'Guest'}</strong>. Safe and anonymous.
        </Typography>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="modal-style">
          <Box className="modal-header">
            <Typography variant="h6" fontWeight={700}>Manage Interests</Typography>
            <IconButton onClick={() => setOpenModal(false)} className="close-btn"><Close /></IconButton>
          </Box>

          <Box className="modal-toggle-row">
            <Typography fontWeight={600}>Filter by Interests</Typography>
            <Switch checked={useInterests} onChange={(e) => setUseInterests(e.target.checked)} color="primary" />
          </Box>

          <Box className="modal-input-section">
            <Typography className="flat-label">Add New</Typography>
            <Box className="input-group">
              <TextField
                fullWidth
                size="small"
                placeholder="Coding, Music..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                className="modal-input"
              />
              <Button onClick={handleAddInterest} variant="contained" className="add-btn-flat"><Add /></Button>
            </Box>
          </Box>

          <Typography className="flat-label">Active Interests</Typography>
          <Box className="modal-interests-list">
            {interests.map((item) => (
              <Chip key={item} label={item} onDelete={() => handleDeleteInterest(item)} className="flat-chip-modal" />
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Interests;