import React, { useState, useEffect } from "react";
import axios from "axios";

import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";

import { Container, Row, Col } from "reactstrap";
import "../styles/market.css";

const Market = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch NFT data from the backend
  const fetchNFTs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://http://127.0.0.1:5000/nfts"); // Replace with your API URL
      if (response.status === 200) {
        setData(response.data); // Assume API returns an array of NFT objects
      } else {
        throw new Error("Failed to fetch NFTs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  // Handle category selection (can implement filtering later if needed)
  const handleCategory = (e) => {
    const category = e.target.value;
    // Optionally implement category filtering logic
    console.log("Selected category:", category);
  };

  // Handle item selection (can implement filtering later if needed)
  const handleItems = (e) => {
    const itemType = e.target.value;
    // Optionally implement item filtering logic
    console.log("Selected item type:", itemType);
  };

  return (
    <>
      <CommonSection title={"MarketPlace"} />

      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select onChange={handleCategory}>
                      <option>All Categories</option>
                      <option value="art">Art</option>
                      <option value="music">Music</option>
                      <option value="domain-name">Domain Name</option>
                      <option value="virtual-world">Virtual World</option>
                      <option value="trending-card">Trending Cards</option>
                    </select>
                  </div>

                  <div className="all__items__filter">
                    <select onChange={handleItems}>
                      <option>All Items</option>
                      <option value="single-item">Single Item</option>
                      <option value="bundle">Bundle</option>
                    </select>
                  </div>
                </div>
              </div>
            </Col>

            {isLoading && (
              <Col lg="12">
                <h4>Loading NFTs...</h4>
              </Col>
            )}

            {error && (
              <Col lg="12">
                <h4 className="text-danger">Error: {error}</h4>
              </Col>
            )}

            {!isLoading &&
              !error &&
              data.map((item) => (
                <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                  <NftCard item={item} />
                </Col>
              ))}

            {!isLoading && !error && data.length === 0 && (
              <Col lg="12">
                <h4>No NFTs available</h4>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Market;
