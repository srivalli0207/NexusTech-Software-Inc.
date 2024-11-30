import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import Comment from "./Comment";
import { useSnackbar } from "../utils/SnackbarContext";
import { PostLike } from "../api/post";
import { CommentManager } from "../api/comment";
import CSRF_Token from "../utils/AuthContext";

type CommentDialogProp = {
  post_id: number | undefined;
};

export default function CommentDialog({ post_id }: CommentDialogProp) {
  const [likeState, setLikeState] = useState<PostLike>({
    liked: false,
    likeCount: 0,
    dislikeCount: 0,
  });
  const snackbar = useSnackbar();
  const [comment_text, set_comment_text] = useState<string>("");
  const commentManager = CommentManager.getInstance();

  useEffect(() => {
      const get_data = async () => {
         await commentManager.getComments(post_id!);
      }
      get_data()
  }, [])

  const handle_comment_post = async () => {
   console.log(post_id)
   await commentManager.postComment(post_id!, "dummy comment")
  }
  
  const handle_comment_like = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
    event.stopPropagation();
    try {
      const res = await commentManager.likeComment(123, like);
      setLikeState(res);
    } catch(err) {
      snackbar({ open: true, message: err as any})
      console.error(err);
    }
  }

  return (
    <Box sx={{ margin: "15px" }}>
      <CSRF_Token/>
      <div style={{ textAlign: "start" }}>Comments</div>
      <TextField
        autoFocus
        margin="dense"
        id="comment_text"
        name="comment_text"
        fullWidth
        multiline
        maxRows={5}
        variant="outlined"
        
      />
      <Stack direction="row" justifyContent="flex-end" marginTop="10px">
        <Button variant="outlined" onClick={handle_comment_post}>Post Comment</Button>
      </Stack>
      <Comment />
    </Box>
  );
}
