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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import UploadIcon from "@mui/icons-material/Upload";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../utils/SnackbarContext";
import { SetProfileData, SetProfileRequest, UserManager, UserProfileResponse } from "../api/user";
import { useUser } from "../utils/AuthContext";
import { MessageManager } from "../api/message";
import { blue } from "@mui/material/colors";
import PostList from "../components/PostList";
import UserList from "../components/UserList";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";

export default function UserProfile() {
  const { username } = useParams();
  const { state } = useLocation();
  const [userProfile, setUserProfile] = useState<UserProfileResponse | null>(null);
  const userManager = UserManager.getInstance();

  useEffect(() => {
    setUserProfile(null);
    if (state !== null && state.profile) {
      setUserProfile(state.profile);
      return;
    }
    userManager.getUser(username!).then((profile) => {
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
  const snackbar = useSnackbar();
  const isSelf = user?.username === username;
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const userManager = UserManager.getInstance();
  const messageManager = MessageManager.getInstance();

  const followUser = async () => {
    setFollowLoading(true);
    const res = await userManager.followUser(username!);
    profile.userActions!.following = res.following;
    profile.followerCount += res.following ? 1 : -1;
    setFollowLoading(false);
    snackbar({open: true, message: res.following ? `Followed @${profile.username}!` : `Unfollowed @${profile.username}.`});
  };

  const messageUser = async () => {
    const res = await messageManager.createConversation([username!], false);
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
      <Box sx={{ height: "200px", width: "100%", objectFit: "cover", backgroundColor: profile.banner ? undefined : blue[500] }}>
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
          <Button sx={{ marginLeft: "16px" }} variant={profile.userActions?.following ? "outlined" : "contained"} onClick={!isSelf ? followUser : undefined} disabled={followLoading}>
            {!followLoading ? (!profile.userActions?.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>}
        </Box>
        <Box sx={{ height: "56px" }} />
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="h4">{profile.displayName ?? profile.username}</Typography>
          {profile.verified && <Tooltip title={"Verified"}><VerifiedIcon /></Tooltip>}
          {profile.pronouns && <Typography>({profile.pronouns})</Typography>}
        </Stack>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="subtitle1">
            @{profile.username}
          </Typography>
          {profile.userActions?.followingYou && <Chip label="Follows you" />}
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
  const userManager = UserManager.getInstance();
  const user = useUser();
  const isSelf = user?.username === profile.username;

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
          {isSelf && <Tab label="Dislikes" />}
        </Tabs>
      </Paper>
      <CustomTabPanel value={value} index={0}>
        <PostList requester={userManager.getUserPosts(profile.username)} postCallback={(post) => post.user.username === user?.username} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UserList requester={userManager.getFollowers(profile.username)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserList requester={userManager.getFollowing(profile.username)} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <PostList requester={userManager.getLikes(profile.username)} />
      </CustomTabPanel>
      {isSelf && <CustomTabPanel value={value} index={4}>
        <PostList requester={userManager.getDislikes(profile.username)} />
      </CustomTabPanel>}
    </>
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
  const [pfpImage, setPfpImage] = useState<FileList | null>(null);
  const [bannerImage, setBannerImage] = useState<FileList | null>(null);
  const userManager = UserManager.getInstance();

  const handleClickOpen = () => {
    setFormState({
      displayName: profile.displayName,
      pronouns: profile.pronouns,
      bio: profile.bio,
      profilePicture: profile.profilePicture,
      banner: profile.banner
    })
    
    setPfpImage(null);
    setBannerImage(null);
    setUpdating(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData: SetProfileData = {...formState};
      if (pfpImage) formData.profilePicture = pfpImage.item(0);
      if (bannerImage) formData.banner = bannerImage.item(0);
      const res = await userManager.updateUser(formData);
      setOpen(false);
      setUpdating(false);
      snackbar({ open: true, message: "Profile updated!" });
      if (onUpdate) onUpdate(res);
    } catch (err) {
      console.error(err);
      setUpdating(false);
    }
  }

  const handleText = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    console.log(event)
    setFormState((state) => {
      const old = Object.assign({}, state);
      (old as any)[event.target.name] = event.target.value || null;
      return old;
    })
  }

  const handlePfpFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files === null) return;
    setPfpImage(event.target.files);
  }

  const handleBannerFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    setBannerImage(event.target.files);
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
          <br />
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
          <Stack direction="row" spacing={2}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" sx={{ marginBottom: "4px" }}>
                Profile Picture
                <VisuallyHiddenInput
                  type="file"
                  onChange={handlePfpFile}
                  accept="image/png, image/jpeg, image/gif"
                />
              </Button>
              <img
                src={pfpImage ? URL.createObjectURL(pfpImage.item(0)!) : formState.profilePicture ?? "" }
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" sx={{ marginBottom: "4px" }}>
                Banner
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleBannerFile}
                  accept="image/png, image/jpeg"
                />
              </Button>
              <img
                src={bannerImage ? URL.createObjectURL(bannerImage.item(0)!) : formState.banner ?? "" }
                style={{ maxHeight: "100px", maxWidth: "300px", objectFit: "contain" }}
              />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={updating} onClick={handleUpdate}>{!updating ? "Submit" : <CircularProgress color="inherit" size="1.5rem" />}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}