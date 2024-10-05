import { AppBar, Toolbar, IconButton, Typography, Avatar, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/auth-hooks";
import { log_out } from "../utils/auth";


export default function NexifyAppBar () {
   const user = useUser()
   const navigate = useNavigate()

   const handleLogout = async () => {
      await log_out()
      navigate('/')
   }

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
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" component="div" sx={{ flexgrow: 1 }}>
                  Nexify
               </Typography>
               {
                  user != null ?
                     <>
                        <IconButton sx={{ p: 2, marginLeft: 'auto', marginRight: '10px' }} component={Link} to='/user-profile'>
                           <Avatar>{user?.username[0].toUpperCase()}</Avatar>
                        </IconButton>
                        <Button type='submit' onClick={handleLogout} color="inherit">Logout</Button>
                     </>
                     :
                     <Button color="inherit" sx={{ marginLeft: 'auto' }} onClick={() => navigate('/login')}>Login</Button>
               }
            </Toolbar>
         </AppBar>
   )
}
