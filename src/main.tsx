import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom'; // 👈 Добавить это
import App from './App';

const theme = createTheme({});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter> {/* 👈 Оборачиваем App */}
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
