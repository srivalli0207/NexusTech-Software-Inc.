import { Avatar, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ForumResponse, get_forum, get_forum_posts, PostResponse } from "../utils/fetch";
import { useUser } from "../utils/auth-hooks";
import PostFeedCard from "../components/PostFeedCard";


export default function ForumPage() {
  const { forum_name } = useParams();
  const [forum, setForum] = useState<ForumResponse | null>(null);

  useEffect(() => {
    setForum(null);
    get_forum(forum_name!).then((forum) => {
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
            {/* {forum.name} */}
            {/* <UserProfileHeader profile={userProfile!} />
            <UserProfileTabs profile={userProfile!} /> */}
            <ForumHeader forum={forum} />
            <ForumPosts forum={forum} />
          </Box>
      }
    </Box>
  )
}

function ForumHeader({ forum }: { forum: ForumResponse }) {
  const user = useUser();
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  // const followUser = async () => {
  //   setFollowLoading(true);
  //   const res = await follow_user(username!, !profile.following);
  //   profile.following = res.following;
  //   setFollowLoading(false);
  // };

  // const messageUser = async () => {
  //   const res = await get_conversation(username!);
  //   navigate(`/messages/${res.id}`);
  // };

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
          {/* {user?.username !== username && <IconButton onClick={messageUser}>
            <MessageIcon />
          </IconButton>} */}
          {/* {isSelf ? <UserProfileEditButton profile={profile} onUpdate={onProfileUpdate} /> : 
          <Button sx={{ marginLeft: "16px" }} variant="contained" onClick={!isSelf ? followUser : undefined} disabled={followLoading}>
            {!followLoading ? (!profile.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>} */}
          <Button sx={{ marginLeft: "16px" }} variant="contained" disabled={followLoading}>
            {!followLoading ? (true ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>
        </Box>
        <Box sx={{ height: "56px" }} />
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
          <Typography variant="h4">/f/{forum.name}</Typography>
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

function ForumPosts({ forum }: { forum: ForumResponse }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostResponse[]>([]);

  const handleDelete = async (post: PostResponse) => {
    setPosts(posts.filter((p) => p.id != post.id));
  };

  useEffect(() => {
    setLoading(true);
    get_forum_posts(forum.name)
      .then(async (res) => {
        setPosts(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [forum.name]);

  return (
    <Box sx={{ p: 3 }}>
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