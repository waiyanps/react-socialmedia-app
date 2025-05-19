import { 
  Box,
  Button,
  TextField,
  Typography,
  Alert
} from "@mui/material";

import { useRef, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import { postUser } from "../libs/fetcher";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";

export default function Register() {
  const { setGlobalMsg } = useApp();

  const nameInput = useRef();
  const usernameInput = useRef();
  const bioInput = useRef();
  const passswordInput = useRef();

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: async (data) => {
      return await postUser(data);
    },
    onError: () => {
      setError("Cannot create account");
    },
    onSuccess: (user) => {
      setGlobalMsg("Account Created");
      navigate("/login");
    },
  });

  const handleSubmit = () => {
    const name = nameInput.current.value;
    const username = usernameInput.current.value;
    const bio = bioInput.current.value;
    const password = passswordInput.current.value;

    if (!name || !username || !password) {
      setError("Name, username, and password are required");
      return;
    }

    mutate({ name, username, bio, password });
  };

  return (
    <Box>
      <Typography variant="h3">Register</Typography>

      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
         <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mt: 2,
          }}
         >
            <TextField inputRef={nameInput} placeholder="Name" fullWidth />
            <TextField inputRef={usernameInput} placeholder="Username" fullWidth />
            <TextField inputRef={bioInput} placeholder="Bio" fullWidth />
            <TextField inputRef={passswordInput} type="password" placeholder="Password" fullWidth />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
            </Button>
         </Box>
      </form>
    </Box>
  );
}