import { Box, Typography } from "@mui/material"

type ErroBoxProps = {
   message: string,
}

export default function ErrorBox( {message}: ErroBoxProps ) {
   return (
      <Box
         sx={{
            bgcolor: '#EF5350',
            padding: 1,
            borderRadius: 1,
         }}
      >
        <Typography 
            variant="subtitle1" 
            sx={{
               wordBreak: "break-word",
            }}
        >
            {message}
        </Typography>
      </Box>
   )
}