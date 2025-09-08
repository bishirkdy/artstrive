import React, {  useState } from "react";
import { useEditAdminMutation } from "../../../redux/api/authApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { updateUser } from "../../../redux/features/authSlice";
import {  useDispatch } from "react-redux";
import { useRef } from "react";

const EditProfile = () => {
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const { id } = useParams();

    const [adminLog] = useEditAdminMutation()
    const dispatch = useDispatch()  
    const navigate = useNavigate()
    

    
  const submitHandler = async (e) => {
    e.preventDefault();
    toast.dismiss()
    try {
        if(!adminName || !adminPassword){
          toast.error("All fields are required");
          return;
        } 
         
         const res = await adminLog({id , teamName:adminName , password : adminPassword}).unwrap();
          dispatch(updateUser({ ...res }));
          navigate("/dashboard")
         

        toast.success("Admin profile edited successfully", {autoClose: 3000, position: "bottom-right"});
        setAdminName("");
        setAdminPassword("");
    } catch (error) {
      toast.error("Failed to edit admin profile")
    }
  };

  return (
    <div className="mx-auto mt-[4rem] flex flex-col p-6 max-w-md bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Edit Admin Profile
      </h1>
      {/* Form to edit admin */}
      <form onSubmit={ submitHandler} className="flex  flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Name</label>
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            placeholder="Enter new name"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Password</label>
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <button
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-white font-bold rounded-lg transition duration-300"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
