import { Button, AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { log_out } from "../utils/auth"
import { useUser } from "../utils/auth-hooks"
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';


export default function NexifyAppBar() {
   const user = useUser()
   const navigate = useNavigate()

   const handleLogout = async () => {
      await log_out()
      navigate('/')
   }

   return (
      <Box id='Page-Container' position='sticky' display='flex' flexDirection='column' height='100%'>
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
                        <IconButton sx={{ p: 2, marginLeft: 'auto', marginRight: '10px' }}>
                           <Avatar>{user?.username[0]}</Avatar>
                        </IconButton>
                        <Button type='submit' onClick={handleLogout} color="inherit">Logout</Button>
                     </>
                     :
                     <Button color="inherit" sx={{ marginLeft: 'auto' }} component={Link} to="login">Login</Button>
               }
            </Toolbar>
         </AppBar>
         <Box id='Page-Body' flexGrow={1}>
            <Outlet />
         </Box>
      </Box>
   )
}
