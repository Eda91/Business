import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
import { 
  Box, Button, Typography, Divider, List, ListItem, ListItemText, IconButton, Card, CardContent, Avatar,Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RuleIcon from '@mui/icons-material/Rule';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FooterMenu from '../Footer';
import './UserProfile.css'; // Import your CSS for styling

const generateRandomEmail = () => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "protonmail.com"];
  const randomUser = Math.random().toString(36).substring(2, 6);
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  return `${randomUser}***@${randomDomain}`;
};

const generateRandomUSDT = () => (Math.random() * (500 - 10) + 10).toFixed(2);

const transactions = {
  charges: Array.from({ length: 10 }, () => ({
    email: generateRandomEmail(),
    amount: `${generateRandomUSDT()} USDT`,
  })),
  withdrawals: Array.from({ length: 10 }, () => ({
    email: generateRandomEmail(),
    amount: `${generateRandomUSDT()} USDT`,
  })),
};

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        } else {
          throw new Error(data.msg || 'Failed to fetch profile');
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Clear the authentication token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="profile-container">
              <div className={`profile-content ${menuOpen ? 'expanded' : ''}`}>
      {/* Header with Burger Icon and Logout Button aligned to the right */}
      <div className="header">
        <div className="header-left">
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
        </div>
        <div className="header-right">
          {/* Logout Button */}
          <button className="logout-btn" onClick={logout}>
            <ExitToAppIcon />
            Logout
          </button>
        </div>
      </div>
      </div>

      {/* Side Menu */}
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <List>
          <ListItem button component={Link} to="/company-profile" className="menu-item">
            <AccountCircleIcon className="menu-icon" />
            <ListItemText primary="Company Profile" />
          </ListItem>
          <ListItem button component={Link} to="/platform-rules" className="menu-item">
            <RuleIcon className="menu-icon" />
            <ListItemText primary="Platform Rules" />
          </ListItem>
          <ListItem button component={Link} to="/common-problems" className="menu-item">
            <HelpOutlineIcon className="menu-icon" />
            <ListItemText primary="Common Problems" />
          </ListItem>
          <ListItem button component={Link} to="/security-center" className="menu-item">
            <SecurityIcon className="menu-icon" />
            <ListItemText primary="Security Center" />
          </ListItem>
          <ListItem button component={Link} to="/funding-details" className="menu-item">
            <AccountBalanceWalletIcon className="menu-icon" />
            <ListItemText primary="Funding Details" />
          </ListItem>
          <ListItem button component={Link} to="/invite-friends" className="menu-item">
            <GroupAddIcon className="menu-icon" />
            <ListItemText primary="Invite Friends" />
          </ListItem>
          <ListItem button component={Link} to="/my-team" className="menu-item">
            <GroupIcon className="menu-icon" />
            <ListItemText primary="My Team" />
          </ListItem>
          <ListItem button component={Link} to="/quotation-tutorial" className="menu-item">
            <AssignmentIcon className="menu-icon" />
            <ListItemText primary="Quotation Tutorial" />
          </ListItem>
        </List>
      </div>

      {/* User Profile Content */}
      <div className={`profile-content ${menuOpen ? 'expanded' : ''}`}>
        <Card className="profile-card">
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar sx={{ width: 60, height: 60, mr: 2 }} />
              <Typography variant="h4"><strong>{userData?.name}</strong></Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <div>
              {error && <Typography className="error-message">{error}</Typography>}
              {userData ? (
                <div className="profile-details">
                  <Typography variant="h6"sx={{ mb: 2 }}>email: <strong>{userData.email}</strong></Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>UserID: <strong>{userData.id}</strong></Typography>

                  {/* Buttons */}
                  <div className="buttons"sx={{ mb: 5 }}>
                  <Button variant="contained" color="primary" sx={{ mr: 2 }} startIcon={<AccountBalanceWalletIcon />}>
    Recharge
  </Button>
  <Button variant="contained" color="secondary" startIcon={<ArrowDownwardIcon />}>
    Withdraw
  </Button>
                  </div>

                  <Divider sx={{ my: 3 }} />

                  {/* Balance and Account Status */}
                  <Card className="balance-summary">
  <CardContent>
  <Typography variant="h5" align="left" sx={{ mb: 3, mt: -2 }}>
  Balance Summary
</Typography>
    <Divider sx={{ mb: 2 }} />

    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={6} md={4}>
        <Typography align="center">Balance:</Typography>
        <Typography align="center"><strong>{userData.balance}</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Available Funds:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Total Income:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Today's Commission:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Today's Income:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Yesterday's Income:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Quantitative Benefits:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">This Month's Income:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
      <Grid item xs={6} md={4}>
        <Typography align="center">Last Month's Income:</Typography>
        <Typography align="center"><strong>0.00</strong></Typography>
      </Grid>
    </Grid>
  </CardContent>
</Card>

                </div>
              ) : (
                <Typography variant="body1">Loading...</Typography>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
      <div className="profile-container">
      {/* Your existing profile content here */}

      {/* Footer Navigation */}
      <FooterMenu />
    </div>
    </div>
  );
};

export default UserProfile;
