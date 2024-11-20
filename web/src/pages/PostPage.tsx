import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  bookmark_post,
  delete_post,
  get_post,
  get_user,
  like_post,
  LikeResponse,
  PostResponse,
  UserProfileResponse,
} from "../utils/fetch";
import {
  Card,
  CardHeader,
  Tooltip,
  Avatar,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ImageList,
  ImageListItem,
  CardActions,
} from "@mui/material";
import { purple, green, red, blue, yellow } from "@mui/material/colors";
import { useUser } from "../utils/auth-hooks";
import { useSnackbar } from "../utils/SnackbarContext";
import CommentIcon from "@mui/icons-material/Comment";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentDialog from "../components/CommentDialog";

export default function PostPage() {
  let { post_id } = useParams();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeState, setLikeState] = useState<LikeResponse>({
   liked: false,
   likeCount: 0,
   dislikeCount: 0,
 });
 const [bookmarked, setPostBookmarked] = useState(false);
 const [date, setDate] = useState<Date>();
 const user = useUser();
 const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const [profile, setProfile] = useState<UserProfileResponse | null>(null);
 const [showCommentDialog, setShowCommentDialog] = useState(false)
 const open = Boolean(anchorEl);
 const snackbar = useSnackbar();

  useEffect(() => {
    get_post(post_id as string)
      .then((res) => {
        setPost(res);
        setLoading(false);

         setDate(new Date(res.date))
         setPostBookmarked(res.actions?.bookmarked!)
         setLikeState(
            {
               liked: res.actions?.liked!,
               likeCount: res.likeCount,
               dislikeCount: res.dislikeCount,
            }
         )
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleComment = (event: React.MouseEvent<HTMLButtonElement>) => {
      setShowCommentDialog(!showCommentDialog);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!open) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleClose();
    await delete_post({ post_id: post.id });
    snackbar({ message: "Post deleted.", open: true });
  };

  const handleBookmark = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    bookmark_post(post.id)
      .then((res) => {
        setPostBookmarked(res.bookmarked);
        snackbar({
          message: `Post ${!res.bookmarked ? "un" : ""}bookmarked.`,
          open: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLike = async (
    event: React.MouseEvent<HTMLButtonElement>,
    like: boolean
  ) => {
    event.stopPropagation();
    try {
      const res = await like_post(post.id, like);
      setLikeState(res);
    } catch (err) {
      snackbar({ open: true, message: err as any });
      console.error(err);
    }
  };

  const handleTooltipOpen = async () => {
    if (profile !== null) return;

    const res = await get_user(post.user.username);
    setProfile(res);
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log("ok2");
  };

  return (
      <>
         {
            !loading &&
            <>
               <Card sx={{ textAlign: "left" }}>
               <CardHeader
                  avatar={
                     <Tooltip
                     enterDelay={500}
                     onOpen={handleTooltipOpen}
                     slotProps={
                        profile === null ? {} : { tooltip: { sx: { width: 200 } } }
                     }
                     title={
                        profile ? (
                           <>
                              <Card>
                                 <CardHeader
                                    title={profile.displayName ?? profile.username}
                                    subheader={`@${profile.username}`}
                                    avatar={
                                    <Avatar
                                       aria-label="pfp"
                                       src={profile.profilePicture ?? undefined}
                                    >
                                       {profile.username[0].toUpperCase()}
                                    </Avatar>
                                    }
                                    sx={{
                                    backgroundImage: `url(${profile.banner})`,
                                    backgroundSize: "cover",
                                    backdropFilter: "blur(8px)",
                                    }}
                                 />
                                 <CardContent>
                                    <Typography variant="body2">
                                    {profile.bio ?? "No information given."}
                                    </Typography>
                                 </CardContent>
                              </Card>
                              </>
                           ) : (
                              "Loading..."
                           )
                        }
                        >
                        {/* <IconButton onClick={() => console.log("ok2")}> */}
                        <Avatar
                           aria-label="pfp"
                           src={post.user.profilePicture ?? undefined}
                           onClick={handleAvatarClick}
                        >
                           {post.user.username[0].toUpperCase()}
                        </Avatar>
                        {/* </IconButton> */}
                        </Tooltip>
                     }
                     action={
                        <IconButton
                        aria-label="settings"
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        >
                        <MoreVertIcon />
                        <Menu
                           id={`post-menu-${post.id}`}
                           anchorEl={anchorEl}
                           open={open}
                           onClose={handleClose}
                        >
                           {user?.username == post.user.username && (
                              <MenuItem onClick={handleDelete}>Delete</MenuItem>
                           )}
                           <MenuItem>Report</MenuItem>
                        </Menu>
                        </IconButton>
                     }
                     title={post.user.username}
                     subheader={date.toLocaleString()}
                  />

                  <CardContent>
                     <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {post.text}
                     </Typography>
                     {post.media.length !== 0 && post.media[0].type === "video" ? (
                        <video key={post.media[0].url} src={post.media[0].url} controls />
                     ) : (
                        <ImageList cols={2} gap={8} sx={{ maxWidth: "50%" }}>
                        {post.media.map((media) => (
                           <ImageListItem
                              key={media.id}
                              sx={{ borderRadius: 2, overflow: "hidden" }}
                           >
                              <img
                              src={media.url}
                              alt={media.url}
                              style={{
                                 width: "100%",
                                 height: "100%",
                                 objectFit: "contain",
                                 borderRadius: "8px",
                                 maxHeight: "150px",
                              }}
                              />
                           </ImageListItem>
                        ))}
                        </ImageList>
                     )}
                  </CardContent>
                  <CardActions>
                     <IconButton
                        aria-label="comment"
                        sx={{
                        color: false ? purple[500] : undefined,
                        "&:hover": { color: purple[500] },
                        }}
                        onClick={(event) => handleComment(event)}
                     >
                        <CommentIcon />
                     </IconButton>
                     <Typography>{0}</Typography>
                     <IconButton
                        aria-label="like"
                        sx={{
                        color: likeState.liked === true ? green[500] : undefined,
                        "&:hover": { color: green[500] },
                        }}
                        onClick={(event) => handleLike(event, true)}
                     >
                        <ThumbUpIcon />
                     </IconButton>
                     <Typography>{likeState.likeCount}</Typography>
                     <IconButton
                        aria-label="dislike"
                        sx={{
                        color: likeState.liked === false ? red[500] : undefined,
                        "&:hover": { color: red[400] },
                        }}
                        onClick={(event) => handleLike(event, false)}
                     >
                        <ThumbDownIcon />
                     </IconButton>
                     <Typography>{likeState.dislikeCount}</Typography>
                     <IconButton
                        aria-label="bookmark"
                        sx={{
                        color: bookmarked === true ? blue[500] : undefined,
                        "&:hover": { color: blue[400] },
                        }}
                        onClick={handleBookmark}
                     >
                        <BookmarkIcon />
                     </IconButton>
                     <IconButton
                        aria-label="share"
                        sx={{ "&:hover": { color: yellow[500] } }}
                     >
                        <ShareIcon />
                     </IconButton>
                  </CardActions>
               </Card>
               
               {
                 
                  <CommentDialog/>
               }
            </>
         }
      </>
  );
}
