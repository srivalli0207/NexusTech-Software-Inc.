import { Box, TextField, Stack, Button, useTheme, CircularProgress, SnackbarCloseReason, Snackbar } from "@mui/material"
import React, { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { log_in } from "../utils/auth"
import CSRF_Token from "../utils/csrf_token"

export default function LoginPage() {
   const theme = useTheme()
   
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [message, setMessage] = useState("");
  
    const handleClose = (
      _event: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason,
    ) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      setLoading(true)
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      let formObject = Object.fromEntries(formData.entries()) as { username: string, password: string };
      const response = await log_in(formObject as { username: string, password: string })

      if (response.user != null) {
         console.log('logged in', response.user)
      } else {
         console.log('loggin failed', response.message);
         setMessage(response.message);
         setOpen(true);
      }

      setLoading(false)
   }

   return (
      <Box display='flex' height='100%'>
         <Box
            component="form"
            onSubmit={handleSubmit}
            autoComplete="on"
            bgcolor={theme.palette.secondary.main}
            borderRadius={1}
            padding='20px 20px 20px 20px'
            display='flex'
            justifyContent='center'
            alignItems='center'
            minHeight='450px'
            width='450px'
            margin='auto'
         >
            <Stack
               spacing={2.5}
               width="80%"
            >
               <CSRF_Token />
               <h2 style={{ marginBottom: 10 }}>Sign In</h2>
               <TextField
                  required
                  name="username"
                  label="Username"
               />
               <TextField
                  required
                  name="password"
                  type="password"
                  label="Password"
               />
               <Button variant="contained" type='submit' sx={{ height: '2.5rem' }} disabled={loading}>
                  {
                     loading ? <CircularProgress size='1.5rem' color="inherit" /> : 'Sign In'
                  }
               </Button>
               <p>Don't have an account? <Link to={"../signup"} style={{ color: theme.palette.primary.main }}>Create Account</Link></p>
            </Stack>
         </Box>
         <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
         />
      </Box>
   )
}