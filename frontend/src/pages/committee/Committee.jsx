import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const Committee = () => {
  const { user } = useSelector((state) => state.auth);

  return user.user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace={true} />
  );
};

export default Committee;
