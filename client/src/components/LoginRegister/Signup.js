import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "./LoginRegister.css";
import { registerUser } from "../../api/auth";

function Signup() {
  // State hooks for handling form input values and error messages
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isChecked, setIsChecked] = useState(false); // Track checkbox state

  const navigate = useNavigate();

  // Set the document title to 'Signup' when the component is mounted
  useEffect(() => {
    document.title = "Signup";
  }, []);

  // Validate email format when the input field loses focus (on blur)
  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
      setEmailError("Invalid email format"); // Show error if the email is invalid
    } else {
      setEmailError(""); // Clear error if the email is valid
    }
  };

  // Handle user registration on form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // If there's an email format error, show a message and stop submission
    if (emailError) {
      setErrorMessage("Please fix email errors");
      return;
    }

    // Check if passwords match before proceeding
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Ensure the terms & conditions checkbox is checked
    if (!isChecked) {
      setErrorMessage("You must agree to the terms & conditions");
      return;
    }

    try {
      // Attempt to register the user with the provided details
      const response = await registerUser(username, email, password);
      alert(response.message); // Show success message from the server
      // Reset input fields after successful registration
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsChecked(false); // Reset checkbox
      setErrorMessage("");
      navigate("/chat"); // Navigate to the chat page after successful signup
    } catch (err) {
      console.error("Signup error details:", err); // Log error details in case of failure
      setErrorMessage(err); // Show the error message to the user
    }
  };

  return (
    <div className="background">
      {/* Link to the home page */}
      <Link to="/" className="home-button">
        Home
      </Link>
      <div className="wrapper active">
        <div className="form-box register">
          <form>
            <h1>Register</h1>
            {emailError && <p className="small-error-message">{emailError}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Input field for username */}
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

            {/* Input field for email */}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
              />
              <FaEnvelope className="icon" />
            </div>

            {/* Input field for password */}
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

            {/* Input field for confirming password */}
            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>

            {/* Required Terms & Conditions Checkbox */}
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />{" "}
                I agree to the{" "}
                <Link
                  to="https://drive.google.com/file/d/1fhFwjhJAYh0MKJI3HcJb3wyEK7MGRb_4/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  terms &amp; conditions
                </Link>
                .
              </label>
            </div>

            {/* Disable button unless all fields are valid and checkbox is checked */}
            <button
              type="button"
              onClick={handleRegister}
              disabled={
                !username || !email || emailError || !password || !isChecked
              }
            >
              Register
            </button>

            {/* Link to login page if user already has an account */}
            <div className="register-link">
              <p>
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
