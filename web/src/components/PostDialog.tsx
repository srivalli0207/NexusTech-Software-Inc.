import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ImageIcon from "@mui/icons-material/Image";
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useState } from 'react';
import { IconButton } from '@mui/material';

export default function PostDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="contained" onClick={handleClickOpen}>Create Post</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent sx={{ width: "50vh" }}>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="text"
            name="text"
            label="Text"
            fullWidth
            multiline
            maxRows={3}
            rows={3}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => console.log("ok")}>
            <ImageIcon color="primary" />
          </IconButton>
          <div style={{ flex: "1 0 0" }} />
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained">Post</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}