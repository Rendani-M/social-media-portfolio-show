import "./navbar.scss";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import subProfilePic from "../../assets/profilePic.jpg";
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Home, HomeOutlined, Logout, Menu, People, PersonOutline } from '@mui/icons-material';

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext); 
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [state, setState] = useState({
    left: false
  });
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({[anchor]: open });
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login")
      
    } catch (err) {
      console.log(err.response.data);
    }
  };
  
  const list = (anchor) => (
    <Box
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{navigate("/")}}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={()=>{navigate("/onlineUsers")}}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary={'Online Users'} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box className="navbar">
      <Box sx={{ display:{xs:'block', sm:'none'} }}>
        <Drawer 
          anchor='left'
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          sx={{
              width: '240',
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: '240', boxSizing: 'border-box' },
          }}
          >
              
          <Box sx={{ overflow: 'auto' }}>
              {list('left')}
          </Box>
        </Drawer>
      </Box>
      <Box sx={{ display:{xs:'block', sm:'none'} }}>
        <IconButton 
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr:'4em', display:{xs:"Block", md: "none"} }}
            onClick={toggleDrawer('left', true)}>
          <Menu sx={{fontSize:'1.5em', color:"black"}} />  
        </IconButton>
      </Box>

      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: 'black' }}>
          <Typography variant="span" component={isSmallScreen? "h4":"h3"}>
            Rendi-Social-Media
          </Typography>
        </Link>
      </div>
      <div className="left">
        <HomeOutlined onClick={()=>{navigate("/")}}/>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <div className="icons">
          <EmailOutlinedIcon />
          <PersonOutline onClick={()=>{navigate(`/profile/${currentUser?.id}`)}}/>
        </div>
        <div className="user" style={{ display:'flex', gap: '10px', position:'relative', float:'left', }} >
          <img
            src={currentUser?.profilepic || subProfilePic}
            alt=""
          />
          <div>
            <Link
              to={`/profile/${currentUser?.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>{currentUser?.name}</span>
            </Link>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Navbar;
