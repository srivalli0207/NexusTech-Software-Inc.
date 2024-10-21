import { Box, CircularProgress, Stack } from '@mui/material'
import '../styles/App.css'
import '../styles/index.css'
import Typography from '@mui/material/Typography'
import PostDialog from '../components/PostDialog';
import { useUser } from '../utils/auth-hooks';
import { useEffect, useState } from 'react';
import { get_bookmarks, PostResponse } from '../utils/fetch';
import PostFeedCard from '../components/PostFeedCard';

export default function BookmarksPage() {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostResponse[]>([])

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    get_bookmarks().then((res) => {
      setPosts(res);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
    })
  }, []);

  const handleDelete = async (post: PostResponse) => {
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
                <PostFeedCard key={index} post={post} onDelete={handleDelete} />
              );
            })}
          </Stack>
        </>
      }
      
    </Box>
  );
}
