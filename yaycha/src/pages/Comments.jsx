import { Box, Button, TextField, Alert } from "@mui/material";

import Item from "../components/Item";

import { useParams,useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../ThemedApp";
import { useApp } from "../ThemedApp";

const api = import.meta.env.VITE_API;

export default function Comments() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { setGlobalMsg } = useApp();

    const { isLoading, isError, error, data } = useQuery({
      queryKey: ["comments", id],
      queryFn: async () => {
        const res = await fetch(`${api}/content/posts/${id}`);
        return res.json();
      }
    });

    const removePost = useMutation(async id => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
      });

      navigate("/");
      setGobalMsg("A post deleted");
    });

    const removecomment = useMutation({
      mutationFn: async (id) => {
        await fetch(`${api}/content/comments/${id}`, {
          method: "DELETE",
        });
      },

      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ["comments", id] });

        queryClient.setQueryData(["comments", id], (old) => {
            if (!old) return;
            return {
              ...old,
              comments: old.comments?.filter(comment => comment.id !== id)
            };
          });

          setGlobalMsg("A comment deleted");
      }
    });

    if (isError) {
      return (
        <Box>
          <Alert severity="warning">{error.message}</Alert>
        </Box>
      );
    }

    if (isLoading) {
      return <Box sx={{ textAlign: "center" }}>Loading...</Box>
    }

    return (
      <Box>
        <Item 
          primary
          item={data}
          remove={removePost.mutate}
        />

        {data.comments.map(comment => {
          return (
            <Item
              comment
              key={comment.id}
              item={comment}
              remove={removecomment.mutate}
            />
          );
        })}

        <form>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 3,
            }}>
            <TextField multiline placeholder="Your Comment" />
            <Button type="submit" variant="contained">
              Reply
            </Button>
            </Box>
        </form>
      </Box>
    );

}