import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/LoginRegister/Login";
import Signup from "./components/LoginRegister/Signup";
import Chatbot from "./components/chat/Chatbot";
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
