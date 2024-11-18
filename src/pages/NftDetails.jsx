import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from "reactstrap";
import axios from "axios";

import CommonSection from "../components/ui/Common-section/CommonSection";
import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import "../styles/nft-details.css";

const NftDetails = () => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteCount, setVoteCount] = useState(1);

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

  const handleVote = async () => {
    const voterId = localStorage.getItem("voter_id");
  
    if (!voterId) {
      alert("You must log in to vote.");
      setIsModalOpen(false);
      return;
    }
  
    if (voteCount <= 0) {
      alert("Vote count must be greater than 0.");
      return;
    }
  
    try {
      const response = await axios.post("https://mantea-mongodbnft.hf.space/vote-by-voter", {
        voter_id: voterId,
        file_id: nft.id,
        vote_count: voteCount,
      });
  
      if (response.status === "None" ) {
        alert("Vote successfully recorded!");
        setIsModalOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Failed to record vote.");
      }
    } catch (err) {
      console.error("Error recording vote:", err.response?.data || err.message);
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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
                  onClick={() => setIsModalOpen(true)}
                >
                  <i className="ri-shopping-bag-line"></i> Vote
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <LiveAuction />

      {/* Modal for voting */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Cast Your Vote</ModalHeader>
        <ModalBody>
          <p style = {{ color: "black"}}> Enter the number of votes:</p>
          <Input
            type="number"
            value={voteCount}
            onChange={(e) => setVoteCount(Number(e.target.value))}
            min="1"
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleVote}>
            Submit Vote
          </Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default NftDetails;
