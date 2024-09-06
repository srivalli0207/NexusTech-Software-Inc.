import Box from '@mui/material/Box'
import TopAppBar from './components/TopAppBar'
import Grid2 from '@mui/material/Grid2'
import { Typography } from '@mui/material'
import TeamMemberCard from './components/TeamMemberCard'
import ProjectCard from './components/ProjectCard'

const team = [
  "Srivalli Kakumani",
  "Jackie Fortner",
  "Andy Chen",
  "Matthew Finerty",
  "Michael Lee"
];

export default function App() {
  return (
    <>
      <TopAppBar />
      <Box sx={{ p: 2 }}>
        <div style={{width: "100%", textAlign: "center"}}>
          <div style={{display: "inline-block"}}>
            <Typography variant="h2">
              NexusTech Software Inc.
            </Typography>
            <div>
              <Typography variant="h3">About</Typography>
              <p>
                At NexusTech Software Inc. we are aware that creating client-oriented software takes a mixture of technical excellence and clear communication and our firm hires only the very best to ensure you receive both. We know that every client is unique and we strive to deliver an individual, innovative, and affordable proposal every time and to follow it through with an outstanding delivery that is both on time and within budget.
              </p>
              <p>
                We also pride ourselves on our after-sales client care including our guarantees, staff training, and onsite and offsite support.
              </p>
            </div>
            <div>
            <Typography variant="h3" style={{marginBottom: "16px"}}>Team</Typography>
              <Grid2 container spacing={2}>
                {team.map((a) => (
                  <Grid2 size={{ xs: 6, md: 4 }}>
                    <TeamMemberCard name={a} />
                  </Grid2>
                ))}
              </Grid2>
            </div>
            <div style={{marginTop: "16px", marginBottom: "16px"}}>
              <Typography variant="h3" style={{marginBottom: "16px"}}>Projects</Typography>
              <Grid2 container spacing={2} style={{textAlign: "left"}}>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="Nexify" description="A social media site is a networking platform where users can interact with each other through posts, comments, likes, dislikes, and messaging features. Requested by telecommunications company." />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="PlanIt" description="A comprehensive event tracker and planner. Requested by a professional event planning company." />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="WebView" description="A software utility for managing virtual events and webinars including tools for streaming and audience interaction. Requested by a large corporation focused around team building and group work. " />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="SocialSpot" description="A social networking application that allows students to interact with each other and find common interests. Also facilitates event management and study groups. Requested by an educational institution." />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="ArtChannel" description="A social platform for artists where they can share the various crafts they enjoy and connect with others. Requested by a non-profit art program." />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                  <ProjectCard name="FitNow" description="An app that allows meal and planning and tracking for the best results. Adjusts based on the individual's current status and goals. Requested by a freelance health and wellness coach." />
                </Grid2>
              </Grid2>
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

