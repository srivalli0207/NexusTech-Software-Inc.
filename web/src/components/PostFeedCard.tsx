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
import { CardActionArea, Tooltip } from "@mui/material";
import { useSnackbar } from "../utils/SnackbarContext";
import { bookmark_post, delete_post, get_user, like_post, PostResponse, UserProfileResponse } from "../utils/fetch";

export default function PostFeedCard({ post, onDelete }: { post: PostResponse, onDelete: (post: PostResponse) => void }) {
    const [liked, setPostLiked] = useState(post.actions?.liked);
    const [bookmarked, setPostBookmarked] = useState(post.actions?.bookmarked);
    const date = new Date(post.date);
    const user = useUser();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
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

    const handleTooltipOpen = async () => {
      if (profile !== null) return;

      const res = await get_user(post.user.username);
      setProfile(res);
    }

    const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      console.log("ok2");
    }

    return (
      <Card sx={{ textAlign: "left" }}>
        <CardActionArea onClick={() => console.log("ok")}>
          <CardHeader
            avatar={
              <Tooltip enterDelay={500} onOpen={handleTooltipOpen} slotProps={profile === null ? {} : {tooltip: { sx: { width: 200 } }}} title={
                profile ? <>
                  <Card>
                    <CardHeader
                      title={profile.displayName ?? profile.username}
                      subheader={`@${profile.username}`}
                      avatar={
                        <Avatar aria-label="pfp" src={profile.profilePicture ?? undefined}>
                          {profile.username[0].toUpperCase()}
                        </Avatar>
                      }
                      sx={{ backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backdropFilter: "blur(8px)" }}
                    />
                    <CardContent>
                      <Typography variant="body2">{profile.bio ?? "No information given."}</Typography>
                    </CardContent>
                  </Card>
                </> : "Loading..."
              }>
                {/* <IconButton onClick={() => console.log("ok2")}> */}
                  <Avatar aria-label="pfp" src={post.user.profilePicture ?? undefined} onClick={handleAvatarClick}>
                    {post.user.username[0].toUpperCase()}
                  </Avatar>
                {/* </IconButton> */}
              </Tooltip>
            }
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