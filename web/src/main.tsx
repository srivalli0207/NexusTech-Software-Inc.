import CompanyPage from './pages/CompanyPage.tsx'
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, yellow } from '@mui/material/colors';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './pages/HomePage.tsx';

const router = createBrowserRouter([
  { path: "/about", element: <CompanyPage /> },
  { path: "/", element: <HomePage /> },
]);

function Main() {
  // const prefersDarkMode = !useMediaQuery("(prefers-color-scheme: dark)");
  const prefersDarkMode = true; // screw it for now

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: prefersDarkMode ? yellow[400] : yellow[700],
          },
          secondary: {
            main: blue[400],
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(<Main />);

