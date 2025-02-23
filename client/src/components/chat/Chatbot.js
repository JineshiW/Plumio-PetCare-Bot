import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./chat.css"; // Import the CSS file for styling

function Chatbot() {
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [input, setInput] = useState(""); // Stores user input
  const chatEndRef = useRef(null); // Reference to auto-scroll chat window
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [userId, setUserId] = useState(null); // Stores logged-in user's ID

  useEffect(() => {
    document.title = "Chat";
  }, []);

  // Retrieve userId from localStorage when component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      navigate("/login"); // Redirect to login if user is not authenticated
    }
  }, [navigate]);

  // Automatically scroll to the latest message when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = async () => {
    if (input.trim() === "" || !userId) return; // Prevent sending empty messages or if userId is missing

    // Append user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: input, user: true }
    ]);

    const userInput = input; // Store input before clearing
    setInput(""); // Clear input field

    // Display bot's typing indicator
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { typing: true, user: false }
      ]);

      // Simulate bot response delay
      setTimeout(async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/chat", {
            userId, // Include userId in request
            message: userInput,
          });

          // Remove typing indicator and display bot response
          setMessages((prevMessages) =>
            prevMessages
              .filter((msg) => !msg.typing)
              .concat({
                text: response.data.message,
                user: false,
                receiptUrl: response.data.receiptUrl, // Add receipt link if available
              })
          );
        } catch (error) {
          // Handle message sending failure
          setMessages((prevMessages) =>
            prevMessages
              .filter((msg) => !msg.typing)
              .concat({
                text: "Oops! Something went wrong. Please try again.",
                user: false,
              })
          );
        }
      }, 2000); // Simulated bot response delay
    }, 1000); // Delay before showing typing indicator
  };

  // Function to log out the user
  const handleLogout = () => {
    localStorage.removeItem("userId"); // Remove user ID from localStorage
    navigate("/"); // Redirect to the home/login page
  };

  // Function to restart the chat
  const handleRestartChat = async () => {
    setMessages([]); // Clear all chat messages
    setInput(""); // Reset input field

    // Send a restart request to the backend
    await axios.post("http://localhost:5000/api/chat", {
      userId,
      message: "restart chat",
    });
  };

  // Handles pressing Enter key to send a message
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      {/* Restart Chat Button */}
      <button className="restart-button" onClick={handleRestartChat}>
        Restart Chat
      </button>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="chat-window">
          {messages.map((msg, idx) =>
            msg.typing ? (
              // Display typing indicator when bot is responding
              <div key={idx} className="bot-message typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              // Display user or bot message
              <div
                key={idx}
                className={msg.user ? "user-message" : "bot-message"}
              >
                <p>{msg.text}</p>
                {/* Display receipt download link if available */}
                {msg.receiptUrl && (
                  <p>
                    <a
                      href={msg.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Receipt
                    </a>
                  </p>
                )}
              </div>
            )
          )}
          <div ref={chatEndRef} /> {/* Empty div for auto-scrolling */}
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
