import { Box } from '@mui/material'
import { PostManager } from '../api/post';
import PostList from '../components/PostList';

export default function HomePage() {
  const postManager = PostManager.getInstance();

  return (
    <Box p={2}>
      <PostList requester={postManager.getPosts()} />
    </Box>
  );
}
