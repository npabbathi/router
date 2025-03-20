import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.js";
import Create from "../pages/create.js";
import Review from "../pages/review.js";
import Drafts from "../pages/drafts.js";
import Map from "../pages/map.js";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="/create" element={<Create />} />
      <Route path="/review" element={<Review />} />
      <Route path="/drafts" element={<Drafts />} />
    </Routes>
  );
};

export default Router;
