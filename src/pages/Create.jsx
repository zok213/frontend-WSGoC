import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";

import "../styles/create-item.css";

const Create = () => {
  const FIREBASE_URL = "https://mantea-firebasenft.hf.space/upload/";
  const MONGODB_URL = "https://mantea-mongodbnft.hf.space/upload-files";

  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [item, setItem] = useState(null); // Created NFT item
  const [backendStatus, setBackendStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for actions

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Set image preview URL
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !group.trim() || !uploadedFile) {
      alert("Please fill out all fields and upload a file.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload file to Firebase
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const firebaseResponse = await axios.post(FIREBASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!firebaseResponse.data.url) {
        throw new Error("Invalid response from Firebase upload.");
      }

      const firebaseUrl = firebaseResponse.data.url;

      // Save metadata to MongoDB
      const mongoResponse = await axios.post(MONGODB_URL, {
        title: title.trim(),
        group: group.trim(),
        url: firebaseUrl,
      });

      if (!mongoResponse.data.id) {
        throw new Error("Invalid response from MongoDB.");
      }

      setItem({
        id: mongoResponse.data.id,
        title: title.trim(),
        group: group.trim(),
        imgUrl: firebaseUrl,
        votes: 0,
      });

      alert("NFT created successfully!");
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert(`Failed to create NFT: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check backend connection
  const checkBackend = async () => {
    try {
      setBackendStatus("Checking backend...");
      const response = await axios.get(MONGODB_URL);
      setBackendStatus(
        response.status === 200
          ? "Backend is connected!"
          : "Error connecting to backend."
      );
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
                    imgUrl: previewUrl || "",
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
                    <input
                      type="file"
                      className="upload__input"
                      onChange={handleFileChange}
                    />
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

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Item"}
                  </button>
                </form>
                <button
                  className="btn btn-secondary mt-3"
                  onClick={checkBackend}
                >
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
