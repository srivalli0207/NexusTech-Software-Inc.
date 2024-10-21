import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Typography from "@mui/material/Typography";
import { useUser } from "../utils/auth-hooks";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { blue, green, red, yellow } from "@mui/material/colors";
import { CardActionArea } from "@mui/material";
import { useSnackbar } from "../utils/SnackbarContext";
import { bookmark_post, delete_post, like_post, PostResponse } from "../utils/fetch";

export default function PostFeedCard({ post, onDelete }: { post: PostResponse, onDelete: (post: PostResponse) => void }) {
    const [liked, setPostLiked] = useState(post.actions?.liked);
    const [bookmarked, setPostBookmarked] = useState(post.actions?.bookmarked);
    const date = new Date(post.date);
    const user = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const snackbar = useSnackbar();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (!open) setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }

    const handleDelete = async () => {
      handleClose();
      await delete_post({ post_id: post.id });
      snackbar({ message: "Post deleted.", open: true });
      onDelete(post);
    }

    const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      bookmark_post(post.id).then((res) => {
        setPostBookmarked(res.bookmarked);
        snackbar({ message: `Post ${!res.bookmarked ? "un" : ""}bookmarked.`, open: true });
      }).catch((err) => {
        console.error(err);
      })
    }

    const handleLike = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
      event.stopPropagation();
      like_post(post.id, like).then((res) => {
        setPostLiked(res.liked);
      }).catch((err) => {
        console.error(err);
      })
    }

    return (
      <Card sx={{ textAlign: "left" }}>
        <CardActionArea onClick={() => console.log("ok")}>
          <CardHeader
            avatar={<Avatar aria-label="pfp" src={post.user.profilePicture ?? undefined}>{post.user.username[0].toUpperCase()}</Avatar>}
            action={
              <IconButton
                aria-label="settings"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <MoreVertIcon />
                <Menu id={`post-menu-${post.id}`} anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {user?.username == post.user.username && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
                  <MenuItem>Report</MenuItem>
                </Menu>
              </IconButton>
            }
            title={post.user.username}
            subheader={date.toLocaleString()}
          />
          {post.media.map((photo, index) => {
            return (
              <CardMedia
                key={index}
                component="img"
                sx={{width: "200px", height: "auto"}}
                image={photo}
              />
            );
        })}
        
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {post.text}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton aria-label="like" sx={{ color: liked === true ? green[500] : undefined, "&:hover": { color: green[500] } }} onClick={(event) => handleLike(event, true)}>
              <ThumbUpIcon />
            </IconButton>
            <IconButton aria-label="dislike" sx={{ color: liked === false ? red[500] : undefined, "&:hover": { color: red[400] } }} onClick={(event) => handleLike(event, false)}>
              <ThumbDownIcon />
            </IconButton>
            <IconButton aria-label="bookmark" sx={{ color: bookmarked === true ? blue[500] : undefined, "&:hover": { color: blue[400] } }} onClick={handleBookmark}>
              <BookmarkIcon />
            </IconButton>
            <IconButton aria-label="share" sx={{ "&:hover": { color: yellow[500] } }}>
              <ShareIcon />
            </IconButton>
          </CardActions>
        </CardActionArea>
      </Card>
    );
}