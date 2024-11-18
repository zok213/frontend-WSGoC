import React, { useState, useEffect } from "react";
import Layout from "./components/Layout/Layout";
import Login from "./components/ui/login/login";
import Header from "./components/Header/Header"; // Import Header
import axios from "axios";
import "./app.css";

function App() {
  const [voterId, setVoterId] = useState(localStorage.getItem("voter_id")); // Initialize voter ID from localStorage
  const [voterData, setVoterData] = useState(null); // Store full voter details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  const API_URL = process.env.REACT_APP_API_URL || "https://mantea-mongodbnft.hf.space";

  useEffect(() => {
    if (voterId) {
      fetchVoterData(voterId);
    } else {
      setLoading(false); // Stop loading if no voter ID is found
    }
  }, [voterId]);

  const fetchVoterData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/get-voter`, {
        params: { id },
      });

      if (response.status === 200 && response.data.status === "ok") {
        setVoterData(response.data);
        setError(null);
      } else {
        handleInvalidVoterId();
      }
    } catch (error) {
      console.error("Error fetching voter data:", error.message);
      handleInvalidVoterId();
    } finally {
      setLoading(false);
    }
  };

  const handleInvalidVoterId = () => {
    localStorage.removeItem("voter_id");
    setVoterId(null);
    setVoterData(null);
    setError("Invalid voter ID. Please log in again.");
    setLoading(false);
  };

  const handleLogin = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/get-voter`, {
        params: { id },
      });

      if (response.status === 200 && response.data.status === "ok") {
        localStorage.setItem("voter_id", id);
        setVoterId(id);
        setVoterData(response.data);
        setError(null);
      } else {
        setError("Failed to log in. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      {!voterId && <Login onLogin={handleLogin} />}

      {error && <div className="error-message">{error}</div>}

      {voterId && voterData && (
        <>
          <Header numberOfVotes={voterData.number_of_votes} /> {/* Pass number_of_votes */}
          <Layout voterData={voterData} />
        </>
      )}
    </>
  );
}

export default App;
