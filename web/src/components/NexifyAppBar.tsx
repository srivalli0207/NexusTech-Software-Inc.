import { Button, AppBar, Toolbar, Box } from "@mui/material"
import { Outlet, Link } from "react-router-dom"
import { AuthContext } from "../utils/AuthContext"
import { useContext } from "react"
import { log_out } from "../utils/auth"

export default function NexifyAppBar() {
   const user = useContext(AuthContext)
   
   const handleSubmit = async () => {
      await log_out()
   }

   const renderAuthButtons = () => {
      if (user != null) {
         return (
            <form onSubmit={ handleSubmit } style={{ marginLeft: 'auto' }} >
               <Button type='submit' color="inherit" >Logout</Button>
            </form>
         )
      }
      else {
         return <Button color="inherit" sx={{ marginLeft: 'auto' }} component={Link} to="login">Login</Button>
      }
   }

   return (
      <>
         <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'
               sx={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
               }}
            >
               <Toolbar>
                  {renderAuthButtons()}
               </Toolbar>
            </AppBar>
         </Box>
         <Outlet />
      </>
   )
}
