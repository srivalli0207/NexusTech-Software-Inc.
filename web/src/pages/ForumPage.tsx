import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditForumData, Forum, ForumManager } from "../api/forum";
import PostList from "../components/PostList";
import UploadIcon from "@mui/icons-material/Upload";
import { useSnackbar } from "../utils/SnackbarContext";
import { useUser } from "../utils/AuthContext";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";


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
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const forumManager = ForumManager.getInstance();
  const snackbar = useSnackbar();
  const user = useUser();

  const followForum = async () => {
    setFollowLoading(true);
    const res = await forumManager.followForum(forum.name)
    forum.userActions!.following = res.following;
    setFollowLoading(false);
    snackbar({open: true, message: res.following ? `Followed /${forum.name}!` : `Unfollowed /${forum.name}.`})
  };

  const onForumUpdate = (formData: EditForumData) => {
    forum.description = formData.description;
    forum.icon = formData.icon as any;
    forum.banner = formData.banner as any;
    forceUpdate();
  }

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
          {user?.username === forum.creator.username
          ? <EditForumButton forum={forum} onUpdate={onForumUpdate} />
          : <Button sx={{ marginLeft: "16px" }} variant={forum.userActions?.following ? "outlined" : "contained"} onClick={followForum} disabled={followLoading}>
            {!followLoading ? (!forum.userActions?.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
          </Button>}
        </Box>
        <Box sx={{ height: "56px" }} />
        <Stack direction="column" spacing={1}>
          <Typography variant="h4">/{forum.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">{forum.followerCount} followers</Typography>
          <Typography variant="body2">Created by <Link to={`/profile/${forum.creator.username}`} state={{ profile: forum.creator }}>@{forum.creator.username}</Link></Typography>
        </Stack>
        <Typography variant="body1" sx={{ my: "16px" }}>
          {forum.description}
        </Typography>
      </Box>
    </Box>
  )
}

function EditForumButton({ forum, onUpdate = undefined }: { forum: Forum, onUpdate?: (forum: EditForumData) => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingError, setEditingError] = useState<Error | null>(null);
  const [formState, setFormState] = useState<EditForumData>({
    description: forum.description,
    icon: forum.icon,
    banner: forum.banner
  });
  const forumManager = ForumManager.getInstance();
  const snackbar = useSnackbar();

  const handleClickOpen = () => {
    setFormState({
      description: forum.description,
      icon: forum.icon,
      banner: forum.banner
    })
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleText = (event: any) => {
    const name = event.target.name;
    const text = event.target.value;
    setFormState((state) => { const old = Object.assign({}, state); (old as any)[name] = text; return old; });
  }

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const name = event.target.name;
    setFormState((state) => { const old = Object.assign({}, state); (old as any)[name] = event.target.files!.item(0); return old; });
  }

  const editForum = async () => {
    setEditing(true);
    try {
      const edit = await forumManager.editForum(forum.name, formState);
      setEditing(false);
      setOpen(false);
      snackbar({ open: true, message: "Forum updated!" });
      if (onUpdate) onUpdate(edit);
    } catch (e) {
      console.error(e);
      setEditingError(e as any);
      setEditing(false);
    }
  }

  return (
    <>
      <Button sx={{ marginLeft: "16px" }} variant="contained" onClick={handleClickOpen}>Edit Forum</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Create Forum</DialogTitle>
        <DialogContent>
          {editingError && <DialogContentText color="error">{editingError.message}</DialogContentText>}
          <TextField
            margin="dense"
            id="desc"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            disabled={editing}
            onChange={handleText}
            value={formState.description}
          />
          <Stack direction="row" spacing={2}>
            <Stack direction="column" width="200px" height="200px" spacing={2} sx={{ textAlign: "center" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" disabled={editing}>
                Icon
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFile}
                  accept="image/png, image/jpeg, image/gif"
                  name="icon"
                />
              </Button>
              {formState.icon ? <img
                src={typeof formState.icon === "string" ? forum.icon! : URL.createObjectURL(formState.icon)}
                style={{ objectFit: "contain", maxHeight: "150px" }}
              /> : <Typography sx={{ margin: "auto", height: "200px" }}>No icon selected.</Typography>}
            </Stack>

            <Stack direction="column" width={200} height={200} spacing={2} sx={{ textAlign: "center" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" disabled={editing}>
                Banner
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFile}
                  accept="image/png, image/jpeg"
                  name="banner"
                />
              </Button>
              {formState.banner ? <img
                src={typeof formState.banner === "string" ? forum.banner! : URL.createObjectURL(formState.banner)}
                style={{ objectFit: "contain", maxHeight: "150px" }}
              /> : <Typography sx={{ margin: "auto" }}>No banner selected.</Typography>}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={editing}>Cancel</Button>
          <Button variant="contained" onClick={editForum} disabled={editing || formState.description.length === 0}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}