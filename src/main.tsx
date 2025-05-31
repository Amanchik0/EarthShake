import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import { AuthProvider } from './components/auth/AuthContext';

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter> 
      <AuthProvider>
        <App />
      </AuthProvider>  
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
