import { Typography, List, ListItemAvatar, Avatar, ListItemText, ListItemButton, Badge } from "@mui/material"; 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStatus } from "../utils/StatusContext";
import { useUser } from "../utils/AuthContext";
import { UserManager, UserProfileResponse } from "../api/user";

export default function LayoutNames() {
   const user = useUser();
   const [following, setFollowing] = useState<UserProfileResponse[]>();
   const statuses = useStatus();
   const userManager = UserManager.getInstance();

   useEffect(() => {
      (async () => {
         setFollowing(undefined);
         if (user != null) {
            const res = await userManager.getFriends(user.username);
            setFollowing(res);
         }
      })();
   }, [user]);

   return (
      <>
         <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
            Friends
         </Typography>
         <List>
            {following?.map((value) => (
               <ListItemButton key={`layout-following-${value.username}`} component={Link} to={`/profile/${value.username}`} replace={true}>
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
                              backgroundColor: statuses.has(value.username) ? 'green' : 'red',
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
