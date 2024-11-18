import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./login.css"; // Custom styles for the modal

Modal.setAppElement("#root"); // Required for accessibility

const API_URL = process.env.REACT_APP_API_URL || "https://mantea-mongodbnft.hf.space";

const Login = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [role, setRole] = useState("contestant");

  const handleLogin = () => {
    const voterId = localStorage.getItem("voter_id");
    if (voterId) {
      onLogin(voterId);
      setIsLoginModalOpen(false);
    } else {
      alert("Please register to proceed!");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register-voter`, {
        name,
        group,
        role,
      });

      if (response.status === 200) {
        const voterId = response.data.id;
        localStorage.setItem("voter_id", voterId);
        onLogin(voterId);
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(false);
        alert("Registration successful!");
      } else {
        alert("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={() => setIsLoginModalOpen(false)}
        contentLabel="Login Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Welcome</h2>
        <p>Please log in to see your token balance.</p>
        <button className="btn btn-primary" onClick={() => setIsRegisterModalOpen(true)}>
          Register
        </button>
        <button className="btn btn-secondary" onClick={handleLogin}>
          Already Registered? Proceed
        </button>
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onRequestClose={() => setIsRegisterModalOpen(false)}
        contentLabel="Register Modal"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Register</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Group:
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
            />
          </label>
          <label>
            Role:
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="contestant">Contestant</option>
              <option value="judge">Judge</option>
            </select>
          </label>
          <button className="btn btn-primary" onClick={handleRegister}>
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Login;
