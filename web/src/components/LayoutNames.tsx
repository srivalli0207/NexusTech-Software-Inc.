import { Typography, List, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from "../utils/auth-hooks";
import { useState, useEffect } from "react";
import { get_follows, follows } from "../utils/fetch";

export default function LayoutNames() {
   const user = useUser()
   const [following, setFollowing] = useState<follows[]>()

   useEffect(() => {
      const fetch_follows = async () => {
         if (user != null) {
            const res = await get_follows(user.username)
            console.log('follows', res)
            setFollowing(res)
         }
      }
      fetch_follows()
   }, [])

   return (
      <>
         <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
            Following
         </Typography>
         <List>
            {following?.map((value, index) =>
               <ListItem
                
               >
                  <ListItemAvatar>
                     <Avatar>
                        <PersonIcon />
                     </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                     primary={value.following.username}
                  />
               </ListItem>
            )}
         </List>
      </>
   )
}