import { useEffect, useState } from "react";
import { Post } from "../api/post"
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import PostCard from "./PostCard";

export type PostListProps = {
    requester: Promise<Post[]>
}

export default function PostList({ requester }: PostListProps) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleDelete = async (post: Post) => {
    setPosts(posts.filter((p) => p.id != post.id));
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      const posts = await requester;
      setPosts(posts);
      setLoading(false);
    })();
  }, []);

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && posts.length === 0 && <Typography>No posts found.</Typography>}
      <Stack spacing={2}>
        {posts.map((post, index) => {
          return (
              <PostCard key={index} post={post} onDelete={handleDelete} />
          );
        })}
      </Stack>
    </Box>
  );
}