import { Stack, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function SideBar() {
   return (
      <Stack>
         <Button color="secondary" size="large" startIcon={<HomeIcon/>}>Home</Button>
         <Button color="secondary" size="large" startIcon={<ExploreIcon/>}>Explore</Button>
         <Button color="secondary" size="large" startIcon={<FavoriteIcon/>}>Likes</Button>
         <Button color="secondary" size="large" startIcon={<BookmarkIcon/>}>Favorites</Button>
      </Stack>
    )
}