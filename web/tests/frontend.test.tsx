import { expect, test, vi, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { AuthContextProvider } from "../src/utils/AuthContext";
import { useUser } from "../src/utils/auth-hooks";
import userEvent from "@testing-library/user-event";
import { signup } from "../src/utils/auth";
import SignUpPage from "../src/pages/SignUpPage";
import LoginPage from "../src/pages/LoginPage";
import { MemoryRouter } from "react-router-dom";
import CSRF_Token from "../src/utils/csrf_token";
import { findByLabelText } from "@testing-library/react";
import PostDialog from "../src/components/PostDialog";
import UserProfile from "../src/pages/UserProfile";
import { cleanup } from "@testing-library/react";

export function sum(a, b) {
  return a + b;
}

function AuthRetriever({ func }: { func: (user: UserProfileResponse) => void }) {
  const user = useUser();

  func(user);
  console.log(user);

  return (
    <MemoryRouter>
      <AuthContextProvider>
        <></>
      </AuthContextProvider>
    </MemoryRouter>
  );
}

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("signup test", async () => {
  const { unmount } = render(
    <MemoryRouter>
      <AuthContextProvider>
        <SignUpPage />
      </AuthContextProvider>
    </MemoryRouter>
  );

  await screen.findByLabelText(/username/i);
  await new Promise((resolve, _) => setInterval(resolve, 1000));
  const usernameInput: HTMLInputElement = screen.getByLabelText(/username/i);
  const emailInput: HTMLInputElement = screen.getByLabelText(/email/i);
  const passwordInput: HTMLInputElement = screen.getByLabelText(/^password/i);
  const confirmPasswordInput: HTMLInputElement =
    screen.getByLabelText(/confirm password/i);
  const confirmButton = screen.getByRole("button");

  fireEvent.change(usernameInput, { target: { value: "tester_user" } });
  fireEvent.change(emailInput, { target: { value: "testuser@gmail.com" } });
  fireEvent.change(passwordInput, { target: { value: "test_password" } });
  fireEvent.change(confirmPasswordInput, {
    target: { value: "test_password" },
  });

  expect(usernameInput.value).toBe("tester_user");
  expect(emailInput.value).toBe("testuser@gmail.com");
  expect(passwordInput.value).toBe("test_password");
  expect(confirmPasswordInput.value).toBe("test_password");

  fireEvent.click(confirmButton);
  cleanup();
});

test("login test", async () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <LoginPage />
      </AuthContextProvider>
    </MemoryRouter>
  );

  await screen.findByLabelText(/username/i);
  const usernameInput: HTMLInputElement = screen.getByLabelText(/username/i);
  const passwordInput: HTMLInputElement = screen.getByLabelText(/^password/i);
  const loginButton = screen.getByRole("button");

  fireEvent.change(usernameInput, { target: { value: "tester_user" } });
  fireEvent.change(passwordInput, { target: { value: "test_password" } });

  fireEvent.click(loginButton);

  await new Promise((resolve, _) => setInterval(resolve, 2000));
  //  const errorMsg = screen.getByText("Invalid username or password!")
  //  expect(errorMsg).not.toBeInTheDocument()
  cleanup();
});

test("create post test", async () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <PostDialog />
      </AuthContextProvider>
    </MemoryRouter>
  );

  const dialogButton = await screen.findByRole("button");
  fireEvent.click(dialogButton);
  const postButton = await screen.findByText(/^post/i);
  const textInput: HTMLInputElement = await screen.findByLabelText(/text/i);
  fireEvent.change(textInput, { target: { value: "test post" } });
  fireEvent.click(postButton);
});

// test("edit profile", async () => {
//   render(<MemoryRouter><AuthContextProvider><UserProfile /></AuthContextProvider></MemoryRouter>);
//
//   const editProfileButton = await screen.findByRole("button")
//   fireEvent.click(editProfileButton)
//   const submitButton = await screen.findByText(/submit/i)
//   const nameInput: HTMLInputElement = await screen.findByLabelText(/display name/i)
//   const pronounsInput: HTMLInputElement = await screen.findByLabelText(/pronouns/i)
//   const bioInput: HTMLInputElement = await screen.findByLabelText(/bio/i)
//   const profilePicInput: HTMLInputElement = await screen.findByLabelText(/profile picture url/i)
//   const bannerInput: HTMLInputElement = await screen.findByLabelText(/banner url/i)
//
//   fireEvent.change(nameInput, {target: {value: 'Test User'}})
//   fireEvent.change(pronounsInput, {target: {value: 'them/they'}})
//   fireEvent.change(bioInput, {target: {value: 'This is a test user profile.'}})
//   fireEvent.change(profilePicInput, {target: {value: ''}})
//   fireEvent.change(bannerInput, {target: {value: ''}}
//
// })
