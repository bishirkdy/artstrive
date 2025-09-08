import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import SettingsPopUp from "./pages/committee/settings/SettingsPopUp";
import Footer from "./components/Footer";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const [isActive, setIsActive] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="fixed h-[100dvh] w-full bg-[#000000] overflow-auto scrollbar-hide">
      <ToastContainer />
      <div className={`flex ${isActive ? "opacity-20" : ""}`}>
        <Sidebar setIsActives={setIsActive}/>

        <div className="flex-grow max-h-[100dvh] overflow-auto scrollbar-hide">
          <Outlet />
        </div>
      </div>
      {isActive && (          
            <SettingsPopUp setIsActive={setIsActive} />
      )}
      <div className="ml-[17vw] w-[50VW] mt-2">
      <Footer/>
      </div>
    </div>
    
  );
};

export default App;
