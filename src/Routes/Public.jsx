import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Home from "../Pages/Home";

const Public = () => {
  const token = window.localStorage.getItem("acces_token");
  const navigate = useNavigate();
  if (token) {
    navigate("/");
    return <Home />;
  } else {
    return <Outlet />;
  }
};

export default Public;
