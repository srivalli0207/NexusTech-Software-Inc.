import { Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MessageIcon from "@mui/icons-material/Message";
import { useUser } from "../utils/AuthContext";

export default function SideBar() {
  const user = useUser();

  return (
    <Drawer
      variant="permanent"
      sx={{
        [`& .MuiDrawer-paper`]: {
          width: "16.66666667vw",
          boxSizing: "border-box",
        },
      }}
    >
      <Box>
        <Toolbar />
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={Link} to="/forums">
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Forums" />
            </ListItemButton>
          </ListItem>
          {user && <ListItem>
            <ListItemButton component={Link} to="/bookmarks">
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="Bookmarks" />
            </ListItemButton>
          </ListItem>}
          {user && <ListItem>
            <ListItemButton component={Link} to="/messages">
              <ListItemIcon>
                <MessageIcon />
              </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
          </ListItem>}
        </List>
      </Box>
    </Drawer>
  );
}
