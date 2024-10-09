import Grid from '@mui/material/Grid2'
import { Outlet } from "react-router-dom"
import SideBar from "./SideBar"
import { Box, Typography, useTheme, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, IconButton, Avatar } from '@mui/material'
import { get_follows, follows } from '../utils/fetch'
import NexifyAppBar from './NexifyAppBar'
import { useEffect, useState } from 'react'
import { useUser } from '../utils/auth-hooks'
import LayoutNames from './LayoutNames'

export default function Layout() {
   const theme = useTheme();

   return (
      <Box id='Page-Container' position='sticky' display='flex' flexDirection='column' height='100%'>
         <NexifyAppBar />
         <Box id='Page-Body' flexGrow={1}>
            <Grid container height='100%'>
               <Grid id='Side-Bar' bgcolor={theme.palette.background.default} size={2} sx={{ padding: '1.5rem', borderRight: 'solid 0.5px', borderColor: theme.palette.divider }}>
                  <SideBar />
               </Grid>
               <Grid id='Page-Content' bgcolor={theme.palette.background.default} size={8} sx={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                  <Outlet />
               </Grid>
               <Grid id='Forum-Bar' bgcolor={theme.palette.background.default} size={2} sx={{ padding: '1.5rem', borderLeft: 'solid 0.5px', borderColor: theme.palette.divider }}>
                  <LayoutNames />
               </Grid>
            </Grid>

         </Box>
      </Box>

   )
}
