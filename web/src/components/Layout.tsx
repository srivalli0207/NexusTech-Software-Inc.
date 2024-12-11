import Grid from '@mui/material/Grid2'
import { Outlet, useLocation } from "react-router-dom"
import SideBar from "./SideBar"
import { Box, useTheme } from '@mui/material'
import TopNavbar from './TopNavbar'
import LayoutNames from './LayoutNames'
import BottomNavbar from './BottomNavbar'
import PostDialog from './PostDialog'

export default function Layout() {
   const theme = useTheme();
   const location = useLocation();

   return (
      <Box position='sticky' display='flex' flexDirection='column' height='100%'>
         <TopNavbar />
         <Box flexGrow={1} sx={{ height: "100%" }}>
            <Grid container>
               <Grid size={{ md: 2, xs: 0 }} sx={{ p: 2, borderRight: 'solid 0.5px', borderColor: theme.palette.divider, display: { md: "inline", xs: "none" } }}>
                  <SideBar />
               </Grid>
               <Grid size={{ md: 8, xs: 12 }} sx={{ p: 0, height: { md: 'calc(100vh - 64px)', xs: 'calc(100vh - 120px)' }, overflowY: "auto" }}>
                  <Outlet />
               </Grid>
               <Grid size={{ md: 2, xs: 0 }} sx={{ p: 2, borderLeft: 'solid 0.5px', borderColor: theme.palette.divider, display: { md: "inline", xs: "none" } }}>
                  <LayoutNames />
               </Grid>
            </Grid>
            <Box sx={{ display: { md: "none", xs: "inline" } }}>
               {(location.pathname === "/" || location.pathname.startsWith("/forums/")) && <PostDialog fab={true} />}
               <BottomNavbar />
            </Box>
         </Box>
      </Box>

   )
}
