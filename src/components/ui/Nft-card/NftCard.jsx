import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./nft-card.css";

const NftCard = (props) => {
  const { title, id, imgUrl } = props.item;

  const [votes, setVotes] = useState(0);
  const [userTokens, setUserTokens] = useState(0);
  const [loading, setLoading] = useState(false);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    // Fetch initial data: votes and user tokens
    const fetchData = async () => {
      try {
        const voterId = localStorage.getItem("voter_id");
        if (!voterId) {
          alert("Please log in to see your token balance.");
          return;
        }

        // Fetch vote count and user tokens in parallel
        const [votesResponse, tokensResponse] = await Promise.all([
          axios.get(`${API_URL}/get-votes?id=${id}`),
          axios.get(`${API_URL}/get-voter?id=${voterId}`),
        ]);

        setVotes(votesResponse.data.votes || 0);
        setUserTokens(tokensResponse.data.tokens || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [id, API_URL]);

  const handleVote = async () => {
    const voterId = localStorage.getItem("voter_id");
    if (!voterId) {
      alert("Please log in to vote!");
      return;
    }

    if (userTokens <= 0) {
      alert("You don't have enough tokens to vote!");
      return;
    }

    // Optimistic UI update
    setVotes((prev) => prev + 1);
    setUserTokens((prev) => prev - 1);

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/vote-by-voter`, {
        voter_id: voterId,
        file_id: id,
      });

      if (response.status !== 200) {
        throw new Error("Failed to submit your vote.");
      }

      // Optional: Verify with backend response if needed
      console.log("Vote successful:", response.data);
    } catch (error) {
      // Rollback optimistic UI update on failure
      setVotes((prev) => prev - 1);
      setUserTokens((prev) => prev + 1);

      console.error("Error voting:", error);
      alert("Error while submitting your vote. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={imgUrl} alt={title} className="w-100" />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{title}</Link>
        </h5>

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={handleVote}
            disabled={loading || userTokens <= 0}
          >
            {loading ? "Voting..." : <><i className="ri-star-line"></i> Vote</>}
          </button>

          <span className="history__link">
            <Link to="#">Votes: {votes}</Link>
          </span>
        </div>

        <div className="mt-2">
          <p className="token__info">Your Tokens: {userTokens}</p>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
