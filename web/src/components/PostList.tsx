import { useEffect, useState } from "react";
import { Post } from "../api/post"
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import PostCard from "./PostCard";

export type PostListProps = {
  requester: Promise<Post[]>,
  postCallback?: boolean | ((post: Post) => boolean);
}

export default function PostList({ requester, postCallback = false }: PostListProps) {
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

  const onPostCreated = async (e: any) => {
    const post: Post = e.detail;
    if ((typeof postCallback === "boolean" && postCallback) || (typeof postCallback === "function" && postCallback(post))) {
      setPosts((posts) => [post, ...posts]);
    }
  }

  useEffect(() => {
    document.addEventListener('nexus.post.created', onPostCreated)

    return () => {
       document.removeEventListener('nexus.post.created', onPostCreated);
    }
 }, [])

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && posts.length === 0 && <Typography>No posts found.</Typography>}
      <Stack spacing={2}>
        {posts.map((post) => {
          return (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          );
        })}
      </Stack>
    </Box>
  );
}