import { Link } from 'react-router-dom';
import { Stack, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SideBar() {
   return (
      <Stack sx={{ borderRight: '5px', borderColor: 'red' }}>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<HomeIcon />}>
            Home
         </Button>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<ExploreIcon />}>
            Explore
         </Button>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<FavoriteIcon />}>
            Likes
         </Button>
         <Button component={Link} to='../' sx={{ width: '100%', justifyContent: 'flex-start' }} color="secondary" size="large" startIcon={<BookmarkIcon />}>
            Favorites
         </Button>
      </Stack>
   )
}