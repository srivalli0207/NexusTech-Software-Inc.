import Box from '@mui/material/Box'
import TopAppBar from '../components/TopAppBar'
import Grid2 from '@mui/material/Grid2'
import { Typography } from '@mui/material'
import TeamMemberCard from '../components/TeamMemberCard'
import ProjectCard from '../components/ProjectCard'

const team = [
  "Srivalli Kakumani",
  "Jackie Fortner",
  "Andy Chen",
  "Matthew Finerty",
  "Michael Lee"
];

const logs: {
  date: string,
  start: string,
  end: string,
  goal: string,
  team: {
    name: string,
    yesterday: string,
    today: string
  }[]
}[] = [
  {
    date: "09-03-24",
    start: "3:30 PM",
    end: "5:00 PM",
    goal: "Set up the connection between the database and AWS by Friday and test it by creating a static website which will display the contents of a table filled with mock data from the database at the press of a button. Also, set up an AWS group access account.",
    team: [
      { name: "Jackie", yesterday: "", today: "Initial/tentative EC2 connection" },
      { name: "Srivalli", yesterday: "", today: "AWS setup" },
      { name: "Michael", yesterday: "", today: "Database connection" },
      { name: "Matthew", yesterday: "", today: "AWS setup, database connection" },
      { name: "Andy", yesterday: "", today: "Database connection" },
    ]
  },
  {
    date: "09-04-24",
    start: "8:30 PM",
    end: "9:00 PM",
    goal: "All necessary connections have been established, though we are still working on getting the completed test site working on AWS/EC2.",
    team: [
      { name: "Jackie", yesterday: "Setup Django", today: "Test EC2 server" },
      { name: "Srivalli", yesterday: "Setup Django", today: "Test EC2 server" },
      { name: "Michael", yesterday: "Setup Django", today: "Test EC2 server" },
      { name: "Matthew", yesterday: "Tested deployment on EC2", today: "Finished test site" },
      { name: "Andy", yesterday: "Setup Django", today: "Test EC2 server" },
    ]
  },
  {
    date: "09-05-24",
    start: "3:30 PM",
    end: "4:40 PM",
    goal: "The test site has successfully been implemented using AWS EC2 and connecting the database to provide data at the press of a button. The implementation for the company website is ongoing. Draft of the SRS is ongoing but mostly completed. ",
    team: [
      { name: "Jackie", yesterday: "Setup dev environment with EC2, React, and Djano", today: "Work on SRS" },
      { name: "Srivalli", yesterday: "Setup dev environment with EC2, React, and Djano", today: "Work on SRS" },
      { name: "Michael", yesterday: "Setup dev environment with EC2, React, and Djano", today: "Work on SRS" },
      { name: "Matthew", yesterday: "Setup dev environment with EC2, React, and Djano", today: "Work on SRS" },
      { name: "Andy", yesterday: "Setup dev environment with EC2, React, and Djano", today: "Work on SRS" },
    ]
  },
  {
    date: "09-06-24",
    start: "4:00 PM",
    end: "4:30 PM",
    goal: "To finish the SRS and visualize the social media site Nexify. Add additional information to the company website.",
    team: [
      { name: "Jackie", yesterday: "Added to and refined the SRS. Set up node.js. Tested the AWS connections. ", today: "Continue working on the SRS. " },
      { name: "Srivalli", yesterday: "Worked on the SRS. Tested the AWS connections.", today: "Work on non-functional requirements SRS" },
      { name: "Michael", yesterday: "Worked on the SRS, helped test the website.", today: "Continue to work on SRS" },
      { name: "Matthew", yesterday: "Created general layout for company website", today: "Add requirements in SRS, document project setup instructions in repository readme file" },
      { name: "Andy", yesterday: "Setting up react.js", today: "Wrap up SRS" },
    ]
  },
  {
    date: "09-09-24",
    start: "8:30 PM",
    end: "9:00 PM",
    goal: "Prioritize refining and completing the SRS and adding specifications to each section as needed.",
    team: [
      { name: "Jackie", yesterday: "Added specifications to SRS sections, mainly functional requirements.", today: "Continue refining the SRS. Work on designs/aesthetics/themes for the web page." },
      { name: "Srivalli", yesterday: "Worked on the SRS", today: "Continued working on the SRS." },
      { name: "Michael", yesterday: "Worked on the SRS", today: "Continue to add functional requirements to SRS" },
      { name: "Matthew", yesterday: "Worked on the SRS", today: "Continue working on SRS, come up with possible user interface design" },
      { name: "Andy", yesterday: "Worked on the SRS", today: "Reorganize web page directories" },
    ]
  },
  {
    date: "09-10-24",
    start: "3:00 PM",
    end: "4:20 PM",
    goal: "Prioritize refining and completing the SRS and adding specifications to each section as needed.",
    team: [
      { name: "Jackie", yesterday: "Refined SRS.", today: "Refined SRS; added specifications to non-functional requirements. Work on visualizing UI" },
      { name: "Srivalli", yesterday: "Worked on the SRS", today: "Added to the SRS" },
      { name: "Michael", yesterday: "Worked on the SRS", today: "Continue to add to SRS" },
      { name: "Matthew", yesterday: "Added setup instructions to readme", today: "Added non-functional requirements to SRS" },
      { name: "Andy", yesterday: "Worked on the SRS", today: "Continue adding to SRS" },
    ]
  },
  {
    date: "09-11-24",
    start: "8:30 PM",
    end: "9:00 PM",
    goal: "Prioritize refining and completing the SRS and adding specifications to each section as needed. Revise the non-functional requirements section.",
    team: [
      { name: "Jackie", yesterday: "Revisions to SRS", today: "Revisions and finishing SRS" },
      { name: "Srivalli", yesterday: "Worked on the SRS", today: "Added to the SRS" },
      { name: "Michael", yesterday: "Worked on the SRS", today: "Continue to add to SRS" },
      { name: "Matthew (Absent)", yesterday: "Worked on the SRS", today: "Adjusted SRS specifications" },
      { name: "Andy", yesterday: "Worked on the SRS", today: "Continue adding to SRS" },
    ]
  },
  {
    date: "09-12-24",
    start: "3:00 PM",
    end: "4:08 PM",
    goal: "Prioritize refining and completing the SRS and adding specifications to each section as needed. Revise the non-functional requirements section.",
    team: [
      { name: "Jackie", yesterday: "Worked on non-functional SRS. ", today: "Finish SRS. Begin looking at database structural diagrams." },
      { name: "Srivalli", yesterday: "Worked on the SRS", today: "Added to the SRS" },
      { name: "Michael", yesterday: "Worked on the SRS", today: "Finished up the SRS" },
      { name: "Matthew", yesterday: "Added and adjusted non-functional requirements in SRS", today: "Finished the SRS" },
      { name: "Andy", yesterday: "Worked on the SRS", today: "Finish SRS" },
    ]
  },
]

export default function CompanyPage() {
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
            <div style={{marginTop: "16px", marginBottom: "16px"}}>
              <Typography variant="h3" style={{marginBottom: "16px"}}>Logs</Typography>
              {logs.map((log) => {
                return (
                  <div>
                    <Typography variant="h4" style={{marginBottom: "16px"}}>{log.date} ({log.start} - {log.end})</Typography>
                    <p><strong>Goal</strong>: {log.goal}</p>
                    <table style={{border: "1px solid white", borderCollapse: "collapse"}}>
                      <tr>
                        <th>Name</th>
                        <th>Yesterday</th>
                        <th>Today</th>
                      </tr>
                      {log.team.map((t) => {
                        return (
                          <tr>
                            <td>{t.name}</td>
                            <td>{t.yesterday}</td>
                            <td>{t.today}</td>
                          </tr>
                        )
                      })}
                    </table>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

