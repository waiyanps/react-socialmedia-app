import {
    Alert,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemedApp";
import { postLogin } from "../libs/fetcher";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
    const usernameInput = useRef();
    const passwordInput = useRef();

    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setAuth } = useApp();

    const { mutate, isLoading } = useMutation({
        mutationFn: ({ username, password }) => postLogin(username, password),
        onError: () => {
            setError("Incorrect username or password");
        },
        onSuccess: (result) => {
            setAuth(result.user);
            localStorage.setItem("token", result.token);
            navigate("/");
        },
    });
    const handleSubmit = () => {
        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            setError("Username and password required");
            return;
        }

        mutate({ username, password });
    };

    return (
        <Box>
            <Typography variant="h3">Login</Typography>
            {error && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            mt: 2,
                        }}>
                           <TextField 
                                inputRef={usernameInput}
                                placeholder="Username"
                                fullWidth
                                autoComplete="username"
                           />
                                               <TextField
                        inputRef={passwordInput}
                        type="password"
                        placeholder="Password"
                        fullWidth
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                           


                    </Box>

            </form>
        </Box>
    )
}