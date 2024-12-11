import { Box, Typography } from '@mui/material'
import '../styles/App.css'
import '../styles/index.css'
import { UserManager } from '../api/user';
import PostList from '../components/PostList';

export default function BookmarksPage() {
  const userManager = UserManager.getInstance();

  return (
    <Box p={2}>
      <div style={{ textAlign: "start", marginBottom: "8px" }}>
        <Typography variant="h2">Bookmarks</Typography>
      </div>
      <PostList requester={userManager.getBookmarks()} />
    </Box>
  );
}
