import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Menu, MenuItem } from "@mui/material";
//import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/auth-hooks";
import { log_out } from "../utils/auth";
import HubIcon from '@mui/icons-material/Hub';
import { useState } from "react";


export default function NexifyAppBar () {
   const user = useUser();
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);

   const handleLogout = async () => {
      handleClose();
      await log_out()
      navigate('/')
   }

   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <AppBar id='Appbar-Header' position='static'>
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
            <Typography variant="h6" component="div" sx={{ flexgrow: 1 }}>
               Nexus
            </Typography>
            {
               user != null ?
                  <>
                     <IconButton sx={{ marginLeft: 'auto', marginRight: '10px' }} onClick={handleClick}>
                        <Avatar src={user!.pfp !== null ? user!.pfp : undefined}>{user!.username[0].toUpperCase()}</Avatar>
                     </IconButton>
                     <Menu anchorEl={anchorEl} open={open} onClose={handleClose} onClick={handleClose}>
                        <MenuItem component={Link} to={`/user-profile/${user!.username}`}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                     </Menu>
                  </>
                  :
                  <Button color="inherit" sx={{ marginLeft: 'auto' }} onClick={() => navigate('/login')}>Login</Button>
            }
         </Toolbar>
      </AppBar>
   )
}
