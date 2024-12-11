import { useNavigate } from "react-router-dom";
import { UserProfileResponse } from "../api/user";
import { Avatar, Card, CardContent, CardHeader, Tooltip, Typography } from "@mui/material";

export default function ProfileTooltip({ profile }: { profile: UserProfileResponse }) {
    const navigate = useNavigate();

    const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        navigate(`/profile/${profile.username}`, { state: { profile: profile } });
    }

    return (
        <Tooltip enterDelay={500} slotProps={{tooltip: { sx: { width: 200 } }}} title={
            <Card>
                <CardHeader
                    title={profile.displayName ?? profile.username}
                    subheader={`@${profile.username}`}
                    avatar={
                    <Avatar aria-label="pfp" src={profile.profilePicture ?? undefined}>
                        {profile.username[0].toUpperCase()}
                    </Avatar>
                    }
                    sx={{ backgroundImage: `url(${profile.banner})`, backgroundSize: "cover", backdropFilter: "blur(16px)" }}
                />
                <CardContent>
                    <Typography variant="body2">{profile.bio ?? "No information given."}</Typography>
                </CardContent>
            </Card>
        }>
            {/* <IconButton onClick={() => console.log("ok2")}> */}
                <Avatar aria-label="pfp" src={profile.profilePicture ?? undefined} onClick={handleAvatarClick}>
                    {profile.username[0].toUpperCase()}
                </Avatar>
            {/* </IconButton> */}
        </Tooltip>
    )
}