import { Link } from 'react-router-dom';
import { Stack, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import { useUser } from '../utils/auth-hooks';

export default function SideBar() {
   const user = useUser();

   return (
      <Stack sx={{ borderRight: '5px', borderColor: 'red' }}>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<HomeIcon />}>
            Home
         </Button>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<ExploreIcon />}>
            Forums
         </Button>
         { // Authenticated routes
         user && <>
            <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<BookmarkIcon />}>
               Bookmarks
            </Button>
            <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<MessageIcon />}>
               Messages
            </Button>
         </>
         }
      </Stack>
   )
}