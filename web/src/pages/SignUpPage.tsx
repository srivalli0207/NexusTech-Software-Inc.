import { Box, TextField, Stack, Button, useTheme, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import UserProfileBuilder from "../utils/UserProfileBuilder";
import { AuthManager } from "../api/auth";
import CSRF_Token from "../utils/AuthContext";
import { useSnackbar } from "../utils/SnackbarContext";

export default function SignUpPage() {
   const theme = useTheme();
   const navigate = useNavigate();
   const snackbar = useSnackbar();
   const [loading, setLoading] = useState(false);
   const authManager = AuthManager.getInstance();

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const username = (event.currentTarget.elements.namedItem("username") as HTMLFormElement).value;
      const email = (event.currentTarget.elements.namedItem("email") as HTMLFormElement).value;
      const password = (event.currentTarget.elements.namedItem("password") as HTMLFormElement).value;
      const confirmPassword = (event.currentTarget.elements.namedItem("confirm_password") as HTMLFormElement).value;
      if (password !== confirmPassword) {
         snackbar({ open: true, message: "Passwords do not match." });
         return;
      }

      setLoading(true);
      try {
         const userProfile = new UserProfileBuilder()
            .setUsername(username)
            .setEmail(email)
            .setPassword(password)
            .build();
         await authManager.signup(userProfile);
         navigate('/');
      } catch (error) {
         snackbar({ open: true, message: (error as any).message });
         console.error("Profile creation failed:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Box display='flex' height='100%'>
         <h2 role="alert"></h2>
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
               <h2 role="heading">Sign Up</h2>
               <TextField required id="username" label="Username" />
               <TextField required id="email" type="email" label="Email" />
               <TextField required id="password" type="password" label="Password" />
               <TextField required id="confirm_password" type="password" label="Confirm Password" />
               <Button variant="contained" type='submit' sx={{ height: '2.5rem' }}>
                  {loading ? <CircularProgress size='1.5rem' color="inherit" /> : 'Create Account'}
               </Button>
               <p>Already have an account? <Link to={"../login"}>Sign In</Link></p>
            </Stack>
         </Box>
      </Box>
   );
}
