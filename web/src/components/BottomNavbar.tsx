import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import MessageIcon from "@mui/icons-material/Message";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../utils/AuthContext";

export default function BottomNavbar() {
    const user = useUser();
    const location = useLocation();
    let value = 0;
    if (location.pathname.includes("/forums")) {
        value = 1;
    } else if (location.pathname.includes("/messages")) {
        value = 2;
    }

    return (
        <Box sx={{ marginTop: "auto", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <BottomNavigation
            showLabels
            value={value}
          >
            <BottomNavigationAction label="Home" icon={<HomeIcon />} component={Link} to="/" />
            <BottomNavigationAction label="Forums" icon={<ExploreIcon />} component={Link} to="/forums" />
            {user && <BottomNavigationAction label="Bookmarks" icon={<BookmarkIcon />} component={Link} to="/bookmarks" />}
            {user && <BottomNavigationAction label="Messages" icon={<MessageIcon />} component={Link} to="/messages" />}
          </BottomNavigation>
        </Box>
      );
}