import React, { useState, useEffect } from "react";
import Layout from "./components/Layout/Layout";
import Login from "./components/ui/login/login";
import "./app.css";

function App() {
  const [voterId, setVoterId] = useState(null);

  useEffect(() => {
    // Check for existing voter ID in localStorage
    const savedVoterId = localStorage.getItem("voter_id");
    if (savedVoterId) {
      setVoterId(savedVoterId);
    }
  }, []);

  return (
    <>
      {/* Show Login Modal if not logged in */}
      {!voterId && <Login onLogin={setVoterId} />}
      {/* Main App Layout */}
      {voterId && <Layout />}
    </>
  );
}

export default App;
