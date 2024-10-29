import { Box, TextField, Stack, Button, useTheme, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { signup } from "../utils/auth";
import CSRF_Token from "../utils/csrf_token";
import UserProfileBuilder from "../utils/UserProfileBuilder";

export default function SignUpPage() {
   const theme = useTheme();
   const navigate = useNavigate();

   const [loading, setLoading] = useState(false);

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();

      const username = (event.currentTarget.elements.namedItem("username") as HTMLFormElement).value;
      const email = (event.currentTarget.elements.namedItem("email") as HTMLFormElement).value;
      const password = (event.currentTarget.elements.namedItem("password") as HTMLFormElement).value;

      try {
         const userProfile = new UserProfileBuilder()
            .setUsername(username)
            .setEmail(email)
            .setPassword(password)
            .build();

         const response = await signup(userProfile);

         if (response.user != null) {
            console.log('signed up', response.user);
            navigate('/');
         } else {
            console.log('signup failed', response.message);
         }
      } catch (error) {
         console.error("Profile creation failed:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box display='flex' height='100%'>
         <Box
            component="form"
            autoComplete="on"
            onSubmit={handleSubmit}
            bgcolor={theme.palette.secondary.main}
            borderRadius={1}
            padding='20px 20px 20px 20px'
            display='flex'
            justifyContent='center'
            alignItems='center'
            minHeight='550px'
            width='450px'
            margin='auto'
         >
            <Stack spacing={2.5} width="80%">
               <CSRF_Token />
               <h2>Sign Up</h2>
               <TextField required id="username" label="Username" />
               <TextField required id="email" type="email" label="Email" />
               <TextField required id="password" type="password" label="Password" />
               <TextField required id="password_confirm" type="password" label="Confirm Password" />
               <Button variant="contained" type='submit' sx={{ height: '2.5rem' }}>
                  {loading ? <CircularProgress size='1.5rem' color="inherit" /> : 'Create Account'}
               </Button>
               <p>Already have an account? <Link to={"../login"}>Sign In</Link></p>
            </Stack>
         </Box>
      </Box>
   );
}
