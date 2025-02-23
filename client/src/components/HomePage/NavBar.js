import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../Assets/img/logo.png";
import { HashLink } from "react-router-hash-link";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

export const NavBar = () => {
  // State to track the active navigation link
  const [activeLink, setActiveLink] = useState("home");

  // State to track whether the navbar is scrolled
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Function to check the scroll position and update navbar state
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true); // Add scrolled effect when user scrolls down
      } else {
        setScrolled(false); // Remove scrolled effect when at the top
      }
    };

    // Attach scroll event listener
    window.addEventListener("scroll", onScroll);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Function to update the active navigation link
  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  };

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        {/* Logo linking to the homepage */}
        <Navbar.Brand href="/">
          <img src={logo} alt="Logo" />
        </Navbar.Brand>

        {/* Navbar toggle button for mobile view */}
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        {/* Collapsible navigation links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Home link */}
            <Nav.Link
              href="#home"
              className={
                activeLink === "home" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("home")}
            >
              Home
            </Nav.Link>

            {/* Get In Touch link */}
            <Nav.Link
              href="#connect"
              className={
                activeLink === "getintouch"
                  ? "active navbar-link"
                  : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("getintouch")}
            >
              Get In Touch
            </Nav.Link>

            {/* About Us link */}
            <Nav.Link
              href="#aboutus"
              className={
                activeLink === "aboutus" ? "active navbar-link" : "navbar-link"
              }
              onClick={() => onUpdateActiveLink("aboutus")}
            >
              About Us
            </Nav.Link>
          </Nav>

          {/* Login button linking to the login page */}
          <span className="navbar-text">
            <HashLink to="http://localhost:3000/login">
              <button className="vvd">
                <span>Login!</span>
              </button>
            </HashLink>
          </span>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
