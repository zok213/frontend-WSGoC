import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";

import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";
import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import "../styles/nft-details.css";

const NftDetails = () => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNftDetails = async () => {
      try {
        const response = await axios.get(`https://mantea-mongodbnft.hf.space/get-files`);
        const fetchedNft = response.data.data.find((item) => item.id === id);

        if (!fetchedNft) {
          throw new Error("NFT not found");
        }
        setNft(fetchedNft);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNftDetails();
  }, [id]);

  const handleVote = async (fileId) => {
    const voterId = localStorage.getItem("voter_id");

    if (!voterId) {
      alert("You must log in to vote.");
      return;
    }

    try {
      await axios.post("https://mantea-mongodbnft.hf.space/vote-by-voter/", { id: fileId });
      alert("Vote successfully recorded!");
      setNft((prev) => ({ ...prev, votes: prev.votes + 1 })); // Optimistic UI update
    } catch (err) {
      alert("Failed to record vote. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <CommonSection title={nft.title} />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <img src={nft.url} alt={nft.title} className="w-100 single__nft-img" />
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                <h2>{nft.title}</h2>
                <div className="d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className="d-flex align-items-center gap-2 single__nft-more">
                    <p>Group: {nft.group}</p>
                  </div>
                </div>
                <p className="my-4">Votes: {nft.votes}</p>
                <button
                  className="singleNft-btn d-flex align-items-center gap-2 w-100"
                  onClick={() => handleVote(nft.id)}
                >
                  <i className="ri-shopping-bag-line"></i> Vote
                </button>
              </div>
            </Col>
          </Row>

          {/* Pass NFT data and handleVote function to NftCard */}
          {/* <Row>
            <Col lg="12">
              <NftCard item={nft} handleVote={handleVote} />
            </Col>
          </Row> */}
        </Container>
      </section>

      <LiveAuction />
    </>
  );
};

export default NftDetails;
