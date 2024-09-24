import { Box } from "@mui/material"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import { FormEvent } from "react"

export default function SignUpPage() {

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const formData = new FormData(event.currentTarget)
      let formDataObject: { [key: string]: FormDataEntryValue } = {}
      formData.forEach( (value, key) => formDataObject[key] = value );
      const username = (event.currentTarget.elements.namedItem("username") as HTMLFormElement).value;
      const email = (event.currentTarget.elements.namedItem("email") as HTMLFormElement).value;
      const password = (event.currentTarget.elements.namedItem("password") as HTMLFormElement).value;
      const response = await fetch("http://ec2-13-57-195-163.us-west-1.compute.amazonaws.com/api/test/auth/signup", {
         method: "POST",
         body: JSON.stringify({
            username: username,
            email: email,
            password: password
         }),
         headers: {
            "Content-Type": "application/json"
         }
      });
      console.log(response)
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