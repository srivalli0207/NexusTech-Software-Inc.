import { Typography, List, ListItemAvatar, Avatar, ListItemText, ListItemButton, Badge } from "@mui/material"; 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStatus } from "../utils/StatusContext";
import { useUser } from "../utils/AuthContext";
import { UserManager, UserResponse } from "../api/user";

export default function LayoutNames() {
   const user = useUser();
   const [following, setFollowing] = useState<UserResponse[]>();
   const statuses = useStatus();
   const userManager = UserManager.getInstance();

   useEffect(() => {
      const fetch_follows = async () => {
         setFollowing(undefined);
         if (user != null) {
            const res = await userManager.getFollowing(user.username);
            setFollowing(res);
         }
      };
      fetch_follows();
   }, [user]);

   return (
      <>
         <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
            Following
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
