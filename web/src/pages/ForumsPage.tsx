import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useReducer, useState } from "react";
import { ForumResponse, get_forums } from "../utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/auth-hooks";

export default function ForumsPage() {
  const [forums, setForums] = useState<ForumResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    get_forums()
      .then((res) => {
        setForums(res);
        setLoading(false);
      })
      .catch((err) => {
        // Handle this
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={4}>
          {forums.map((forum) => (
            <Grid size={{ md: 6, xs: 12 }}>
              <ForumsCard forum={forum} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function ForumsCard({ forum }: { forum: ForumResponse }) {
  return (
    <Card>
      <CardMedia
        sx={{ height: 140 }}
        image={forum.banner || undefined}
        title="forum banner"
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ textAlign: "start" }}
        >
          {forum.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "start" }}
        >
          {forum.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" component={Link} to={`/forums/${forum.name}`}>View</Button>
        <Button variant="outlined">Follow</Button>
      </CardActions>
    </Card>
  );
}

