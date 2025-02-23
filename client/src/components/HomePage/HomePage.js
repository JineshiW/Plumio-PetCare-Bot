import React, { useEffect } from "react";
import { NavBar } from "./NavBar";
import { Banner } from "./Banner";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

function HomePage() {
  useEffect(() => {
    document.title = " Home"; // Change this to your preferred title
  }, []);

  return (
    <div>
      <NavBar />
      <Banner />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
