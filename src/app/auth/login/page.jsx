"use client";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import Copyright from "@/app/components/Copyright";
import theme from "@/app/theme";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (!email || !password) {
      setError("Por favor, ingrese su correo y contraseña");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        correo: email,
        contrasena: password,
        redirect: false,
      });

      if (res.error) {
        setError("Credenciales incorrectas. Inténtelo de nuevo.");
        setIsLoading(false);
      } else {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );
        const roles = session.user?.roles || [];
        const roleRoutes = {
          administrador: "/administrador",
          docente: "/docente",
          estudiante: "/estudiante",
        };
        const route =
          roles
            .map((role) => role.toLowerCase())
            .find((role) => roleRoutes[role]) || "/";
        router.push(route);
      }
    } catch (error) {
      setError("Ocurrió un error. Inténtelo de nuevo más tarde.");
      setIsLoading(false);
    } finally {
      //setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(/logoPCEI.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <MeetingRoomTwoToneIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            {error && (
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
                role="alert"
              >
                <svg
                  style={{ marginRight: "8px" }}
                  className="flex-shrink-0 inline w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <div>
                  <span style={{ fontWeight: "bold" }}>Error:</span> {error}
                </div>
              </div>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Recordar mis datos"
              />
              <Box sx={{ position: "relative" }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  Ingresar
                </Button>
                {isLoading && (
                  <Box
                    sx={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
                      zIndex: 9999,
                    }}
                  >
                    <CircularProgress size={50} />
                  </Box>
                )}
              </Box>
              <Grid textAlign={"end"}>
                <Link href="#" variant="body2">
                  ¿Olvidó su contraseña?
                </Link>
              </Grid>
              <Copyright
                sx={{
                  position: "absolute",
                  bottom: 2,
                  ml: 2,
                  mr: 2,
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
