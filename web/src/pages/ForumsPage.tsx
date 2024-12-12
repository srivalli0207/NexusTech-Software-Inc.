import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import UploadIcon from "@mui/icons-material/Upload";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateForumRequest, Forum, ForumManager } from "../api/forum";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput";
import { useSnackbar } from "../utils/SnackbarContext";
import { useUser } from "../utils/AuthContext";

export default function ForumsPage() {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUser();
  const [filter, setFilter] = useState(user ? "following" : "all");
  const forumManager = ForumManager.getInstance();

  useEffect(() => {
    setLoading(true);
    forumManager.getForums(filter)
      .then((res) => {
        setForums(res);
        setLoading(false);
      })
      .catch((err) => {
        // Handle this
        console.error(err);
        setLoading(false);
      });
  }, [filter]);

  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  return (
    <Box sx={{ p: 2 }}>
      <div style={{ textAlign: "start", marginBottom: "8px" }}>
        <Typography variant="h2">Forums</Typography>
        <Stack direction="row" component="div" spacing={1}>
          <CreateForumButton />
          <FormControl>
            <InputLabel id="filter-forum-select-label">Filter</InputLabel>
            <Select
              labelId="filter-forum-select-label"
              value={filter}
              label="Filter"
              onChange={handleChange}
            >
              <MenuItem value={"all"}>All</MenuItem>
              {user && <MenuItem value={"following"}>Following</MenuItem>}
              <MenuItem value={"top"}>Top</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </div>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2} key={filter}>
          {forums.map((forum) => (
            <Grid size={{ xl: 4, md: 6, xs: 12 }} key={forum.name}>
              <ForumsCard forum={forum} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function ForumsCard({ forum }: { forum: Forum }) {
  const [followLoading, setFollowLoading] = useState(false);
  const forumManager = ForumManager.getInstance();
  const snackbar = useSnackbar();

  const followForum = async () => {
    setFollowLoading(true);
    const res = await forumManager.followForum(forum.name)
    forum.userActions!.following = res.following;
    forum.followerCount += res.following ? 1 : -1;
    setFollowLoading(false);
    snackbar({open: true, message: res.following ? `Followed /${forum.name}!` : `Unfollowed /${forum.name}.`});
  };

  return (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image={forum.banner || undefined}
        title="forum banner"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "start" }}>
          {forum.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "start" }}>
          {forum.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" component={Link} to={`/forums/${forum.name}`}>View</Button>
        <Button variant={forum.userActions?.following ? "outlined" : "contained"} onClick={followForum} disabled={followLoading}>
            {!followLoading ? (!forum.userActions?.following ? "Follow" : "Unfollow") : <CircularProgress size="24px" />}
        </Button>
        <div style={{ flex: "1 0 0" }} />
        <Typography variant="body1" sx={{ textAlign: "start", marginRight: "4px" }} color="textSecondary">
          {forum.followerCount} followers
        </Typography>
      </CardActions>
    </Card>
  );
}

function CreateForumButton() {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [creatingError, setCreatingError] = useState<Error | null>(null);
  const [formState, setFormState] = useState<CreateForumRequest>({ name: "", description: "", icon: null, banner: null })
  const [inputError, setInputError] = useState<{ name: string | null, description: null }>({ name: null, description: null });
  const forumManager = ForumManager.getInstance();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setCreating(false);
    setCreatingError(null);
    setFormState({ name: "", description: "", icon: null, banner: null });
    setInputError({ name: null, description: null });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const name = event.target.name;
    setFormState((state) => { const old = Object.assign({}, state); (old as any)[name] = event.target.files!.item(0); return old; });
  }

  const createForum = async () => {
    setCreating(true);
    try {
      const forum = await forumManager.createForum(formState);
      setCreating(false);
      setOpen(false);
      navigate(`/forums/${forum.name}`);
    } catch (e) {
      console.error(e);
      setCreatingError(e as any);
      setCreating(false);
    }
  }

  const handleText = (event: any) => {
    const name = event.target.name;
    const text = event.target.value;
    setFormState((state) => { const old = Object.assign({}, state); (old as any)[name] = text; return old; });

    setInputError((state) => {
      const old = Object.assign({}, state);
      let error = null;
      switch (name) {
        case "name":
          if (text.length > 0 && !/^[A-Za-z0-9_]{1,32}$/.test(text)) {
            error = "Name must be less than 32 characters and only include letters, numbers, and underscores.";
          }
          break;
      }
      (old as any)[name] = error;
      return old;
    })
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>Create Forum</Button>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Create Forum</DialogTitle>
        <DialogContent>
          {creatingError && <DialogContentText color="error">{creatingError.message}</DialogContentText>}
          <TextField
            margin="dense"
            id="text"
            name="name"
            label="Name"
            variant="standard"
            disabled={creating}
            onChange={handleText}
            helperText={inputError.name ?? undefined}
            error={inputError.name !== null}
          />
          <TextField
            margin="dense"
            id="desc"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            disabled={creating}
            onChange={handleText}
          />
          <Stack direction="row" spacing={2}>
            <Stack direction="column" width="200px" height="200px" spacing={2} sx={{ textAlign: "center" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" disabled={creating}>
                Icon
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFile}
                  accept="image/png, image/jpeg, image/gif"
                  name="icon"
                />
              </Button>
              {formState.icon ? <img
                src={URL.createObjectURL(formState.icon)}
                style={{ objectFit: "contain", maxHeight: "150px" }}
              /> : <Typography sx={{ margin: "auto", height: "200px" }}>No icon selected.</Typography>}
            </Stack>

            <Stack direction="column" width={200} height={200} spacing={2} sx={{ textAlign: "center" }}>
              <Button variant="contained" startIcon={<UploadIcon />} component="label" disabled={creating}>
                Banner
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFile}
                  accept="image/png, image/jpeg"
                  name="banner"
                />
              </Button>
              {formState.banner ? <img
                src={URL.createObjectURL(formState.banner)}
                style={{ objectFit: "contain", maxHeight: "150px" }}
              /> : <Typography sx={{ margin: "auto" }}>No banner selected.</Typography>}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={creating}>Cancel</Button>
          <Button variant="contained" onClick={createForum} disabled={creating || formState.name.length === 0 || formState.description.length === 0 || inputError.name !== null || inputError.description !== null}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
