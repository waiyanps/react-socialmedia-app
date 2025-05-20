import {
    Alert,
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField,
    Grid,
} from "@mui/material";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSearch } from "../libs/fetcher";
import FollowButton from "../components/FollowButton";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const navigate = useNavigate();

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: () => fetchSearch(debouncedQuery),
        enabled: !!debouncedQuery, // Don't fetch if the query is empty
    });

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search user"
                onKeyUp={(e) => {
                    setQuery(e.target.value);
                }}
            />

            {isLoading ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>Loading...</Box>
            ) : (
                <List>
                    {data?.map((user) => (
                        <ListItem key={user.id}>
                            <ListItemButton onClick={() => navigate(`/profile/${user.id}`)}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText primary={user.name} secondary={user.bio} />
                                <Grid container alignItems="center" justifyContent="flex-end">
                                    <Grid item>
                                        <FollowButton user={user} />
                                    </Grid>
                                </Grid>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
