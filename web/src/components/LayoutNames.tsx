import { Typography, List, ListItemAvatar, Avatar, ListItemText, ListItemButton, Badge } from "@mui/material"; 
import { useUser } from "../utils/auth-hooks";
import { useState, useEffect } from "react";
import { get_follows, UserResponse} from "../utils/fetch";
import { Link } from "react-router-dom";

export default function LayoutNames() {
   const user = useUser();
   const [following, setFollowing] = useState<UserResponse[]>();

   useEffect(() => {
      const fetch_follows = async () => {
         if (user != null) {
            const res = await get_follows(user.username);
            setFollowing(res);
         }
      };
      fetch_follows();
   }, []);

   return (
      <>
         <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
            Following
         </Typography>
         <List>
            {following?.map((value) => (
               <ListItemButton key={`layout-following-${value.username}`} component={Link} to={`/user-profile/${value.username}`} replace={true}>
                  <ListItemAvatar>
                     <Badge
                        overlap="circular"
                        anchorOrigin={{
                           vertical: 'bottom',
                           horizontal: 'right',
                        }}
                        variant="dot"
                        sx={{
                           '& .MuiBadge-dot': {
                              backgroundColor: value.isOnline ? 'green' : 'red',
                              height: '12px',
                              width: '12px',
                              borderRadius: '50%',
                           },
                        }}
                     >
                        <Avatar aria-label="pfp" src={value.profilePicture ?? undefined}>
                           {value.profilePicture ? null : value.username[0].toUpperCase()}
                        </Avatar>
                     </Badge>
                  </ListItemAvatar>
                  <ListItemText primary={value.username} />
               </ListItemButton>
            ))}
         </List>
      </>
   );
}
