import { Box } from "@mui/material"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"

export default function LoginPage() {
   return (
      <Box 
         component="form"
         onSubmit={()=> console.log('submit form!')}

         sx={{ 
            bgcolor: 'grey', 
            borderRadius: 1,
            padding: 1.5,
            display: 'flex',
            justifyContent:'center',
            alignItems:'center',
            width: '500px',
            height: '500px'
         }}
      >
         <Stack 
            spacing={2}
         >
            Login
            <TextField 
               required
               id="outlined-required"
               label="Email"

            />
            <TextField
               required
               id="outlined-password-input"
               type="password"
               label="Password"
            />
            <Button variant="contained" fullWidth type='submit'>Sign In</Button>
         </Stack>
      </Box>
   )
}