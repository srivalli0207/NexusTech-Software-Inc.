import { FormEvent, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostFeedCard, { Post } from "../components/PostFeedCard";
import {
  follow_user,
  get_conversation,
  get_is_following,
  get_posts,
} from "../utils/fetch";
import { useUser } from "../utils/auth-hooks";
import { submit_post, delete_post } from "../utils/fetch";
import CSRF_Token from "../utils/csrf_token";
import { useNavigate, useParams } from "react-router-dom";

export default function UserProfile() {
   const { username } = useParams()
   const user = useUser();

  return <UserProfileInner key={ username ? username : user?.username }/>;
}

function UserProfileInner() {
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const user = useUser();
  const { username } = useParams();
  const navigate = useNavigate();

  const handleDelete = async (post: Post) => {
    await delete_post({ post_id: post.id });
    setPosts(posts.filter((p) => p.id != post.id));
  };

  useEffect(() => {
    get_posts(username)
      .then(async (res) => {
        setPosts(
          res.map((post: any) => {
            return {
              id: post.pk,
              username: post.user.username,
              pfp: post.user.pfp,
              date: new Date(post.creation_date),
              text: post.text,
              photos: [""],
              // photos: ["https://media.istockphoto.com/id/98201918/photo/small-koala-sitting-on-white-background.jpg?s=1024x1024&w=is&k=20&c=5QNao-I60NybQMxtI8YoP72K468M9GLofRcD3zQz3DA="]
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    if (
      user !== undefined &&
      username !== undefined &&
      user!.username !== username
    ) {
      get_is_following(username!).then(async (res) => {
        setFollowing(res.following);
        setFollowLoading(false);
      });
    } else {
      setFollowLoading(false);
    }
  }, []);

  const followUser = async () => {
    setFollowLoading(true);
    const res = await follow_user(username!, !following);
    setFollowing(res.following);
    setFollowLoading(false);
  };

  const messageUser = async () => {
    const res = await get_conversation(username!);
    navigate(`/messages/${res.id}`);
  };

  return (
    <Box>
      <Typography variant="h1">{username}</Typography>
      {user && (
        <Button
          variant="contained"
          disabled={followLoading}
          onClick={user!.username !== username ? followUser : undefined}
        >
          {username === undefined || user?.username === username ? (
            "Edit Profile"
          ) : followLoading ? (
            <CircularProgress color="inherit" size="1.5rem" />
          ) : following ? (
            "Unfollow"
          ) : (
            "Follow"
          )}
        </Button>
      )}
      {user && user!.username !== username && (
        <Button
          variant="contained"
          onClick={messageUser}
          sx={{ marginLeft: "4px" }}
        >
          Message
        </Button>
      )}
      {(username === undefined || username === user!.username) && (
        <UserProfilePost />
      )}
      {loading && <CircularProgress />}
      <Grid container spacing={2}>
        {posts.map((post, index) => {
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <PostFeedCard key={index} post={post} onDelete={handleDelete} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export function UserProfilePost() {
  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let formObject = Object.fromEntries(formData.entries()) as { text: string };
    await submit_post({ text: formObject.text });
  };

  return (
    <Box
      component="form"
      //sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }}}
      noValidate
      autoComplete="off"
      onSubmit={submitPost}
    >
      <CSRF_Token />
      <TextField
        sx={{ width: "100%" }}
        name="text"
        label="Text Post"
        multiline
        required
        maxRows={5}
      />
      <div style={{ display: "flex" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ margin: "1rem 0 1rem auto" }}
        >
          Make a Post
        </Button>
      </div>
    </Box>
  );
}
