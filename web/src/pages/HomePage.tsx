import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { PostManager } from '../api/post';
import PostList from '../components/PostList';
import { useState } from 'react';
import { useUser } from '../utils/AuthContext';

export default function HomePage() {
  const user = useUser();
  const [filter, setFilter] = useState(user ? "following" : "latest");
  const postManager = PostManager.getInstance();

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  return (
    <Box p={2}>
      <div style={{ textAlign: "start", marginBottom: "8px" }}>
        <Typography variant="h2">Home</Typography>
        <FormControl>
          <InputLabel id="filter-select-label">Filter</InputLabel>
          <Select
            labelId="filter-select-label"
            value={filter}
            label="Filter"
            onChange={handleChange}
          >
            <MenuItem value={"latest"}>Latest</MenuItem>
            {user && <MenuItem value={"following"}>Following</MenuItem>}
            <MenuItem value={"top_24"}>Top (24 hours)</MenuItem>
            <MenuItem value={"top_7"}>Top (1 week)</MenuItem>
            <MenuItem value={"top_all"}>Top (all time)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <PostList key={filter} requester={postManager.getPosts(filter)} postCallback={filter === "latest" || filter === "following"} />
    </Box>
  );
}
