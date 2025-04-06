import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from './private.js'
import Login from '../pages/login.js'
import Home from "../pages/home.js";
import Create from "../pages/create.js";
import Review from "../pages/review.js";
import All from "../pages/all.js";
import Drafts from "../pages/drafts.js";
import Map from "../pages/map.js";
import Wall from "../pages/wall.js";
import Info from "../pages/info.js";

const Router = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/create" element={<Create />} />
        <Route path="/review" element={<All />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/info" element={<Info />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/wall" element={<Wall />} />
      </Route>
      <Route path="/login" element={<Login/>}/>
    </Routes>
  );
};

export default Router;
