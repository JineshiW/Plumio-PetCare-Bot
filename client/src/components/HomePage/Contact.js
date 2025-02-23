import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../Assets/img/contact-us.jpg";
import TrackVisibility from "react-on-screen";
import "./HomePage.css";

export const Contact = () => {
  // Initial state for form fields
  const formInitialDetails = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  };

  // State for managing form input values
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  // State for button text display
  const [buttonText, setButtonText] = useState("Send");

  // Function to update form fields dynamically
  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    // Construct email subject and body from form input
    const subject = encodeURIComponent("Contact Form Submission - Plumio");
    const body = encodeURIComponent(
      `Name: ${formDetails.firstName} ${formDetails.lastName}\n` +
        `Email: ${formDetails.email}\n` +
        `Phone: ${formDetails.phone}\n` +
        `Message: ${formDetails.message}`
    );

    // Opens default email client with pre-filled details
    window.location.href = `mailto:your_email@gmail.com?subject=${subject}&body=${body}`;

    // Reset form fields after submission
    setFormDetails(formInitialDetails);
  };

  return (
    <section className="contact section-padding" id="connect">
      <Container>
        <Row className="align-items-center">
          {/* Contact image section */}
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <img
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                  src={contactImg}
                  alt="Contact Us"
                />
              )}
            </TrackVisibility>
          </Col>

          {/* Contact form section */}
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <h2>Get In Touch</h2>
                  <form onSubmit={handleSubmit}>
                    <Row>
                      {/* First Name Input */}
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="text"
                          value={formDetails.firstName}
                          placeholder="First Name"
                          onChange={(e) =>
                            onFormUpdate("firstName", e.target.value)
                          }
                        />
                      </Col>

                      {/* Last Name Input */}
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="text"
                          value={formDetails.lastName}
                          placeholder="Last Name"
                          onChange={(e) =>
                            onFormUpdate("lastName", e.target.value)
                          }
                        />
                      </Col>

                      {/* Email Input */}
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="email"
                          value={formDetails.email}
                          placeholder="Email Address"
                          onChange={(e) =>
                            onFormUpdate("email", e.target.value)
                          }
                        />
                      </Col>

                      {/* Phone Number Input */}
                      <Col size={12} sm={6} className="px-1">
                        <input
                          type="tel"
                          value={formDetails.phone}
                          placeholder="Phone No."
                          onChange={(e) =>
                            onFormUpdate("phone", e.target.value)
                          }
                        />
                      </Col>

                      {/* Message Input */}
                      <Col size={12} className="px-1">
                        <textarea
                          rows="6"
                          value={formDetails.message}
                          placeholder="Message"
                          onChange={(e) =>
                            onFormUpdate("message", e.target.value)
                          }
                        ></textarea>
                        
                        {/* Submit Button */}
                        <button type="submit">
                          <span>{buttonText}</span>
                        </button>
                      </Col>
                    </Row>
                  </form>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
