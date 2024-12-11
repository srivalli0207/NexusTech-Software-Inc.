import { Avatar, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Forum, ForumManager } from "../api/forum";
import PostList from "../components/PostList";
import { useSnackbar } from "../utils/SnackbarContext";


export default function ForumPage() {
  const { forum_name } = useParams();
  const [forum, setForum] = useState<Forum | null>(null);
  const forumManager = ForumManager.getInstance();

  useEffect(() => {
    setForum(null);
    forumManager.getForum(forum_name!).then((forum) => {
      setForum(forum);
    }).catch((err) => {
      console.error(err);
    })
  }, [])

  return (
    <Box>
      {forum === null
        ? <CircularProgress />
        : <Box>
            <ForumHeader forum={forum} />
            <Box p={2}>
              <PostList requester={forumManager.getForumPosts(forum.name)} />
            </Box>
          </Box>
      }
    </Box>
  )
}

function ForumHeader({ forum }: { forum: Forum }) {
  const [followLoading, setFollowLoading] = useState(false);
  // const [, forceUpdate] = useReducer(x => x + 1, 0);
  const forumManager = ForumManager.getInstance();
  const snackbar = useSnackbar();

  const followForum = async () => {
    setFollowLoading(true);
    const res = await forumManager.followForum(forum.name)
    forum.userActions!.following = res.following;
    setFollowLoading(false);
    snackbar({open: true, message: res.following ? `Followed /${forum.name}!` : `Unfollowed /${forum.name}.`})
  };

  // const onProfileUpdate = (formData: SetProfileRequest) => {
  //   profile.displayName = formData.displayName;
  //   profile.pronouns = formData.pronouns;
  //   profile.bio = formData.bio;
  //   profile.profilePicture = formData.profilePicture;
  //   profile.banner = formData.banner;
  //   forceUpdate();
  // }

  return (
    <Box sx={{ textAlign: "left" }}>
      <Box sx={{ height: "200px", width: "100%", objectFit: "cover" }}>
        {forum.banner && <img height="200px" width="100%" style={{ objectFit: "cover" }} src={forum.banner!} />}
      </Box>
      <Box sx={{ position: "relative", mx: "16px" }}>
        <Avatar sx={{ position: "absolute", width: "96px", height: "96px", top: "-40px" }} src={forum.icon ?? undefined}>
          {forum.name[0].toUpperCase()}
        </Avatar>
        <Box sx={{ position: "absolute", right: "16px", top: "16px" }}>
          {/* {isSelf ? <UserProfileEditButton profile={profile} onUpdate={onProfileUpdate} /> : 
          <Button sx={{ marginLeft: "16px" }} variant="contained" onClick={!isSelf ? followUser : undefined} disabled={followLoading}>
            {!followLoading ? (!profile.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>} */}
          <Button sx={{ marginLeft: "16px" }} variant={forum.userActions?.following ? "outlined" : "contained"} onClick={followForum} disabled={followLoading}>
            {!followLoading ? (!forum.userActions?.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>
        </Box>
        <Box sx={{ height: "56px" }} />
        <Stack direction="column" spacing={1}>
          <Typography variant="h4">/{forum.name}</Typography>
          <Typography variant="subtitle1">{forum.followerCount} followers</Typography>
          <Typography variant="body2">Created by <Link to={`/profile/${forum.creator.username}`} state={{ profile: forum.creator }}>@{forum.creator.username}</Link></Typography>
          {/* {profile.pronouns && <Typography>({profile.pronouns})</Typography>} */}
        </Stack>
        {/* <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="subtitle1">
            @{profile.username}
          </Typography>
          {profile.followingYou && <Chip label="Follows you" />}
        </Stack> */}
        <Typography variant="body1" sx={{ my: "16px" }}>
          {forum.description}
        </Typography>
      </Box>
    </Box>
  )
}