import React from "react";
import { Link } from "react-router-dom";

import "./nft-card.css";

const NftCard = ({ item, handleVote }) => {
  const { title, id, url, votes } = item;

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img
          src={url || "/placeholder-image.jpg"}
          alt={title || "NFT"}
          className="w-100"
          onError={(e) => (e.target.src = "/placeholder-image.jpg")}
        />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${id}`}>{title}</Link>
        </h5>

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => handleVote(id)}
          >
            <i className="ri-star-line"></i> Vote
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
