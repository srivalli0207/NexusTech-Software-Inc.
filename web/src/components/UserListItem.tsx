import { useNavigate } from "react-router-dom";
import { UserResponse } from "../utils/fetch";
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export default function UserListItem({ user }: { user: UserResponse }) {
  const navigate = useNavigate();

  return (
    <ListItemButton onClick={() => navigate(`/user-profile/${user.username}`)}>
      <ListItemAvatar>
        <Avatar src={user.profilePicture ?? undefined}>
          {user.username[0].toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={user.displayName ?? user.username}
        secondary={
          <>
            {`@${user.username}`}
            <Box sx={{ height: "8px" }} />
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {user.bio ?? "No information given."}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
}
