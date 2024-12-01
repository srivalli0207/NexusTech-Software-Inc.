import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import CommentCard from "./Comment";
import { useSnackbar } from "../utils/SnackbarContext";
import { PostLike } from "../api/post";
import { Comment } from "../api/comment";
import { CommentManager } from "../api/comment";
import CSRF_Token from "../utils/AuthContext";

type CommentDialogProp = {
	post_id: number | undefined;
};

export default function CommentDialog({ post_id }: CommentDialogProp) {
	const snackbar = useSnackbar();
	const [likeState, setLikeState] = useState<PostLike>({
		liked: false,
		likeCount: 0,
		dislikeCount: 0,
	});
	const commentManager = CommentManager.getInstance();
	
	const [comments, setComments] = useState<Comment[]>([])
	const comment_text = useRef<string>("")

	useEffect(() => {
		const get_data = async () => {
			const fetchedComments = await commentManager.getComments(post_id!);
			setComments( fetchedComments )
		}
		get_data()
	}, [])

	const handle_comment_post = async () => {
		const posted_comment = await commentManager.postComment(post_id!, comment_text.current)
		setComments([posted_comment, ...comments, ])
	}

	const handle_comment_like = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
		event.stopPropagation();
		try {
			const res = await commentManager.likeComment(123, like);
			setLikeState(res);
		} catch (err) {
			snackbar({ open: true, message: err as any })
			console.error(err);
		}
	}

	const deleteCommentCallback = async (id: number) => {
		await commentManager.deleteComment(id)
		setComments(comments.filter((value) => value.id !== id) )
	}

	return (
		<Box sx={{ margin: "15px" }}>
			<CSRF_Token />
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
				onChange={(event: ChangeEvent<HTMLInputElement>) => {
					comment_text.current = event.currentTarget.value
				}}
			/>
			<Stack direction="row" justifyContent="flex-end" marginTop="10px">
				<Button variant="outlined" onClick={handle_comment_post}>Post Comment</Button>
			</Stack>
			<Stack spacing={2} sx={{marginTop: '20px'}}>
				{
					comments.map((value) => <CommentCard key={value.id} comment={value} commentDeleteCallback={deleteCommentCallback}/>)
				}
			</Stack>
		</Box>
	);
}
