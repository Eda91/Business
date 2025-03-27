import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Divider, Tabs, Tab, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Card, CardContent, Button, 
  Grid, IconButton, List, ListItem, ListItemText, Drawer 
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RuleIcon from '@mui/icons-material/Rule';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';

import FooterMenu from '../Footer.jsx';
import './General.css';

// Sample transaction data
const transactions = {
  charges: Array.from({ length: 10 }, (_, i) => ({
    email: `user${i + 1}***@example.com`,
    amount: `${(Math.random() * (500 - 10) + 10).toFixed(2)} USDT`,
  })),
  withdrawals: Array.from({ length: 10 }, (_, i) => ({
    email: `user${i + 11}***@example.com`,
    amount: `${(Math.random() * (500 - 10) + 10).toFixed(2)} USDT`,
  })),
};

const General = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle Side Menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
      <div className="general-container">
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

      {/* Side Menu */}
      <Drawer anchor="left" open={menuOpen} onClose={toggleMenu}>
        <List className="general-side-menu">
          <ListItem button component={Link} to="/company-general">
            <AccountCircleIcon className="general-menu-icon" />
            <ListItemText primary="Company general" />
          </ListItem>
          <ListItem button component={Link} to="/platform-rules">
            <RuleIcon className="general-menu-icon" />
            <ListItemText primary="Platform Rules" />
          </ListItem>
          <ListItem button component={Link} to="/common-problems">
            <HelpOutlineIcon className="general-menu-icon" />
            <ListItemText primary="Common Problems" />
          </ListItem>
          <ListItem button component={Link} to="/security-center">
            <SecurityIcon className="general-menu-icon" />
            <ListItemText primary="Security Center" />
          </ListItem>
          <ListItem button component={Link} to="/funding-details">
            <AccountBalanceWalletIcon className="general-menu-icon" />
            <ListItemText primary="Funding Details" />
          </ListItem>
          <ListItem button component={Link} to="/invite-friends">
            <GroupAddIcon className="general-menu-icon" />
            <ListItemText primary="Invite Friends" />
          </ListItem>
          <ListItem button component={Link} to="/my-team">
            <GroupIcon className="general-menu-icon" />
            <ListItemText primary="My Team" />
          </ListItem>
          <ListItem button component={Link} to="/quotation-tutorial">
            <AssignmentIcon className="general-menu-icon" />
            <ListItemText primary="Quotation Tutorial" />
          </ListItem>
        </List>
      </Drawer>

      {/* Content */}
      <div className="general-content">
        <Card className="general-card">
          <CardContent>
            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
              General Overview
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Action Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Button fullWidth variant="contained" color="primary" startIcon={<AccountBalanceWalletIcon />}>
                  Recharge
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button fullWidth variant="contained" color="secondary" startIcon={<ArrowDownwardIcon />}>
                  Withdraw
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button fullWidth variant="contained" color="success" startIcon={<GroupIcon />}>
                  Team
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button fullWidth variant="contained" color="warning" startIcon={<GroupAddIcon />}>
                  Invite
                </Button>
              </Grid>
            </Grid>

            {/* Transactions Tab */}
            <Box sx={{ width: "100%", mt: 3 }}>
              <Tabs 
                value={selectedTab} 
                onChange={(e, newValue) => setSelectedTab(newValue)} 
                indicatorColor="primary" 
                textColor="primary" 
                centered
              >
                <Tab label="Recent Charges" />
                <Tab label="Recent Withdrawals" />
              </Tabs>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Amount (USDT)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedTab === 0 ? transactions.charges : transactions.withdrawals).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <FooterMenu />
    </div>
  );
};

export default General;
