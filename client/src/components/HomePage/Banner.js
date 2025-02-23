import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../Assets/img/bannerbot.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import TrackVisibility from "react-on-screen";
import "./HomePage.css";

export const Banner = () => {
  // State variables for animated text effect
  const [loopNum, setLoopNum] = useState(0); // Tracks the current loop index
  const [isDeleting, setIsDeleting] = useState(false); // Indicates if text is being deleted
  const [text, setText] = useState(""); // Stores the displayed text
  const [delta, setDelta] = useState(300 - Math.random() * 100); // Speed of text changes
  const [index, setIndex] = useState(1); // Controls character position
  const toRotate = [
    "your companion.",
    "buddy for your pet.",
    "appointment assistant.",
  ]; // Array of rotating text phrases
  const period = 2000; // Delay before starting a new phrase

  useEffect(() => {
    let ticker = setInterval(() => {
      tick(); // Updates text at regular intervals
    }, delta);

    return () => {
      clearInterval(ticker); // Clears interval on unmount
    };
  }, [text]);

  // Handles typing and deleting effect
  const tick = () => {
    let i = loopNum % toRotate.length; // Determines the current phrase
    let fullText = toRotate[i]; // Full text of the current phrase
    let updatedText = isDeleting
      ? fullText.substring(0, text.length - 1) // Remove a character when deleting
      : fullText.substring(0, text.length + 1); // Add a character when typing

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2); // Speed up deletion
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true); // Start deleting once the full phrase is typed
      setIndex((prevIndex) => prevIndex - 1);
      setDelta(period); // Pause before deleting
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false); // Reset for the next phrase
      setLoopNum(loopNum + 1); // Move to the next phrase
      setIndex(1);
      setDelta(500); // Reset speed for next typing cycle
    } else {
      setIndex((prevIndex) => prevIndex + 1); // Move to the next character
    }
  };

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  {/* Welcome text */}
                  <span className="tagline">Welcome to Plumio</span>
                  <h1>
                    {`Hi! I'm Plumio`}{" "}
                    {/* Rotating text animation */}
                    <span
                      className="txt-rotate"
                      dataPeriod="1000"
                      data-rotate='[ "your companion.", "buddy for your pet.", "appointment assistant." ]'
                    >
                      <span className="wrap">{text}</span>
                    </span>
                  </h1>
                  {/* Description text */}
                  <p>
                    <b>Instant Vet Appointments—Just a Chat Away.</b> Experience
                    hassle-free pet care with our AI-powered chatbot that
                    connects you to trusted vets in seconds.
                  </p>
                  {/* Signup button */}
                  <a
                    href="http://localhost:3000/signup"
                    className="btn-connect"
                  >
                    Create an account! <ArrowRightCircle size={25} />
                  </a>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  {/* Display banner image */}
                  <img src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
