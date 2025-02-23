import { Container, Row, Col } from "react-bootstrap";
import logo from "../Assets/img/logo.png";
import navIcon1 from "../Assets/img/nav-icon1.svg";
import navIcon2 from "../Assets/img/nav-icon2.svg";
import navIcon3 from "../Assets/img/nav-icon3.svg";

export const Footer = () => {
  return (
    <footer className="footer" id="aboutus">
      <Container>
        <Row className="align-items-center">
          {/* Logo Section */}
          <Col size={12} sm={6}>
            <img src={logo} alt="Logo" className="footer-logo" />
          </Col>

          {/* Social Media Links & Copyright Section */}
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              {/* Social Media Icons with Links */}
              <a href="https://www.linkedin.com/">
                <img src={navIcon1} alt="Instagram" />
              </a>
              <a href="https://www.facebook.com/">
                <img src={navIcon2} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/">
                <img src={navIcon3} alt="LinkedIn" />
              </a>
            </div>
            {/* Footer Copyright Text */}
            <p>Copyright 2025. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
