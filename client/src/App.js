import React from 'react';
import { Container, Typography, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import TaskListAndFilters from './components/TaskListAndFilters';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#ff0000',
    },
    background: {
      default: '#f4f4f4',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" className="app-container">
      <Typography variant="h3" align="center" gutterBottom style={{ marginTop: '2vh', fontFamily: 'Roboto', fontSize: '3rem', color: '#007bff', textTransform: 'uppercase', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
</Typography>

        <TaskListAndFilters />
      </Container>
    </ThemeProvider>
  );
};

export default App;
