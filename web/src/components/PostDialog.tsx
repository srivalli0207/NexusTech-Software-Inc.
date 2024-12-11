import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import CreateIcon from '@mui/icons-material/Create';
import DialogTitle from '@mui/material/DialogTitle';
import React, { Fragment, useState } from 'react';
import { CircularProgress, DialogContentText, Fab, IconButton, ImageList, ImageListItem, styled, Typography } from '@mui/material';
import { useSnackbar } from '../utils/SnackbarContext';
import { useLocation } from 'react-router-dom';
import { CreatePost, PostManager } from '../api/post';

export default function PostDialog({ fab = false }: { fab?: boolean}) {
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [textInput, setTextInput] = useState("");
  const [imageFile, setImageFile] = useState<File[] | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const snackbar = useSnackbar();
  const location = useLocation();
  const maxChars = 300;
  const postManager = PostManager.getInstance();

  const handleClickOpen = () => {
    setOpen(true);
    setPosting(false);
    setImageFile(null);
    setVideoFile(null);
    setPostError("");
    setTextInput("");
  };

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
  };

  const handleText = (event: any) => {
    setTextInput(event.target.value);
  };

  const handlePost = async () => {
    setPosting(true);
    try {
      const data: CreatePost = {};
      if (textInput.length !== 0) data.text = textInput;
      const split = location.pathname.split("/");
      if (split.length === 3 && split[1] === "forums") {
        data.forum = split[2];
      }
      if (imageFile) data.images = imageFile;
      else if (videoFile) data.video = videoFile;
      const post = await postManager.createPost(data);

      setOpen(false);
      snackbar({ open: true, message: "Post sent!" });
      const event = new CustomEvent('nexus.post.created', { detail: post });
      document.dispatchEvent(event);
    } catch (err) {
      setPostError(err as any);
      setPosting(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.ctrlKey) {
      console.log(event);
      handlePost();
    }
  };

  const handleImageFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length > 4) return;
    setVideoFile(null);
    let files = []
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files.item(i)!)
    }
    setImageFile(files);
  }

  const handleVideoFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    setImageFile(null);
    setVideoFile(event.target.files.item(0));
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <Fragment>
      {!fab 
        ? <Button variant="contained" onClick={handleClickOpen}>Create Post</Button> 
        : <Fab sx={{ position: "absolute", bottom: "72px", right: "16px", display: { md: "none", xs: "inline" } }} color="primary" onClick={handleClickOpen}>
            <CreateIcon />
          </Fab>
      }
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          {postError && <DialogContentText>{postError}</DialogContentText>}
          {location.pathname.startsWith("/forums/") && <DialogContentText color="textSecondary">Posting to <strong>/{location.pathname.split("/").pop()}</strong></DialogContentText>}
          <TextField
            autoFocus
            margin="dense"
            id="text"
            name="text"
            label="Text"
            fullWidth
            multiline
            rows={3}
            variant="standard"
            disabled={posting}
            onChange={handleText}
            onKeyDown={handleKeyDown}
            error={textInput.length > maxChars}
            helperText={textInput.length > maxChars ? "Max text length is 300." : undefined}
          />
          {imageFile && (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1}}>
                Selected images: {Array.from(imageFile).slice(0, 4).map((file) => file.name).join(", ")}
              </Typography>
              <ImageList cols={2} gap={8}>
                {Array.from(imageFile).slice(0, 4).map((file) => (
                  <ImageListItem key={file.name} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <img 
                      src={URL.createObjectURL(file)}
                      alt={file.name} 
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px", maxHeight: "200px" }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          )}
          {videoFile && (
            <>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1}}>
                Selected video: {videoFile.name}
              </Typography>
              <video 
                src={URL.createObjectURL(videoFile)}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                controls
              />
            </>
          )}
          </DialogContent>
        <DialogActions>
          <IconButton component="label" disabled={posting}>
            <ImageIcon color={!posting ? "primary" : "disabled"} />
            <VisuallyHiddenInput
              type="file"
              onChange={handleImageFiles}
              multiple
              accept="image/png, image/jpeg, image/gif"
            />
          </IconButton>
          <IconButton component="label" disabled={posting}>
            <MovieIcon color={!posting ? "primary" : "disabled"} />
            <VisuallyHiddenInput
              type="file"
              onChange={handleVideoFile}
              accept="video/mp4, video/mpeg, video/webm"
            />
          </IconButton>
          <Typography sx={{ color: textInput.length > maxChars ? "red" : undefined }}>
            {textInput.length}/{maxChars}
          </Typography>
          <div style={{ flex: "1 0 0" }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={(posting || !textInput || textInput.length > maxChars) && !imageFile && !videoFile} onClick={handlePost}>{!posting ? "Post" : <CircularProgress color="inherit" size="1.5rem" />}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}