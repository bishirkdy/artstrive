import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { setForceProfileMode } from "../../redux/features/profileModeSlice";
import { useDispatch  , useSelector} from "react-redux";
const ScannedStudentHome = () => {
  const dispatch = useDispatch();
  const forceProfileMode = useSelector((state) => state.profileMode.forceProfileMode);
  useEffect(() => {
    dispatch(setForceProfileMode(true));
  }, [dispatch]);

  console.log("FORCE PROFILE MODE", forceProfileMode);
  
  return (
    <div className="fixed h-screen w-full bg-[#000000] overflow-auto scrollbar-hide">
      <ToastContainer />
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default ScannedStudentHome;
