import { Stack, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';

export default function SideBar() {
   return (
      <Stack>
         <Button startIcon={<HomeIcon/>}>Home</Button>
      </Stack>
    )
}