import Card from "@mui/material/Card";
import { Tooltip } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { CardActions } from "@mui/material";
import Typography from "@mui/material/Typography";
import CommentIcon from "@mui/icons-material/Comment";
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Comment } from "../api/comment";
import { useState } from "react";
import { useUser } from "../utils/AuthContext";
import { PostLike } from "../api/post";
import { useSnackbar } from "../utils/SnackbarContext";
import { CommentManager } from "../api/comment";
import { green, red } from "@mui/material/colors";


type CommentCardProp = {
	comment: Comment
	commentDeleteCallback: (id: number) => void
}

export default function CommentCard({ comment, commentDeleteCallback }: CommentCardProp) {
	const user = useUser(); 
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);
	const [likeState, setLikeState] = useState<PostLike>({
		liked: comment.liked,	
		likeCount: Number(comment.likeCount),
		dislikeCount: Number(comment.dislikeCount),
	});
	const snackbar = useSnackbar();
	const commentManager = CommentManager.getInstance();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (!open) setAnchorEl(event.currentTarget);
	}

	const handle_comment_like = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
		event.stopPropagation();
		try {
			const res = await commentManager.likeComment(comment.id, like);
			setLikeState(res);
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

	return (

		<Card sx={{ padding: '10px', border: 'none', textAlign: 'left' }} variant="outlined">
			<CardHeader
				avatar={
					<Tooltip
						enterDelay={500}
						/* onOpen={handleTooltipOpen} */
						slotProps={comment.user === null ? {} : { tooltip: { sx: { width: 200 } } }}
						title={
							comment ?
								<>
									<Card>
										<CardHeader
											title={comment.user.username}
											subheader={`@${comment.user.username}`}
											avatar={
												<Avatar aria-label="pfp" src={comment.user.avatar ?? undefined}>
													{comment.user.username[0].toUpperCase()}
												</Avatar>
											}
											sx={{ backgroundImage: `url(${comment.user.banner})`, backgroundSize: "cover", backdropFilter: "blur(16px)" }}
										/>
										<CardContent>
											<Typography variant="body2">{comment.user.bio ?? "No information given."}</Typography>
										</CardContent>
									</Card>
								</> : "Loading..."
						}>
						<Avatar aria-label="pfp" src={comment.user.avatar ?? undefined}>
							{comment.user.username[0].toUpperCase()}
						</Avatar>
					</Tooltip>
				}
				title={`${comment.user.username}`}
				subheader={`${new Date(comment.creation_date).toLocaleString()}`}
				action={
					<>
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
				<IconButton aria-label="like" sx={{ color: likeState.liked === true ? green[500] : undefined, "&:hover": { color: green[500] } }} onClick={(event) => handle_comment_like(event, true)}>
					< ThumbUpIcon />
				</ IconButton>
				<Typography>{likeState.likeCount}</Typography>
				<IconButton aria-label="dislike" sx={{ color: likeState.liked === false ? red[500] : undefined, "&:hover": { color: red[400] } }} onClick={(event) => handle_comment_like(event, false)}>
					< ThumbDownIcon />
				</ IconButton>
				<Typography>{likeState.dislikeCount}</Typography>
				{/* <IconButton aria-label="reply">
					< CommentIcon />
				</ IconButton>
				<IconButton aria-label="share">
					< ShareIcon />
				</ IconButton> */}
			</CardActions>
		</Card>


	)
}