import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./nft-card.css";

const NftCard = (props) => {
  const { title, id, imgUrl } = props.item;

  const [votes, setVotes] = useState(0); // Total votes for this NFT
  const [userTokens, setUserTokens] = useState(0); // Tokens available for the user
  const [loading, setLoading] = useState(false); // Loading state for vote submission

  const API_URL =
    process.env.REACT_APP_API_URL || "https://mantea-mongodbnft.hf.space";

  useEffect(() => {
    const fetchData = async () => {
      const voterId = localStorage.getItem("voter_id");

      if (!voterId) {
        alert("Please log in to view your token balance and votes.");
        return;
      }

      try {
        // Fetch votes for this NFT and user token balance
        const [votesResponse, tokensResponse] = await Promise.all([
          axios.get(`${API_URL}/get-votes`, { params: { id } }),
          axios.get(`${API_URL}/get-voter`, { params: { id: voterId } }),
        ]);

        setVotes(votesResponse.data.votes || 0);
        setUserTokens(tokensResponse.data.tokens || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch NFT or voter data. Please try again later.");
      }
    };

    fetchData();
  }, [id, API_URL]);

  const handleVote = async () => {
    const voterId = localStorage.getItem("voter_id");

    if (!voterId) {
      alert("You must log in to vote.");
      return;
    }

    if (userTokens <= 0) {
      alert("You don't have enough tokens to vote.");
      return;
    }

    setLoading(true);

    // Optimistic UI update
    setVotes((prevVotes) => prevVotes + 1);
    setUserTokens((prevTokens) => prevTokens - 1);

    try {
      const response = await axios.post(`${API_URL}/vote-by-voter`, {
        voter_id: voterId,
        file_id: id,
      });

      if (response.status !== 200) {
        throw new Error("Unexpected response from the server.");
      }

      console.log("Vote successfully submitted:", response.data);
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Error while voting. Rolling back changes.");

      // Rollback optimistic update
      setVotes((prevVotes) => prevVotes - 1);
      setUserTokens((prevTokens) => prevTokens + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={imgUrl || "/placeholder-image.jpg"} alt={title || "NFT"} className="w-100" />
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
      </div>
    </div>
  );
};

export default NftCard;
