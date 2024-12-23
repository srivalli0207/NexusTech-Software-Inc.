import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { grey, yellow } from '@mui/material/colors';
import { AuthContextProvider, useUser } from './utils/AuthContext.tsx';
import CompanyPage from './pages/CompanyPage.tsx'
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import Layout from './components/Layout.tsx';
import UserProfile from './pages/UserProfile.tsx';
import ConversationList from './pages/ConversationList.tsx';
import MessageList from './pages/MessageList.tsx';
import { SnackbarProvider } from './utils/SnackbarContext.tsx';
import BookmarksPage from './pages/BookmarksPage.tsx';
import { StatusProvider } from './utils/StatusContext.tsx';
import PostPage from './pages/PostPage.tsx';
import ForumsPage from './pages/ForumsPage.tsx';
import ForumPage from './pages/ForumPage.tsx';

export function Main() {
	const user = useUser()

	// redirect to another page if user is already logged in
	const authRouteRedirect = ({ request }: { request: any }) => {
		const req = request as Response

		if (user != null) {
			const url = new URL(req.url)
			const redirectUrl = url.searchParams.get('next')

			if (redirectUrl == null) {
				return redirect('/')
			}
			else {
				return redirect(redirectUrl)
			}
		}
		else {
			return null
		}
	}

	// redirect to login page if user is not logged in
	const protectedRoutes = ({ request }: { request: any }) => {
		const req = request as Response

		if (user == null) {
			const url = new URL(req.url)
			return redirect(`/login/?next=${url.pathname}`)
		}
		else {
			return null
		}
	}

	const router = createBrowserRouter([
		// these routes do not have the Appbar
		{ path: "/about", element: <CompanyPage /> },
		{ path: "/login", loader: authRouteRedirect, element: <LoginPage /> },
		{ path: "/signup", loader: authRouteRedirect, element: <SignUpPage /> },

		// these routes contain the Appbar
		{
			element: <Layout />,
			children:
				[
					{ path: "/", element: <HomePage /> },
					{ path: "/profile/:username", loader: protectedRoutes, element: <UserProfile/>},
					{ path: "/messages", loader: protectedRoutes, element: <ConversationList /> },
					{ path: "/messages/:conversation", loader: protectedRoutes, element: <MessageList /> },
					{ path: "/bookmarks", loader: protectedRoutes, element: <BookmarksPage /> },
					{ path: "/post/:post_id", loader: protectedRoutes, element: <PostPage/> },
					{ path: "/forums", loader: protectedRoutes, element: <ForumsPage /> },
					{ path: "/forums/:forum_name", loader: protectedRoutes, element: <ForumPage /> }
				]
		},
	]);

	// let prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
	// const darkModeStorage = localStorage.getItem("darkMode");
	// if (darkModeStorage !== null) {
	// 	prefersDarkMode = darkModeStorage === "true";
	// } else {
	// 	localStorage.setItem("darkMode", prefersDarkMode.toString());
	// }
	let prefersDarkMode = true;

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
					background: {
						// default: prefersDarkMode ? grey[900] : grey[50]
					}
				},
			}),
		[prefersDarkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider>
				<CssBaseline />
				<RouterProvider router={router} />
			</SnackbarProvider>
		</ThemeProvider>
	);
}

ReactDOM.createRoot(
	document.getElementById("root") as ReactDOM.Container,
).render(
	<React.StrictMode>
		<AuthContextProvider>
			<StatusProvider>
				<Main />
			</StatusProvider>
		</AuthContextProvider>
	</React.StrictMode>
);

