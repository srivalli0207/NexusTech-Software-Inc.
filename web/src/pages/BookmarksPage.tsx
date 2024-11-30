import { Box, CircularProgress, Stack } from '@mui/material'
import '../styles/App.css'
import '../styles/index.css'
import Typography from '@mui/material/Typography'
import PostDialog from '../components/PostDialog';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { useUser } from '../utils/AuthContext';
import { Post } from '../api/post';
import { UserManager } from '../api/user';

export default function BookmarksPage() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const userManager = UserManager.getInstance();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    userManager.getBookmarks().then((res) => {
      setPosts(res);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
    })
  }, []);

  const handleDelete = async (post: Post) => {
    setPosts(posts.filter((p) => p.id != post.id));
  };

  return (
    <Box p={2}>
      {user &&
        <>
          <Box sx={{ display: { md: "none", xs: "inline" } }}>
            <PostDialog fab />
          </Box>
          {loading && <CircularProgress />}
          {!loading && posts.length === 0 && <Typography>No bookmarks found.</Typography>}
          <Stack spacing={2}>
            {posts.map((post, index) => {
              return (
                <PostCard key={index} post={post} onDelete={handleDelete} />
              );
            })}
          </Stack>
        </>
      }
      
    </Box>
  );
}
