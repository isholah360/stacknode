import * as React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import "./toggles.css";
import axios from "axios";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import Logout from "@mui/icons-material/Logout";
import { SideBarData } from "./SideBarData";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config";
import { onAuthStateChanged } from "firebase/auth";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const [displayTosty, setDisplayTosty] = useState(false);
  const [distanceData, setDistanceData] = useState({
    minDistance: "",
    maxDistance: "",
    dealName: "",
  });
  const handleLogin = () => {
    // Replace this with your actual authentication logic
    
    setDisplayTosty(!displayTosty)
    const position = 'top-right'; // Set the position to top-right
    
    if (!displayTosty) {
      toast.success('Deel Update', {
        autoClose: 2000,
        transition: Slide, // Use the Slide transition
        position: position,
      });
    } 
  }
  const handleChange = (e) => {
    setDistanceData({ ...distanceData, [e.target.name]: e.target.value });
  };

  const handleUpdateDistances = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://back-6k5o.onrender.com/api/update-distances",
        distanceData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error updating distances:", error.message);
    }
  };

  const handleToggle = async () => {
    try {
      const response = await axios.post(
        "https://back-6k5o.onrender.com/api/togglePromoCodeFeature"
      );
      setFeatureEnabled(response.data.status);
    } catch (error) {
      console.error("Error toggling feature:", error.message);
    }
  };

  const { window } = props;
  const { logout, user } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  React.useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {SideBarData.map((text, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => navigate(`/dashboard${text.path}`)}>
              <ListItemIcon>
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                {text.icon}
              </ListItemIcon>
              <ListItemText
                primary={text.title}
                sx={{ color: "#000", fontWeight: "bolder" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <>
        <div className="promo-container">
          <div className="switch-box">
            <label className="switch">
              <input type="checkbox" onClick={handleToggle} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="promocode">TurnOn Promo</div>
        </div>
        <div className="adjust-distance">
          <form onSubmit={handleUpdateDistances}>
            <div className="dealname">
              <div>
                Deals:
                <input
                  type="text"
                  name="dealName"
                  value={distanceData.dealName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label>
              Min Distance:
              <input
                type="text"
                name="minDistance"
                value={distanceData.minDistance}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Max Distance:
              <input
                type="text"
                name="maxDistance"
                value={distanceData.maxDistance}
                onChange={handleChange}
              />
            </label>
            <br />
            <button className="submit" type="submit" onClick={handleLogin}>
              Update Deals
              <ToastContainer
                transition={Slide} 
                position="top-right" 
                marginTop  ="2rem"
              />
            </button>
          </form>
        </div>
      </>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "#E4780E",
          zIndex: 1000,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Keventers Cafe &amp; Wraps
          </Typography>
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.type === "manager" ? "M" : "A"}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <Avatar>R</Avatar>
              {user?.type}
            </MenuItem>
            <Divider />
            {/* <MenuItem onClick={handleClose}>
              <Avatar>S</Avatar>
              {user?.status ? "Active" : "In-Active"}
            </MenuItem> */}
            {/* <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem> */}
            <MenuItem
              onClick={() => {
                handleClose();
                logout();
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
          {/* <Button color="inherit" onClick={logout}>
            Logout
          </Button> */}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            zIndex: 0,
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
