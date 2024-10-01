import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { grey, yellow } from '@mui/material/colors';
import { AuthContextProvider } from './utils/AuthContext.tsx';
import DynamicRouteTest from './pages/DynamicRouteTest.tsx';
import CompanyPage from './pages/CompanyPage.tsx'
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import NexifyAppBar from './components/NexifyAppBar.tsx';
import { useUser } from './utils/auth-hooks.ts';

function Main() {
  const user = useUser()

  // redirect to another page if user is already logged in
  const routeLoader = async () => {
    if (user != null) {
      return redirect('/')
    }
    else {
      return null
    }
  }

  const router = createBrowserRouter([
    // these routes do not have the Appbar
    { path: "/about", element: <CompanyPage /> },
    { path: "/login", loader: routeLoader, element: <LoginPage /> },
    { path: "/signup", loader: routeLoader, element: <SignUpPage /> },

    // these routes contain the Appbar
    {
      element: <NexifyAppBar />,
      children:
        [
          { path: "/", element: <HomePage /> },
          { path: "/post/:post_id", element: <DynamicRouteTest /> },
        ]
    },
  ]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(
  document.getElementById("root") as ReactDOM.Container,
).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Main />
    </AuthContextProvider>
  </React.StrictMode>
);

