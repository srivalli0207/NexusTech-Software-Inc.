import { Button, AppBar, Toolbar, Box } from "@mui/material"
import { Outlet, Link, useNavigate } from "react-router-dom"
import { log_out } from "../utils/auth"
import { useUser } from "../utils/auth-hooks"

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
               {
                  user != null ?
                     <Button type='submit' onClick={handleLogout} color="inherit" sx={{ marginLeft: 'auto' }}>Logout</Button>
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
