import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./nft-card.css";

const NftCard = (props) => {
  const { title, id, imgUrl } = props.item;

  const [votes, setVotes] = useState(0); // Store the vote count
  const [userTokens, setUserTokens] = useState(0); // Store user's token count
  const [loading, setLoading] = useState(false); // Handle vote button loading state

  // Backend API URL
  const API_URL = "https://mantea-mongodbnft.hf.space";

  // Fetch initial data: vote count and user token info
  useEffect(() => {
    // Fetch vote count for the NFT
    const fetchVotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-votes?id=${id}`);
        setVotes(response.data.votes || 0);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    // Fetch user tokens
    const fetchUserTokens = async () => {
      try {
        const voterId = localStorage.getItem("voter_id"); // Assume voter ID is stored locally
        const response = await axios.get(`${API_URL}/get-voter?id=${voterId}`);
        setUserTokens(response.data.tokens || 0);
      } catch (error) {
        console.error("Error fetching user tokens:", error);
      }
    };

    fetchVotes();
    fetchUserTokens();
  }, [id]);

  // Handle the vote action
  const handleVote = async () => {
    if (userTokens <= 0) {
      alert("You don't have enough tokens to vote!");
      return;
    }

    setLoading(true);

    try {
      const voterId = localStorage.getItem("voter_id");
      const response = await axios.post(`${API_URL}/vote-by-voter`, {
        voter_id: voterId,
        file_id: id,
      });

      if (response.status === 200) {
        // Update vote count and token count
        setVotes((prev) => prev + 1);
        setUserTokens((prev) => prev - 1);
        alert("Vote submitted successfully!");
      } else {
        alert("Failed to submit your vote. Please try again.");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error while submitting your vote. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={imgUrl} alt="" className="w-100" />
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
