import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import NftCard from "../Nft-card/NftCard";
import axios from "axios";

import "./live-auction.css";

const LiveAuction = () => {
  const [nftData, setNftData] = useState([]); // State to store NFT data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  const API_URL = "https://mantea-mongodbnft.hf.space/get-files"; // Backend API endpoint

  // Fetch NFT data from the backend
  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.status === 200) {
          setNftData(response.data.data); // Assume `data` contains an array of NFT items
        } else {
          throw new Error("Failed to fetch NFT data");
        }
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, []);

  // Handle loading state
  if (loading) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h3>Loading NFTs...</h3>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <h3>Error: {error}</h3>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Top Notch Ideas</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {nftData.slice(0, 4).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
              <NftCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;
