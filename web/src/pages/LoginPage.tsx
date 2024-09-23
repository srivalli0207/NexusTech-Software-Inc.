import { Box } from "@mui/material"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"

export default function LoginPage() {
   return (
      <Box 
         component="form"
         onSubmit={()=> console.log('submit form!')}
         autoComplete="on"
         sx={{ 
            bgcolor: 'grey', 
            borderRadius: 1,
            padding: '20px 20px 20px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '450px',
            width: '450px'
         }}
      >
         <Stack 
            spacing={2.5}
            width="80%"
         >
            <h2 style={{marginBottom: 10}}>Sign In</h2>
            <TextField 
               required
               id="email"
               label="Email"
               type="email"
            />
            <TextField
               required
               id="password"
               type="password"
               label="Password"
            />
            <Button variant="contained" type='submit'>Sign In</Button>
            <p>Don't have account? <Link to={"../signup"}>Create Account</Link></p>
         </Stack>
      </Box>
   )
}