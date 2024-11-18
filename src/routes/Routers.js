import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Market from "../pages/Market";
import Create from "../pages/Create";
import NftDetails from "../pages/NftDetails";

const Routers = () => {
  const voterId = localStorage.getItem("voter_id");

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route
        path="/market"
        element={voterId ? <Market /> : <Navigate to="/home" />}
      />
      <Route
        path="/create"
        element={voterId ? <Create /> : <Navigate to="/home" />}
      />
      <Route
        path="/market/:id"
        element={voterId ? <NftDetails /> : <Navigate to="/home" />}
      />
    </Routes>
  );
};

export default Routers;
