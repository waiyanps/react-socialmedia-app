import { Box, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchPostLikes, fetchCommentLikes } from "../libs/fetcher";
import UserList from "../components/UserList";

export default function Likes() {
    const { id, type } = useParams();

    const queryFn = () => {
        if (type === "comment") {
            return fetchCommentLikes(id);
        } else {
            return fetchPostLikes(id);
        }
    };

    const { isLoading, isError, error, data } = useQuery({
        queryKey: ["users", id, type],
        queryFn,
    });

    if (isError) {
        return (
            <Box>
                <Alert security="warning">{error.message}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
    }

    return (
        <Box>
            <UserList title="Likes" data={data} />
        </Box>
    );
}