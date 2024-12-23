import { useEffect, useState } from "react";
import { UserProfileResponse } from "../api/user";
import { Box, CircularProgress, List, Typography } from "@mui/material";
import UserListItem from "./UserListItem";

export type UserListProps = {
    requester: Promise<UserProfileResponse[]>
}

export default function UserList({ requester }: UserListProps) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserProfileResponse[]>([]);
  
    useEffect(() => {
      setLoading(true);
      (async () => {
        const res = await requester;
        setUsers(res);
        setLoading(false);
      })();
    }, []);
  
    return (
      <Box>
        {loading && <CircularProgress />}
        {!loading && users.length === 0 && <Typography>No users found.</Typography>}
        <List>
          {users.map((user) => <UserListItem user={user} key={`user-list-item-${user.username}`} />)}
        </List>
      </Box>
    )
  }