import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./nft-card.css";

const NftCard = ({ item, handleVote }) => {
  const { id, title, url, imgUrl, votes } = item;
  const [currentVotes, setCurrentVotes] = useState(votes || 0); // Initialize with item votes
  const [userTokens, setUserTokens] = useState(0); // For voting eligibility
  const [loading, setLoading] = useState(false);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || "https://mantea-mongodbnft.hf.space/";

  // Determine the correct image source (url for finalized NFTs, imgUrl for previews)
  const imageUrl = url || imgUrl;

  useEffect(() => {
    const fetchUserTokens = async () => {
      try {
        const voterId = localStorage.getItem("voter_id");
        if (!voterId) return;

        // Fetch voter token balance
        const response = await axios.get(`${API_URL}/get-voter?id=${voterId}`);
        setUserTokens(response.data.tokens || 0);
      } catch (error) {
        console.error("Failed to fetch user tokens:", error);
      }
    };

    fetchUserTokens();
  }, [API_URL]);

  const handleVoteClick = async () => {
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
    setCurrentVotes((prev) => prev + 1);
    setUserTokens((prev) => prev - 1);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/vote-by-voter`, {
        voter_id: voterId,
        file_id: id,
      });

      if (response.status !== 200) {
        throw new Error("Vote submission failed.");
      }

      console.log("Vote successful:", response.data);
    } catch (error) {
      // Rollback optimistic UI update on failure
      setCurrentVotes((prev) => prev - 1);
      setUserTokens((prev) => prev + 1);
      console.error("Error while voting:", error);
      alert("Failed to record your vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-100" />
        ) : (
          <p className="text-center">Image unavailable</p>
        )}
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{title || "Untitled"}</Link>
        </h5>

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={handleVoteClick}
            disabled={loading || userTokens <= 0}
          >
            {loading ? "Voting..." : <><i className="ri-star-line"></i> Vote</>}
          </button>

          <span className="history__link" style={{ color: "white" }}>
            Votes: {currentVotes}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
