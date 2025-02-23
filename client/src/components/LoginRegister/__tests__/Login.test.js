import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login"; 
import { MemoryRouter } from "react-router-dom";
import { loginUser } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import '@testing-library/jest-dom';

// Mock the login API function and useNavigate hook
jest.mock("../../../api/auth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();

  beforeAll(() => {
    // Mock the window alert function
    window.alert = jest.fn();
  });

  beforeEach(() => {
    // Set up mock implementation for useNavigate
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    // Clear all mock function calls after each test
    jest.clearAllMocks();
  });

  test("handles successful login", async () => {
    // Mock API response for a successful login
    loginUser.mockResolvedValueOnce({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2I4MmZiY2YwMTBiMzZjMjYzYTM4ZTciLCJpYXQiOjE3NDAxNDE1OTUsImV4cCI6MTc0MDE0NTE5NX0.WL2BwgPzQLKixVEGjlPPKGD7eYabfHz5itCROJH2G5c",
      userId: "67b82fbcf010b36c263a38e7",
      message: "Login successful",
    });

    // Render the Login component inside MemoryRouter
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Select input fields and login button
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input and button click
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(loginButton);

    // Verify that the login API function was called with correct credentials
    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith("testuser", "testpassword");
    });

    // Verify that the user is navigated to the chat page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    });
  });

  test("displays error message on failed login", async () => {
    // Mock API response for a failed login
    loginUser.mockRejectedValueOnce("Login failed");

    // Render the Login component inside MemoryRouter
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Select input fields and login button
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Simulate user input and button click with incorrect credentials
    fireEvent.change(usernameInput, { target: { value: "wronguser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    // Verify that an error message is displayed on the screen
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
