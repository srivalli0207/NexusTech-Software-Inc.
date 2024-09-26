import { Box } from "@mui/material"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { FormEvent } from "react"
import { signup } from "../utils/auth"
import CSRF_Token from "../utils/csrf_token"

export default function SignUpPage() {

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const username = (event.currentTarget.elements.namedItem("username") as HTMLFormElement).value;
      const email = (event.currentTarget.elements.namedItem("email") as HTMLFormElement).value;
      const password = (event.currentTarget.elements.namedItem("password") as HTMLFormElement).value;
      await signup({ username: username, email: email, password: password })
   }

   return (
      <Box 
         component="form"
         autoComplete="on"
         onSubmit={ handleSubmit }
         sx={{ 
            bgcolor: 'grey', 
            borderRadius: 1,
            padding: '20px 20px 20px 20px',
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            minHeight: '550px',
            width: '450px'
         }}
      >
         <Stack 
            spacing={2.5}
            width="80%"
         >
            <CSRF_Token />
            <h2>Sign Up</h2>
            <TextField 
               required
               id="username"
               label="Username"
            />
            <TextField 
               required
               id="email"
               type="email"
               label="Email"
            />
            <TextField
               required
               id="password"
               type="password"
               label="Password"
            />
            <TextField
               required
               id="password_confirm"
               type="password"
               label="Confirm Password"
            />
            <Button variant="contained" type='submit'>Create Account</Button>
            <p>Already have an account? <Link to={"../login"}>Sign In</Link></p>
         </Stack>
      </Box>
   )
}