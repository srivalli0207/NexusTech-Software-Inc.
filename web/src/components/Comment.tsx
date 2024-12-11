import Card from "@mui/material/Card";
import { Button } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { CardActions } from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Comment } from "../api/comment";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useUser } from "../utils/AuthContext";
import { PostLike } from "../api/post";
import { useSnackbar } from "../utils/SnackbarContext";
import { CommentManager } from "../api/comment";
import { green, red } from "@mui/material/colors";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import ProfileTooltip from "./ProfileTooltip";
import moment from "moment";

type CommentCardProp = {
	comment: Comment
	commentDeleteCallback: (id: number) => void
}

export default function CommentCard({ comment, commentDeleteCallback }: CommentCardProp) {
	const theme = useTheme()
	const user = useUser();
	const commentManager = CommentManager.getInstance();
	const snackbar = useSnackbar();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const [showReplyBox, setShowReplyBox] = useState<boolean>(false)
	const [showReplies, setShowReplies] = useState<boolean>(false)

	const [likeState, setLikeState] = useState<PostLike>({
		liked: comment.liked,
		likeCount: comment.likeCount,
		dislikeCount: comment.dislikeCount,
	});

	useEffect(() => {
		setLikeState({
			liked: comment.liked,
			likeCount: comment.likeCount,
			dislikeCount: comment.dislikeCount,
		})
	}, [comment])


	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!open) setAnchorEl(event.currentTarget);
	}

	const handle_comment_like = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
		event.stopPropagation();
		try {
			const res = await commentManager.likeComment(comment.id, like);
			setLikeState(res);
			comment.liked = res.liked
			comment.likeCount = res.likeCount
			comment.dislikeCount = res.dislikeCount
		} catch (err) {
			snackbar({ open: true, message: err as any })
			console.error(err);
		}
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleDelete = () => {
		commentDeleteCallback(comment.id)
		handleClose()
	}

	const replyText = useRef<string>('')
	const [commentReplies, setCommentReplies] = useState<Comment[]>([])
	const handleCommentReply = async () => {
		if (replyText.current.length === 0) {
			return
		}

		const res = await commentManager.postCommentReply(comment.id, replyText.current)
		setCommentReplies([res, ...commentReplies])

		replyText.current = ''
		comment.replyCount += 1

		setShowReplyBox(false)
	}

	const handleShowReplies = async () => {
		if (showReplies)
			setShowReplies(false)
		else {
			const res = await commentManager.getCommentReplies(comment.id)
			setCommentReplies(res.reverse())
			setShowReplies(true)
		}
	}

	const deleteCommentReplyCallback = async (id: number) => {
		await commentManager.deleteComment(id)
		setCommentReplies(commentReplies.filter((value) => value.id !== id))
		comment.replyCount -= 1
	}

	return (
		<>
			<Card sx={{ padding: '10px', border: 'none', textAlign: 'left' }} variant="outlined">
				<CardHeader
					avatar={
						<ProfileTooltip profile={comment.user} />
					}
					title={comment.user.displayName ?? comment.user.username}
					subheader={`@${comment.user.username}`}
					action={
						<>
							{moment(new Date(comment.creation_date)).startOf("m").fromNow()}
							<IconButton
								aria-label="settings"
								aria-controls={true ? 'basic-menu' : undefined}
								aria-haspopup="true"
								aria-expanded={true ? 'true' : undefined}
								onClick={handleClick}
							>
								<MoreVertIcon />
								<Menu id={`comment-menu-${comment.id}`} anchorEl={anchorEl} open={open} onClose={handleClose}>
									{user?.username == comment.user.username && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
									{user?.username != comment.user.username && <MenuItem>Report</MenuItem>}
								</Menu>
							</IconButton>
						</>
					}
				/>
				<CardContent style={{ textAlign: 'left' }}>
					<Typography variant="body1" sx={{ color: "text.primary" }}>
						{comment.content}
					</Typography>
				</CardContent>
				<CardActions style={{ textAlign: 'left' }}>
					<IconButton
						aria-label="like"
						sx={{ color: likeState.liked === true ? green[500] : undefined, "&:hover": { color: green[500] } }}
						onClick={(event) => handle_comment_like(event, true)}
					>
						< ThumbUpIcon />
					</ IconButton>
					<Typography>{likeState.likeCount}</Typography>
					<IconButton
						aria-label="dislike"
						sx={{ color: likeState.liked === false ? red[500] : undefined, "&:hover": { color: red[400] } }}
						onClick={(event) => handle_comment_like(event, false)}
					>
						< ThumbDownIcon />
					</ IconButton>
					<Typography>{likeState.dislikeCount}</Typography>
					<IconButton onClick={() => setShowReplyBox(!showReplyBox)} aria-label="reply">
						< ReplyIcon />
						<Typography sx={{ marginLeft: '10px' }}>Reply</Typography>
					</ IconButton>

				</CardActions>
				{
					showReplyBox &&
					<>
						<CardActions>
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
								placeholder="Enter a reply..."
								onChange={(event: ChangeEvent<HTMLInputElement>) => replyText.current = event.currentTarget.value}
							/>
						</CardActions>
						<CardActions sx={{ justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								onClick={() => {
									setShowReplyBox(false)
									replyText.current = ''
								}}
							>
								Cancel
							</Button>
							<Button variant="contained" onClick={handleCommentReply}>Reply</Button>
						</CardActions>
					</>
				}
				{
					comment.replyCount > 0 &&
					<CardActions>
						<Button onClick={handleShowReplies}>
							{showReplies ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
							{`${comment.replyCount} Replies`}
						</Button>
					</CardActions>
				}
			</Card >
			{
				showReplies &&
				commentReplies.map((value, index) =>
					<Box sx={{ paddingLeft: '50px' }} key={index}>
						<CommentCard
							comment={value}
							commentDeleteCallback={deleteCommentReplyCallback}
						/>
					</Box>
				)
			}
		</>
	)
}