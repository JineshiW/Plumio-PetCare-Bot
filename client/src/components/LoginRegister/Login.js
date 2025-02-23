import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "./LoginRegister.css";
import { loginUser } from "../../api/auth";

function Login() {
  // State to store the username input
  const [username, setUsername] = useState("");

  // State to store the password input
  const [password, setPassword] = useState("");

  // State to store error messages for login failures
  const [errorMessage, setErrorMessage] = useState("");

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "Login";
  }, []);

  // Function to handle login when the button is clicked
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      // Send login request with username and password
      const response = await loginUser(username, password);

      if (response.token && response.userId) {
        // Store authentication token and user ID in local storage
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);

        alert(response.message); // Show success message

        // Clear input fields and error messages
        setUsername("");
        setPassword("");
        setErrorMessage("");

        // Navigate to the chat page after successful login
        navigate("/chat");
      } else {
        setErrorMessage("Login failed. Please try again."); // Show error message if login fails
      }
    } catch (err) {
      setErrorMessage(err); // Display error message if an exception occurs
    }
  };

  return (
    <div className="background">
      {/* Button to navigate back to the home page */}
      <Link to="/" className="home-button">
        Home
      </Link>

      <div className="wrapper">
        <div className="form-box login">
          <form>
            <h1>Login</h1>

            {/* Display error message if login fails */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Username input field */}
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </div>

            {/* Password input field */}
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>

            {/* Login button to submit credentials */}
            <button type="button" onClick={handleLogin}>
              Login
            </button>

            {/* Link to navigate to the registration page */}
            <div className="register-link">
              <p>
                Don't have an account? <Link to="/signup">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
