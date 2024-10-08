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

export interface Post {
  id: number,
  username: string,
  pfp: string,
  date: Date,
  text: string,
  photos: string[]
}

export default function PostFeedCard({ post, onDelete }: { post: Post, onDelete: (post: Post) => void }) {
    const user = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!open) setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleDelete = () => {
      onDelete(post);
      handleClose();
    }
    return (
      <Card sx={{ textAlign: "left" }}>
        <CardHeader
          avatar={<Avatar aria-label="pfp" src={post.pfp}>{post.username[0].toUpperCase()}</Avatar>}
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
                {user?.username == post.username && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
                <MenuItem>Report</MenuItem>
              </Menu>
            </IconButton>
          }
          title={post.username}
          subheader={post.date.toLocaleString()}
        />
        {post.photos.map((photo, index) => {
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
        <CardActions disableSpacing>
          <IconButton aria-label="like">
            <ThumbUpIcon />
          </IconButton>
          <IconButton aria-label="dislike">
            <ThumbDownIcon />
          </IconButton>
          <IconButton aria-label="bookmark">
            <BookmarkIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
}