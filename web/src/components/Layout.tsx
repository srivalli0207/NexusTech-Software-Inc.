import Grid from '@mui/material/Grid2'
import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import { Box, useTheme } from '@mui/material'
import NexifyAppBar from './NexifyAppBar'
import LayoutNames from './LayoutNames'

export default function Layout() {
   const theme = useTheme();

   return (
      <Box id='Page-Container' position='sticky' display='flex' flexDirection='column' height='100%'>
         <NexifyAppBar />
         <Box id='Page-Body' flexGrow={1}>
            <Grid container>
               <Grid id='Side-Bar' size={2} sx={{ padding: '1.5rem', borderRight: 'solid 0.5px', borderColor: theme.palette.divider }}>
                  <SideBar />
               </Grid>
               <Grid id='Page-Content' size={8} sx={{ display: 'flex', flexDirection: 'column', padding: '1rem', height: 'calc(100vh - 64px)', overflowY: "auto" }}>
                  <Outlet />
               </Grid>
               <Grid id='Forum-Bar' size={2} sx={{ padding: '1.5rem', borderLeft: 'solid 0.5px', borderColor: theme.palette.divider }}>
                  <LayoutNames />
               </Grid>
            </Grid>

         </Box>
      </Box>

   )
}
