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
import Layout from './components/Layout.tsx';
import UserProfile from './pages/UserProfile.tsx';
import { useUser } from './utils/auth-hooks.ts';

function Main() {
  const user = useUser()

  // redirect to another page if user is already logged in
  const routeLoaderAuthenticated = async () => {
    if (user != null) {
      return redirect('/')
    }
    else {
      return null
    }
  }

  // redirect to login page if user is not logged in
  const routeLoaderUnauthenticated = async () => {
    if (user ==  null) {
      return redirect('/login')
    }
    else {
      return null
    }
  }

  const router = createBrowserRouter([
    // these routes do not have the Appbar
    { path: "/about", element: <CompanyPage /> },
    { path: "/login", loader: routeLoaderAuthenticated, element: <LoginPage /> },
    { path: "/signup", loader: routeLoaderAuthenticated, element: <SignUpPage /> },

    // these routes contain the Appbar
    {
      element: <Layout />,
      children:
        [
          { path: "/", element: <HomePage /> },
          { path: "/user-profile", loader: routeLoaderUnauthenticated, element: <UserProfile /> },
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

