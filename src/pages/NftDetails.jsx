import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import axios from "axios";

import CommonSection from "../components/ui/Common-section/CommonSection";
import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import "../styles/nft-details.css";

const NftDetails = () => {
  const { id } = useParams(); // Get the NFT ID from the URL
  const [nft, setNft] = useState(null); // State to store the NFT details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch NFT details from the backend
    const fetchNftDetails = async () => {
      try {
        const response = await axios.get(`https://mantea-mongodbnft.hf.space/get-files/`);
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
                <button className="singleNft-btn d-flex align-items-center gap-2 w-100">
                  <i className="ri-shopping-bag-line"></i>
                  <Link to="#" onClick={() => handleVote(nft.id)}>
                    Vote
                  </Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <LiveAuction />
    </>
  );

  async function handleVote(fileId) {
    try {
      await axios.post("https://mantea-mongodbnft.hf.space/vote-by-voter/", { id: fileId });
      alert("Vote successfully recorded!");
    } catch (err) {
      alert("Failed to record vote. Please try again.");
    }
  }
};

export default NftDetails;
