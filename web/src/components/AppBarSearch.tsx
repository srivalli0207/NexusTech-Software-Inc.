import { Search } from "@mui/icons-material";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search_users } from "../utils/fetch";

export default function AppBarSearch() {
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate();
	const [searchOptions, setSearchOptions] = useState<string[]>([])

	useEffect(() => {
		const timerCallback = async () => {
			const res = await search_users(searchString);

			if (res.length > 0) {
				setSearchOptions(res)
			}
			else {
				setSearchOptions(['No results'])
			}

			setIsLoading(false)
		}

		let timeout: number

		if (searchString.length > 0) {
			setIsLoading(true)
			timeout = setTimeout(timerCallback, 1000)
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
			filterOptions={(x) => x}
			freeSolo={true}
			disableClearable={true}
			options={isLoading ? ['Loading...'] : searchOptions}
			value={searchString}
			onInputChange={(_, value, __) => setSearchString(value)}
			onChange={(_, value) => {
				if (value) {
					navigate("/user-profile/" + value);
					setSearchString("");
				}
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
									<Search />
								</InputAdornment>
							),
						},
					}}
				/>
			)}
		/>
	);
}
