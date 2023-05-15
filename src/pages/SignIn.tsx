import React, { useState } from "react";
import useNotification from "../hooks/useNotification";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthService from "../services/AuthService";
import { toast } from "react-toastify";
import CopyRight from "../component/copyright";
const theme = createTheme();

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { showLoading } = useNotification();
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    // Validate email and password
    if (!email || !password) {
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }

    // Email validation
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email)) {
      setEmailError(true);
      return;
    }

    showLoading(true);

    AuthService.login(email, password)
      .then((response: any) => {
        showLoading(false);
        const userData = response?.data?.access_token;
        localStorage.setItem("access_token", userData);
        navigate('/dashboard')
      })
      .catch((error) => {
        toast.error("Invalid User");
        console.log(error);
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={emailError}
                helperText={
                  emailError ? "Please enter a valid email address" : ""
                }
                onBlur={(e) => {
                  setEmailError(!e.target.value);
                }}
                inputProps={{
                  pattern: "\\S+@\\S+\\.\\S+",
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={passwordError}
                helperText={passwordError ? "Please enter a password" : ""}
                onBlur={(e) => {
                  setPasswordError(!e.target.value);
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
          <CopyRight></CopyRight>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default SignIn;
