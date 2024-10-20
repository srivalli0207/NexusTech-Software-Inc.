import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ImageIcon from "@mui/icons-material/Image";
import CreateIcon from '@mui/icons-material/Create';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useState } from 'react';
import { CircularProgress, DialogContentText, Fab, IconButton, Typography } from '@mui/material';
import { submit_post } from '../utils/fetch';

export default function PostDialog({ fab = false }: { fab: boolean}) {
  const [open, setOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [textInput, setTextInput] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
    setPosting(false);
    setPostError("");
    setTextInput("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleText = (event: any) => {
    setTextInput(event.target.value);
  };

  const handlePost = () => {
    setPosting(true);
    submit_post({ text: textInput }).then(() => {
      setOpen(false);
    }).catch((err) => {
      setPostError(err);
      setPosting(false);
    });
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.ctrlKey) {
      console.log(event);
      handlePost();
    }
  };

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
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent sx={{ width: "50vh" }}>
          {postError && <DialogContentText>{postError}</DialogContentText>}
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
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handlePost}>
            <ImageIcon color="primary" />
          </IconButton>
          <Typography sx={{ color: textInput.length > 300 ? "red" : undefined }}>{300 - textInput.length}</Typography>
          <div style={{ flex: "1 0 0" }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disabled={posting || !textInput || textInput.length > 300} onClick={handlePost}>{!posting ? "Post" : <CircularProgress color="inherit" size="1.5rem" />}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}