import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import { CardActionArea, ImageList, ImageListItem, Tooltip } from "@mui/material";
import { useSnackbar } from "../utils/SnackbarContext";
import { Link } from "react-router-dom";
import { useUser } from "../utils/AuthContext";
import { UserManager, UserProfileResponse } from "../api/user";
import { Post, PostLike, PostManager } from "../api/post";

export default function PostCard({ post, onDelete }: { post: Post, onDelete: (post: Post) => void }) {
    const [likeState, setLikeState] = useState<PostLike>({ liked: post.actions?.liked!, likeCount: post.likeCount, dislikeCount: post.dislikeCount })
    const [bookmarked, setPostBookmarked] = useState(post.actions?.bookmarked);
    const date = new Date(post.date);
    const user = useUser();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const open = Boolean(anchorEl);
    const snackbar = useSnackbar();
    const postManager = PostManager.getInstance();
    const userManager = UserManager.getInstance();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (!open) setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }

    const handleDelete = async () => {
      handleClose();
      await postManager.deletePost(post.id);
      snackbar({ message: "Post deleted.", open: true });
      onDelete(post);
    }

    const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const res = await postManager.bookmarkPost(post.id);
      setPostBookmarked(res.bookmarked);
      snackbar({ message: `Post ${!res.bookmarked ? "un" : ""}bookmarked.`, open: true });
    }

    const handleLike = async (event: React.MouseEvent<HTMLButtonElement>, like: boolean) => {
      event.preventDefault();
      try {
        const res = await postManager.likePost(post.id, like);
        setLikeState(res);
      } catch (err) {
        snackbar({ open: true, message: err as any })
        console.error(err);
      }
    }

    const handleTooltipOpen = async () => {
      if (profile !== null) return;
      const res = await userManager.getUser(post.user.username);
      setProfile(res);
    }

    const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      console.log("ok2");
    }

    return (
      <Card sx={{ textAlign: "left" }}>
        <CardActionArea component={Link} to={`/post/${post.id}`}>
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
                      sx={{ backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backdropFilter: "blur(16px)" }}
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
              <>
                {date.toLocaleString()}
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
              </>
            }
            title={post.user.displayName ?? post.user.username}
            subheader={`@${post.user.username}`}
          />
        
          <CardContent>
            <Typography variant="body1" sx={{ color: "text.primary" }}>
              {post.text}
            </Typography>
            {post.media.length !== 0 && post.media[0].type === "video" 
              ? <video key={post.media[0].url} src={post.media[0].url} controls />
              : <ImageList cols={2} gap={8} sx={{ maxWidth: "50%" }}>
                {post.media.map((media) => (
                  <ImageListItem key={media.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <img 
                      src={media.url}
                      alt={media.url}
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px", maxHeight: "150px" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            }
          </CardContent>
          <CardActions>
            <IconButton aria-label="comment" sx={{ color: false ? purple[500] : undefined, "&:hover": { color: purple[500] } }} onClick={(event) => handleLike(event, true)}>
              <CommentIcon />
            </IconButton>
            <Typography>{0}</Typography>
            <IconButton aria-label="like" sx={{ color: likeState.liked === true ? green[500] : undefined, "&:hover": { color: green[500] } }} onClick={(event) => handleLike(event, true)}>
              <ThumbUpIcon />
            </IconButton>
            <Typography>{likeState.likeCount}</Typography>
            <IconButton aria-label="dislike" sx={{ color: likeState.liked === false ? red[500] : undefined, "&:hover": { color: red[400] } }} onClick={(event) => handleLike(event, false)}>
              <ThumbDownIcon />
            </IconButton>
            <Typography>{likeState.dislikeCount}</Typography>
            <IconButton aria-label="bookmark" sx={{ color: bookmarked === true ? blue[500] : undefined, "&:hover": { color: blue[400] } }} onClick={handleBookmark}>
              <BookmarkIcon />
            </IconButton>
            <IconButton aria-label="share" sx={{ "&:hover": { color: yellow[500] } }}>
              <ShareIcon />
            </IconButton>
            <div style={{ flex: "1 0 0" }} />
            {post.forum && <Typography sx={{ marginRight: "8px" }}>Posted to <Link to={`/forums/${post.forum}`}>/f/{post.forum}</Link></Typography>}
          </CardActions>
        </CardActionArea>
      </Card>
    );
}