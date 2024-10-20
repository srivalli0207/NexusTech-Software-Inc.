import { FormEvent, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Button,
  TextField,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostFeedCard, { Post } from "../components/PostFeedCard";
import {
  follow_user,
  get_conversation,
  get_is_following,
  get_posts,
  get_user,
} from "../utils/fetch";
import { useUser } from "../utils/auth-hooks";
import { submit_post, delete_post } from "../utils/fetch";
import CSRF_Token from "../utils/csrf_token";
import { useNavigate, useParams } from "react-router-dom";

interface UserProfileInfo {
  username: string,
  displayName: string | null,
  pfp: string | null,
  banner: string | null,
  pronouns: string | null,
  verified: boolean,
  bio: string | null,
  following: boolean | null
}

export default function UserProfile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);

  useEffect(() => {
    get_user(username!).then((profile) => {
      setUserProfile(profile);
    }).catch((err) => {
      console.error(err);
    })
  }, [])

  return (
    <Box>
      {userProfile === null
        ? <CircularProgress />
        : <Box sx={{ px: { xl: 16, lg: 12, md: 9, sm: 6, xs: 0 }}}>
            <UserProfileHeader profile={userProfile!} />
            <UserProfileTabs />
          </Box>
      }
    </Box>
  )
}

function UserProfileHeader({ profile }: { profile: UserProfileInfo }) {
  const user = useUser();
  const { username } = useParams();
  const [followLoading, setFollowLoading] = useState(false);
  const isSelf = user?.username === username;

  const followUser = async () => {
    setFollowLoading(true);
    const res = await follow_user(username!, !profile.following);
    profile.following = res.following;
    setFollowLoading(false);
  };

  return (
    <Box sx={{ textAlign: "left" }}>
      <Box sx={{ height: "200px", width: "100%", objectFit: "cover" }}>
        {profile.banner && <img height="200px" width="100%" style={{ objectFit: "cover" }} src={profile.banner!} />}
      </Box>
      <Box sx={{ position: "relative", mx: "16px" }}>
        <Avatar sx={{ position: "absolute", width: "96px", height: "96px", top: "-40px" }} src={profile.pfp ?? undefined}>
          {profile.username[0].toUpperCase()}
        </Avatar>
        <Button variant="contained" sx={{ position: "absolute", right: "16px", top: "16px" }} onClick={!isSelf ? followUser : undefined} disabled={followLoading}>
          {!followLoading ? (isSelf ? "Edit Profile" : !profile.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
        </Button>
        <Box sx={{ height: "56px" }}></Box>
        <Typography variant="h4">{profile.displayName ?? profile.username} {profile.pronouns && <Typography sx={{display: "inline"}}>({profile.pronouns})</Typography>}</Typography>
        <Typography variant="subtitle1">@{profile.username}</Typography>
        <Typography variant="body1" sx={{ my: "16px" }}>{profile.bio ?? "No information given."}</Typography>
      </Box>
    </Box>
  )
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function UserProfileTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: "20px", zIndex: 2 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="Posts" />
          <Tab label="comments" />
          <Tab label="Likes" />
        </Tabs>
      </Paper>
      <CustomTabPanel value={value} index={0}>
        <UserProfilePostsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </>
  )
}

function UserProfilePostsTab() {
  const user = useUser();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

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
  }, []);

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && posts.length === 0 && <Typography>No posts found.</Typography>}
      <Stack spacing={2}>
        {posts.map((post, index) => {
          return (
              <PostFeedCard key={index} post={post} onDelete={handleDelete} />
          );
        })}
      </Stack>
    </Box>
  );
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
