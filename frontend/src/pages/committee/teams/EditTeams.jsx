import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useUpdateTeamNameOrPasswordMutation } from "../../../redux/api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";


const EditTeams = () => {
  const [updateName, setUpdateTeamName] = useState("");
  const [updatePassword, setUpdateTeamPassword] = useState("");

  const { id } = useParams();
  const [updateData, { isLoading, isError, error  }] = useUpdateTeamNameOrPasswordMutation();

  const navigate = useNavigate();
  // const location = useLocation();
  // const {onTeamUpdated } = location.state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateData({ id, teamName: updateName, password: updatePassword }).unwrap();
      setUpdateTeamName("");
      setUpdateTeamPassword("");
      toast.success("Team details updated successfully", { autoClose: 3000, position: "bottom-right" });
      navigate("/committee/addteams")
      
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "An error occurred", { autoClose: 3000, position: "bottom-right" });
    }
  };

  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-md bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">Edit Team</h1>

      {isError && (
        <p className="text-red-500 text-sm mb-4">
          Error: {error.data?.message || "Failed to update team details"}
        </p>
      )}

      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Team Name</label>
          <input
            type="text"
            value={updateName}
            onChange={(e) => setUpdateTeamName(e.target.value)}
            placeholder="Enter new name"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[#13F287] focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Team Password</label>
          <input
            type="password" 
            value={updatePassword}
            onChange={(e) => setUpdateTeamPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[#13F287] focus:outline-none"
          />
        </div>
        <button
          className="w-full mt-2 py-2 bg-[#13F287] hover:bg-[#7dcca6] text-white font-bold rounded-lg transition duration-300"
          type="submit"
          disabled={isLoading} 
        >
          {isLoading ? "Updating..." : "Update Team"}
        </button>
      </form>
    </div>
  );
};

export default EditTeams;