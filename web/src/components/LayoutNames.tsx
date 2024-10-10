import { Typography, List, ListItemAvatar, Avatar, ListItemText, ListItemButton } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useUser } from "../utils/auth-hooks";
import { useState, useEffect } from "react";
import { get_follows, follows } from "../utils/fetch";
import { Link } from "react-router-dom";

export default function LayoutNames() {
   const user = useUser()
   const [following, setFollowing] = useState<follows[]>()

   useEffect(() => {
      const fetch_follows = async () => {
         if (user != null) {
            const res = await get_follows(user.username)
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
            {following?.map((value, _) =>
               <ListItemButton key={value.pk} component={Link} to={`/user-profile/${value.following.username}`}>
                  <ListItemAvatar>
                     <Avatar>
                        <PersonIcon />
                     </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                     primary={value.following.username}
                  />
               </ListItemButton>
            )}
         </List>
      </>
   )
}