import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import NftCard from "../components/ui/Nft-card/NftCard";

import "../styles/create-item.css";

const Create = () => {
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [item, setItem] = useState(null); // State to store the created NFT item

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Set image preview URL
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !group || !uploadedFile) {
      alert("Please fill out all fields and upload a file.");
      return;
    }

    try {
      // Upload the file to Firebase
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const firebaseResponse = await axios.post("https://mantea-mongodbnft.hf.space//upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const firebaseUrl = firebaseResponse.data.url;

      // Save the metadata to MongoDB
      const mongoResponse = await axios.post("https://mantea-mongodbnft.hf.space/upload-files", {
        title,
        group,
        url: firebaseUrl,
      });

      setItem({ id: mongoResponse.data.id, title, group, imgUrl: firebaseUrl, votes: 0 });
      alert("NFT created successfully!");
    } catch (error) {
      console.error("Error creating NFT:", error);
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
              {item || previewUrl ? (
                <NftCard
                  item={{
                    id: item ? item.id : "preview", // Use a placeholder ID for the preview
                    title: title || "Preview Title",
                    imgUrl: previewUrl || "",
                    votes: item ? item.votes : 0, // Default to 0 votes for the preview
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
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
