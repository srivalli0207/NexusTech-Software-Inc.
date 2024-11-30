import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import HubIcon from '@mui/icons-material/Hub';
import { useState } from "react";
import PostDialog from "./PostDialog"; 
import AppBarSearch from "./AppBarSearch";
import { useUser } from "../utils/AuthContext";
import { AuthManager } from "../api/auth";


export default function TopNavbar() {
   const user = useUser();
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const authManager = AuthManager.getInstance();

   const handleLogout = async () => {
      handleClose();
      await authManager.logout();
      navigate('/')
   }

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <AppBar id='Appbar-Header' position='sticky' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
         <Toolbar>
            <IconButton
               size="large"
               edge="start"
               color="inherit"
               aria-label="menu"
               sx={{ mr: 2 }}
            >
               <HubIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexgrow: 1, color: '#E6E6FA'}}>
               Nexus
            </Typography>
            <Box sx={{ marginLeft: "auto", width: "20vw", display: { md: "inline", xs: "none" } }}>
               <AppBarSearch />
            </Box>
            
            {
               user != null ?
                  <Box sx={{ marginLeft: "auto" }}>
                     <Box sx={{ marginRight: "16px", display: { md: "inline", xs: "none" } }}>
                        <PostDialog />
                     </Box>
                     <IconButton onClick={handleClick}>
                        <Avatar src={user!.pfp !== null ? user!.pfp : undefined}>{user!.username[0].toUpperCase()}</Avatar>
                     </IconButton>
                     <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                        <MenuItem component={Link} to={`/profile/${user!.username}`}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                     </Menu>
                  </Box>
                  :
                  <Button color="inherit" sx={{ marginLeft: 'auto' }} onClick={() => navigate('/login')}>Login</Button>
            }
            
         </Toolbar>
      </AppBar>
   )
}
