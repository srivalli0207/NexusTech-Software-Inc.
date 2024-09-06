import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";

export default function ProjectCard({ name, description }: { name: string, description: string }) {
    return (
      <Card>
        <CardMedia sx={{ height: 200 }} image="https://www.w3schools.com/css/paris.jpg"/>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            // disabled={g.total === 0}
            href={`https://google.com`}
            size="small"
          >
            View
          </Button>
        </CardActions>
      </Card>
    );
  }