import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
// import { setForceProfileMode } from "../../redux/features/profileModeSlice";
const ScannedStudentHome = () => {
  
  return (
    <div className="fixed h-screen w-full bg-[#000000] overflow-auto scrollbar-hide">
      <ToastContainer />
      <Outlet />
    </div>
  );
};

export default ScannedStudentHome;
