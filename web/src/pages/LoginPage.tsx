import { Box, TextField, Stack, Button, useTheme } from "@mui/material"
import { FormEvent } from "react"
import { Link } from "react-router-dom"
import { log_in } from "../utils/auth"
import CSRF_Token from "../utils/csrf_token"

export default function LoginPage() {
   const theme = useTheme()

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      let formObject = Object.fromEntries(formData.entries()) as {username: string, password: string};
      const response = await log_in(formObject as {username: string, password: string})
      if (response.user != null) {
         console.log(response.user)
      }
      else {
         console.log(response.message)
      }
   }

   return (
      <Box 
         component="form"
         onSubmit={ handleSubmit }
         autoComplete="on"
         sx={{ 
            bgcolor: theme.palette.secondary.main,
            borderRadius: 1,
            padding: '20px 20px 20px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '450px',
            width: '450px',
         }}
      >
         <Stack 
            spacing={2.5}
            width="80%"
         >
            <CSRF_Token />
            <h2 style={{marginBottom: 10}}>Sign In</h2>
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
            <Button variant="contained" type='submit'>Sign In</Button>
            <p>Don't have account? <Link to={"../signup"} style={{ color: theme.palette.primary.main }}>Create Account</Link></p>
         </Stack>
      </Box>
   )
}