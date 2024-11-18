import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";

import "../styles/create-item.css";

const Create = () => {
  const FIREBASE_URL = "https://mantea-firebasenft.hf.space/upload/";
  const MONGODB_URL = "https://mantea-mongodbnft.hf.space/upload-files/";

  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [item, setItem] = useState(null); // Created NFT item
  const [backendStatus, setBackendStatus] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Set image preview URL
    }
  };

  // Clean up preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle NFT creation
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !group || !uploadedFile) {
      alert("Please fill out all fields and upload a file.");
      return;
    }

    try {
      // Upload file to Firebase
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const firebaseResponse = await axios.post(FIREBASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const firebaseUrl = firebaseResponse.data.url;

      // Save metadata to MongoDB
      const mongoResponse = await axios.post(MONGODB_URL, {
        title,
        group,
        url: firebaseUrl,
      });

      setItem({ id: mongoResponse.data.id, title, group, imgUrl: firebaseUrl, votes: 0 });
      alert("NFT created successfully!");
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("Failed to create NFT. Please try again.");
    }
  };

  // Check backend connection
  const checkBackend = async () => {
    try {
      const response = await axios.get(MONGODB_URL);
      setBackendStatus(response.status === 200 ? "Backend is connected!" : "Error connecting to backend.");
    } catch (error) {
      setBackendStatus(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <CommonSection title="Create Item" />

      <section>
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4 text-light">Preview Item</h5>
              {previewUrl || item ? (
                <NftCard
                  item={{
                    id: item ? item.id : "preview", // Placeholder ID for preview
                    title: title || "Preview Title",
                    imgUrl: previewUrl || item?.imgUrl || "/placeholder-image.jpg",
                    votes: item ? item.votes : 0,
                  }}
                />
              ) : (
                <p className="text-light">Upload an image to preview your NFT.</p>
              )}
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form onSubmit={handleCreate}>
                  <div className="form__input">
                    <label>Upload File</label>
                    <input type="file" className="upload__input" onChange={handleFileChange} />
                  </div>

                  <div className="form__input">
                    <label>Group</label>
                    <input
                      type="text"
                      placeholder="Enter group's name"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                    />
                  </div>

                  <div className="form__input">
                    <label>Title</label>
                    <input
                      type="text"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Create Item
                  </button>
                </form>
                <button className="btn btn-secondary mt-3" onClick={checkBackend}>
                  Check Backend Connection
                </button>
                {backendStatus && <p className="text-light mt-2">{backendStatus}</p>}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
