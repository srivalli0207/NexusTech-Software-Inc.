import { Box, Typography } from '@mui/material'
import { PostManager } from '../api/post';
import PostList from '../components/PostList';

export default function HomePage() {
  const postManager = PostManager.getInstance();

  return (
    <Box p={2}>
      <div style={{ textAlign: "start", marginBottom: "8px" }}>
        <Typography variant="h2">Home</Typography>
      </div>
      <PostList requester={postManager.getPosts()} />
    </Box>
  );
}
