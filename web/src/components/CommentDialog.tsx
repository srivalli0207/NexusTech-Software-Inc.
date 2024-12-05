import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import CommentCard from "./Comment";
import { Comment } from "../api/comment";
import { CommentManager } from "../api/comment";
import CSRF_Token from "../utils/AuthContext";
import { useTheme } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

type CommentDialogProp = {
	post_id: number;
};

export default function CommentDialog({ post_id }: CommentDialogProp) {
	const theme = useTheme()
	const commentManager = CommentManager.getInstance();

	const comment_text = useRef<string>("")
	const [toggleComment, setToggleComment] = useState<boolean>(false)
	const [commentsLoading, setCommentsLoading] = useState<boolean>(true)
	const [comments, setComments] = useState<Comment[]>([])


	useEffect(() => {
		const get_data = async () => {
			const fetchedComments = await commentManager.getComments(post_id);
			setComments(fetchedComments.reverse())
			setCommentsLoading(false)
		}
		get_data()
	}, [])

	const handle_comment_post = async () => {
		if (comment_text.current.length === 0) {
			return
		}

		const posted_comment = await commentManager.postComment(post_id, comment_text.current)
		setComments([posted_comment, ...comments,])
		setToggleComment(false)
		comment_text.current = ""
	}

	const deleteCommentCallback = async (id: number) => {
		await commentManager.deleteComment(id)
		setComments(comments.filter((value) => value.id !== id))
	}

	return (
		<Box sx={{ margin: "15px" }}>
			<CSRF_Token />
			{
				toggleComment ?
					<>
						<TextField
							sx={{
								borderColor: theme.palette.secondary.main,
								"& .MuiOutlinedInput-root": {
									"&.Mui-focused fieldset": {
										borderColor: theme.palette.secondary.main,
										borderWidth: '1px'
									},
									"&:hover fieldset": {
										borderColor: theme.palette.secondary.main,
										borderWidth: '1px'
									},
								}
							}}
							autoFocus
							margin="dense"
							id="comment_text"
							name="comment_text"
							fullWidth
							multiline
							maxRows={5}
							variant="outlined"
							placeholder="Leave a comment..."
							onChange={(event: ChangeEvent<HTMLInputElement>) => {
								comment_text.current = event.currentTarget.value
							}}
						/>
						<Stack direction="row" justifyContent="flex-end" marginTop="10px" spacing={2}>
							<Button variant="outlined" onClick={() => setToggleComment(false)}>Cancel</Button>
							<Button variant="contained" onClick={handle_comment_post}>Post Comment</Button>
						</Stack>
					</>
					:
					<Button
						sx={{
							borderColor: theme.palette.secondary.main,
							color: theme.palette.secondary.main,
							'&.MuiButton-root:hover': { bgcolor: 'transparent', borderColor: theme.palette.secondary.main },
							justifyContent: "flex-start",
							padding: '10px',
							width: '100%',
						}}

						variant='outlined'
						onClick={() => setToggleComment(true)}
					>
						Comment...
					</Button>
			}

			{
				commentsLoading ?
					<CircularProgress sx={{ marginTop: '30px' }} />
					:
					<Stack spacing={2} sx={{ marginTop: '20px' }}>
						{
							comments.map((value) =>
								<CommentCard
									key={value.id}
									comment={value}
									commentDeleteCallback={deleteCommentCallback}
								/>
							)
						}
					</Stack>
			}
		</Box>
	);
}
