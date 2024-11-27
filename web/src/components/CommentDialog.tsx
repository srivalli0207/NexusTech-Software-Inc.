import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { LikeResponse } from "../utils/fetch";
import Comment from "./Comment";
import { post_comment,  get_comments, like_comment } from "../utils/fetch";
import CSRF_Token from "../utils/csrf_token";
import { useSnackbar } from "../utils/SnackbarContext";

type CommentDialogProp = {
  post_id: string | undefined;
};

export default function CommentDialog({ post_id }: CommentDialogProp) {
  const [likeState, setLikeState] = useState<LikeResponse>({
    liked: false,
    likeCount: 0,
    dislikeCount: 0,
  });
  const snackbar = useSnackbar();
  const [comment_text, set_comment_text] = useState<string>("")

  useEffect(() => {
      const get_data = async () => {
         
         await get_comments(post_id!)
      }
      get_data()

  }, [])

  const handle_comment_post = async () => {
   console.log(post_id)
   await post_comment(post_id!, "dummy comment")
  }
  
  const handle_comment_like = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
    event.stopPropagation();
    try {
      const res = await like_comment(123, like);
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
