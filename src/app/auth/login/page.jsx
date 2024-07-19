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
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import Copyright from "@/app/components/Copyright";
import theme from "@/app/theme";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // No permitir datos vacíos
    if (data.get("email") === "" || data.get("password") === "") {
      alert("Por favor, ingrese su correo y contraseña");
      return;
    }

    // Autenticación
    const res = await signIn("credentials", {
      correo: data.get("email"),
      contrasena: data.get("password"),
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      // Manejar la redirección según los roles del usuario
      if (res.ok) {
        // Re-fetch the session to get updated user roles
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );

        const roles = session.user?.roles || [];

        if (roles.includes("Administrador")) {
          router.push("/administrador");
          //console.log(session);
        } else if (roles.includes("Docente")) {
          router.push("/docente");
        } else if (roles.includes("Estudiante")) {
          router.push("/estudiante");
        } else {
          router.push("/");
        }
      }
    }
  };

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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ingresar
              </Button>
              <Grid textAlign={"end"}>
                <Link href="#" variant="body2">
                  ¿Olvidó su contraseña?
                </Link>
              </Grid>
              <Copyright
                sx={{
                  position: "absolute",
                  bottom: 2, // Colocar en el borde inferior
                  ml: 2, // Margen izquierdo
                  mr: 2, // Margen derecho
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
