import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import Typography from "@mui/material/Typography";

export interface Post {
  username: string,
  pfp: string,
  date: string,
  text: string,
  photos: string[]
}

export default function PostFeedCard({ post }: { post: Post }) {
    return (
      <Card sx={{ textAlign: "left" }}>
        <CardHeader
          avatar={<Avatar aria-label="pfp" src={post.pfp} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={post.username}
          subheader={post.date}
        />
        {post.photos.map((photo) => {
          return (
            <CardMedia
              component="img"
              sx={{width: "200px", height: "auto"}}
              image={photo}
            />
          );
      })}
      
        <CardContent>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {post.text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="bookmark">
            <BookmarkIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
}