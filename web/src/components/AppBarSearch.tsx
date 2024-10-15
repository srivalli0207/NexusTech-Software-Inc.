import { Search } from "@mui/icons-material";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { search_users } from "../utils/fetch";

export default function AppBarSearch() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [searchOptions, setSearchOptions] = useState<string[]>([])


  return (
    <Autocomplete
      freeSolo={true}
      disableClearable={true}
      options={searchOptions}
      sx={{ marginLeft: "auto", width: "20vw" }}
      value={value}
      onInputChange={async (_, value: string, __) => {
        if (value) {
          const res = await search_users(value);
          setSearchOptions(res);
        } else {
          setSearchOptions([]);
        }
      }}
      onChange={(_, value) => {
        if (value) {
          navigate("/user-profile/" + value);
          setValue("");
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
