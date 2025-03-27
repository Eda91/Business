import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupIcon from '@mui/icons-material/Group';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FooterMenu = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) navigate('/home');
          if (newValue === 1) navigate('/profile');
          if (newValue === 2) navigate('/my-team');
          if (newValue === 3) navigate('/quantity');
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="My Profile" icon={<AccountCircleIcon />} />
        <BottomNavigationAction label="My Team" icon={<GroupIcon />} />
        <BottomNavigationAction label="Quantity" icon={<ShowChartIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default FooterMenu;
