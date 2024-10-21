import { Search } from "@mui/icons-material";
import { Autocomplete, Avatar, Box, CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search_users, UserResponse } from "../utils/fetch";

export default function AppBarSearch() {
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate();
	const [searchOptions, setSearchOptions] = useState<UserResponse[]>([])

	useEffect(() => {
		const timerCallback = async () => {
			const res = await search_users(searchString);

			if (res.length > 0) {
				setSearchOptions(res)
			}
			else {
				setSearchOptions([])
			}

			setIsLoading(false)
		}

		let timeout: number

		if (searchString.length > 0) {
			setIsLoading(true)
			timeout = setTimeout(timerCallback, 500)
		}
		else {
			setSearchOptions([]);
		}

		return () => {
			clearTimeout(timeout)
		}
	}, [searchString])

	return (
		<Autocomplete
			freeSolo={true}
			disableClearable={true}
			options={searchOptions}
			value={searchString}
			onInputChange={(_, value, __) => setSearchString(value)}
			onChange={(_, value) => {
				if (value) {
					navigate("/user-profile/" + (typeof value === "string" ? value : value.username));
					setSearchString("");
				}
			}}
			getOptionLabel={(option) => typeof option === "string" ? option : option.username}
			renderOption={(props, user) => {
				const { key, ...optionProps } = props;
				return (
					<Box
						key={key}
						component="li"
						{...optionProps}
					>
						<Avatar src={user.profilePicture ?? undefined} sx={{ width: "20px", height: 20, mr: 2, flexShrink: 0 }}>
							{user.username[0].toUpperCase()}
						</Avatar>
						{user.displayName ?? user.username} (@{user.username})
					</Box>
				);
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					size="small"
					label="Search"
					slotProps={{
						input: {
							...params.InputProps,
							type: "search",
							startAdornment: (
								<InputAdornment position="start">
									{isLoading ? <CircularProgress size={24} /> : <Search />}
								</InputAdornment>
							),
						},
					}}
				/>
			)}
		/>
	);
}
