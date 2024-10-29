import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Stack,
  Paper,
  IconButton,
  Chip,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import PostFeedCard from "../components/PostFeedCard";
import {
  follow_user,
  get_conversation,
  get_followers,
  get_following,
  get_likes,
  get_posts,
  get_user,
  PostResponse,
  SetProfileRequest,
  update_profile,
  UserProfileResponse,
  UserResponse,
} from "../utils/fetch";
import { useUser } from "../utils/auth-hooks";
import { useNavigate, useParams } from "react-router-dom";
import UserListItem from "../components/UserListItem";
import { useSnackbar } from "../utils/SnackbarContext";

export default function UserProfile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    setUserProfile(null);
    get_user(username!).then((profile) => {
      setUserProfile(profile);
    }).catch((err) => {
      console.error(err);
    })
  }, [username])

  return (
    <Box>
      {userProfile === null
        ? <CircularProgress />
        : <Box>
            <UserProfileHeader profile={userProfile!} />
            <UserProfileTabs profile={userProfile!} />
          </Box>
      }
    </Box>
  )
}

function UserProfileHeader({ profile }: { profile: UserProfileResponse }) {
  const user = useUser();
  const { username } = useParams();
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();
  const isSelf = user?.username === username;
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const followUser = async () => {
    setFollowLoading(true);
    const res = await follow_user(username!, !profile.following);
    profile.following = res.following;
    setFollowLoading(false);
  };

  const messageUser = async () => {
    const res = await get_conversation(username!);
    navigate(`/messages/${res.id}`);
  };

  const onProfileUpdate = (formData: SetProfileRequest) => {
    profile.displayName = formData.displayName;
    profile.pronouns = formData.pronouns;
    profile.bio = formData.bio;
    profile.profilePicture = formData.profilePicture;
    profile.banner = formData.banner;
    forceUpdate();
  }

  return (
    <Box sx={{ textAlign: "left" }}>
      <Box sx={{ height: "200px", width: "100%", objectFit: "cover" }}>
        {profile.banner && <img height="200px" width="100%" style={{ objectFit: "cover" }} src={profile.banner!} />}
      </Box>
      <Box sx={{ position: "relative", mx: "16px" }}>
        <Avatar sx={{ position: "absolute", width: "96px", height: "96px", top: "-40px" }} src={profile.profilePicture ?? undefined}>
          {profile.username[0].toUpperCase()}
        </Avatar>
        <Box sx={{ position: "absolute", right: "16px", top: "16px" }}>
          {user?.username !== username && <IconButton onClick={messageUser}>
            <MessageIcon />
          </IconButton>}
          {isSelf ? <UserProfileEditButton profile={profile} onUpdate={onProfileUpdate} /> : 
          <Button sx={{ marginLeft: "16px" }} variant="contained" onClick={!isSelf ? followUser : undefined} disabled={followLoading}>
            {!followLoading ? (!profile.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>}
        </Box>
        <Box sx={{ height: "56px" }} />
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="h4">{profile.displayName ?? profile.username}</Typography>
          {profile.pronouns && <Typography>({profile.pronouns})</Typography>}
        </Stack>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="subtitle1">
            @{profile.username}
          </Typography>
          {profile.followingYou && <Chip label="Follows you" />}
        </Stack>
        <Typography variant="body1" sx={{ my: "16px" }}>
          {profile.bio ?? "No information given."}
        </Typography>
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

function UserProfileTabs({ profile }: { profile: UserProfileResponse }) {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Paper sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: "0px", zIndex: 2 }}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab label="Posts" />
          <Tab label={`Followers (${profile.followerCount})`} />
          <Tab label={`Following (${profile.followingCount})`} />
          <Tab label="Likes" />
        </Tabs>
      </Paper>
      <CustomTabPanel value={value} index={0}>
        <UserProfilePostsTab />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UserProfileFollowTab following={false} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserProfileFollowTab following={true} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <UserProfilePostsTab likes/>
      </CustomTabPanel>
    </>
  )
}

function UserProfilePostsTab({ likes = false }: { likes?: boolean }) {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostResponse[]>([]);

  const handleDelete = async (post: PostResponse) => {
    setPosts(posts.filter((p) => p.id != post.id));
  };

  useEffect(() => {
    setLoading(true);
    const promise = !likes ? get_posts : get_likes;
    promise(username!)
      .then(async (res) => {
        setPosts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [username]);

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

function UserProfileFollowTab({ following }: { following: boolean }) {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [follows, setFollows] = useState<UserResponse[]>([]);

  useEffect(() => {
    setLoading(true);
    const promise = !following ? get_followers : get_following
    promise(username!)
      .then(async (res) => {
        setFollows(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [username]);

  return (
    <Box>
      {loading && <CircularProgress />}
      {!loading && follows.length === 0 && <Typography>No followers found.</Typography>}
      <List>
        {follows.map((user) => <UserListItem user={user} key={`user-list-item-${user.username}`} />)}
      </List>
    </Box>
  )
}

function UserProfileEditButton({ profile, onUpdate = undefined }: { profile: UserProfileResponse, onUpdate?: (profile: SetProfileRequest) => void }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formState, setFormState] = useState<SetProfileRequest>({
    displayName: null,
    pronouns: null,
    bio: null,
    profilePicture: null,
    banner: null
  })
  const snackbar = useSnackbar();

  const handleClickOpen = () => {
    setFormState({
      displayName: profile.displayName,
      pronouns: profile.pronouns,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      banner: profile.banner
    })
    
    setUpdating(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    update_profile(formState).then(() => {
      setOpen(false);
      setUpdating(false);
      snackbar({ open: true, message: "Profile updated!" });
      if (onUpdate) onUpdate(formState);
    }).catch((err) => {
      console.error(err);
      setUpdating(false);
    })
  }

  const handleText = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(event)
    setFormState((state) => {
      const old = Object.assign({}, state);
      (old as any)[event.target.name] = event.target.value || null;
      return old;
    })
  }

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>Edit Profile</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="displayName"
            name="displayName"
            label="Display Name"
            variant="standard"
            disabled={updating}
            value={formState.displayName}
            onChange={handleText}
          />
          <br />
          <TextField
            autoFocus
            margin="dense"
            id="pronounns"
            name="pronouns"
            label="Pronouns"
            variant="standard"
            disabled={updating}
            value={formState.pronouns}
            onChange={handleText}
          />
          <TextField
            autoFocus
            margin="dense"
            id="bio"
            name="bio"
            label="Bio"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            disabled={updating}
            value={formState.bio}
            onChange={handleText}
          />
          <TextField
            autoFocus
            margin="dense"
            id="profilePicture"
            name="profilePicture"
            label="Profile Picture URL"
            fullWidth
            variant="standard"
            disabled={updating}
            value={formState.profilePicture}
            onChange={handleText}
          />
          <TextField
            autoFocus
            margin="dense"
            id="banner"
            name="banner"
            label="Banner URL"
            fullWidth
            variant="standard"
            disabled={updating}
            value={formState.banner}
            onChange={handleText}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={updating} onClick={handleUpdate}>{!updating ? "Submit" : <CircularProgress color="inherit" size="1.5rem" />}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}