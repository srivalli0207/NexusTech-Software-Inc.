import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentDialog from "../components/CommentDialog";
import { Post, PostManager } from "../api/post";
import PostCard from "../components/PostCard";

export default function PostPage() {
  let { post_id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const postManager = PostManager.getInstance();

  useEffect(() => {
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
      {!loading && (
        <>
          <PostCard post={post!} onDelete={() => {}} />
          {<CommentDialog post_id={post!.id}/>}
        </>
      )}
    </>
  );
}
