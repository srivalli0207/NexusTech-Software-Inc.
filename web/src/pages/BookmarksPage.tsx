import { Box } from '@mui/material'
import '../styles/App.css'
import '../styles/index.css'
import { UserManager } from '../api/user';
import PostList from '../components/PostList';

export default function BookmarksPage() {
  const userManager = UserManager.getInstance();

  return (
    <Box p={2}>
      <PostList requester={userManager.getBookmarks()} />
    </Box>
  );
}
