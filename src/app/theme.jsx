import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#033E8C', // Cambia el color principal (primary)
    },
    secondary: {
      main: '#1B3C59', // Cambia el color secundario (secondary)
    },
    error: {
      main: '#F23005', // Cambia el color de error
    },
    warning: {
      main: '#F2E205', // Cambia el color de advertencia
    },
    info: {
      main: '#F2E8B3', // Cambia el color de información
    }
    // Otros ajustes de paleta como background, text, etc.
  },
  // Otros ajustes de tema como typography, spacing, breakpoints, etc.
});

export default theme;
