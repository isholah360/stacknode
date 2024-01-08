import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Navigate, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard/orders" />;
  }

  return (
    <div>
      <Bar />
      <Outlet />
    
    </div>
  );
};

function Bar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#E4780E",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            component={Link}
            to="/"
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", flexGrow: 1 }}
          >
            Keventers Caf&#233; &amp; Wraps
            <Clikced/>
          </Typography>
         
          {user ? (
            <Button
              color="inherit"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const Clikced = ()=>{
  return(
    <>
    <Button>Clikc</Button>
    </>
  )
}