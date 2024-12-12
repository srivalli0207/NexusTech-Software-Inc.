import { UserProfileResponse } from "../api/user";
import { Avatar, Card, CardContent, CardHeader, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ProfileTooltip({ profile, sx = [] }: { profile: UserProfileResponse, sx?: SxProps<Theme> }) {
    return (
        <Tooltip enterDelay={500} slotProps={{tooltip: { sx: { width: 300 } }}} title={
            <Card>
                <CardHeader
                    title={profile.displayName ?? profile.username}
                    subheader={`@${profile.username}`}
                    avatar={
                    <Avatar aria-label="pfp" src={profile.profilePicture ?? undefined}>
                        {profile.username[0].toUpperCase()}
                    </Avatar>
                    }
                    // sx={{ backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backdropFilter: "blur(16px)" }}
                />
                <CardContent>
                    <Typography variant="body2">{profile.bio ?? "No information given."}</Typography>
                </CardContent>
            </Card>
        }>
            <Link to={`/profile/${profile.username}`} onClick={(e) => e.stopPropagation()}>
                <Avatar aria-label="pfp" src={profile.profilePicture ?? undefined} sx={sx}>
                    {profile.username[0].toUpperCase()}
                </Avatar>
            </Link>
        </Tooltip>
    )
}