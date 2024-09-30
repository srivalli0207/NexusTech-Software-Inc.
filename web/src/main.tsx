import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { grey, yellow } from '@mui/material/colors';
import { AuthContextProvider } from './utils/AuthContext.tsx';
import DynamicRouteTest from './pages/DynamicRouteTest.tsx';
import CompanyPage from './pages/CompanyPage.tsx'
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import NexifyAppBar from './components/NexifyAppBar.tsx';

const router = createBrowserRouter([
  { path: "/about", element: <CompanyPage /> },
  { path: "/login", element: <LoginPage />},
  { path: "/signup", element: <SignUpPage />},
  {
    element: <NexifyAppBar />,
    children: 
    [
      { path: "/", element: <HomePage /> },
      { path: "/post/:post_id", element: <DynamicRouteTest />},
    ]
  },
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
            main: grey[600],
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContextProvider>
          <RouterProvider router={router} />
        </AuthContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(<Main />);

