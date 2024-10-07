import Grid from '@mui/material/Grid2'
import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import { Box, Typography } from '@mui/material'
import NexifyAppBar from './NexifyAppBar'


export default function Layout() {





   return (
      <Box id='Page-Container' position='sticky' display='flex' flexDirection='column' height='100%'>
         <NexifyAppBar />
         <Box id='Page-Body' flexGrow={1}>
            <Grid container height='100%'>
               <Grid id='Side-Bar' bgcolor='#202020' size={2} sx={{ padding: '1.5rem', borderRight: 'solid 0.5px', borderColor: '##a3a3a3' }}>
                  <SideBar />
               </Grid>
               <Grid id='Page-Content' bgcolor='#202020' size={8} sx={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                  <Outlet />
               </Grid>
               <Grid id='Forum-Bar' bgcolor='#202020' size={2} sx={{ padding: '1.5rem', borderLeft: 'solid 0.5px', borderColor: '##a3a3a3' }}>
                  <Typography>other stuff here</Typography>
               </Grid>
            </Grid>
         </Box>
      </Box>
   )
}
