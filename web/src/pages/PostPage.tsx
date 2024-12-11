import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import CommentDialog from "../components/CommentDialog";
import { Post, PostManager } from "../api/post";
import PostCard from "../components/PostCard";
import { CircularProgress } from "@mui/material";

export default function PostPage() {
  let { post_id } = useParams();
  const { state } = useLocation();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const postManager = PostManager.getInstance();

  useEffect(() => {
    if (state !== null && state.postState) {
      setPost(state.postState);
      setLoading(false);
      return;
    }
    setLoading(true);
    postManager.getPost(parseInt(post_id!))
      .then((res) => {
        setPost(res);
        setLoading(false);      
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {!loading && (
        <>
          <PostCard post={post!} onDelete={() => {}} />
          <CommentDialog post_id={post!.id}/>
        </>
      )}
    </>
  );
}
