import React, { useState } from "react";
import { useRegisterMutation } from "../../../redux/api/authApi";
import { useDeleteTeamMutation } from "../../../redux/api/authApi";
import { useViewTeamsQuery } from "../../../redux/api/authApi";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
const AddTeams = () => {
  const [newTeam, setNewTeam] = useState("");
  const [teamPassword, setTeamPassword] = useState("");

  const {
    data,
    isLoading: viewTeamLoading,
    error,
    refetch,
  } = useViewTeamsQuery();
  const [addTeam, { isLoading: addTeamLoading }] = useRegisterMutation();
  const [removeTeam] = useDeleteTeamMutation();

  if (viewTeamLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

   if (error) {
       const code = error.originalStatus || "Error";
       const details = error.error || error.data || "Something went wrong";
       const title = error.status ||  "Error fetching teams";
       return (
         <ErrorMessage
           code={code}
           title={title}
           details={details}
         />
       );
     }

  const team = data.teamName;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newTeam || !teamPassword) {
        toast.error("All fields are required");
        return;
      }
      await addTeam({ teamName: newTeam, password: teamPassword }).unwrap();
      setNewTeam("");
      setTeamPassword("");
      toast.success("Team added successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });
      refetch();
    } catch (error) {
      toast.error(`${error.data?.message || error.message}`);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeTeam({ id }).unwrap();
      toast.success("Team deleted successfully", {
        autoClose: 3000,
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error(`${error.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-md bg-[#121212]  rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add teams
      </h1>
      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Team Name</label>
          <input
            type="text"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Enter team name"
            className="w-full p-2 rounded-lg bg-[#000] text-white border border-gray-600 focus:ring-2 focus:ring-[#13F287] focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-white font-medium mb-1">Team Password</label>
          <input
            type="password"
            value={teamPassword}
            minLength={5}
            onChange={(e) => setTeamPassword(e.target.value)}
            placeholder="Enter team password"
            className="w-full p-2 rounded-lg bg-[#000] text-white border border-gray-600 focus:ring-2 focus:ring-[#13F287] focus:outline-none"
          />
        </div>
        <button
          className="w-full mt-2 py-2 bg-[#13F287] hover:bg-[#7dcca6] text-black font-bold rounded-lg transition duration-300"
          type="submit"
        >
          {addTeamLoading ? `Adding ${newTeam}` : "Add Team"}
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-white text-xl font-semibold">Teams List</h2>
        <ul className="mt-2 space-y-3">
          {team.length > 0 ? (
            team.map((team, index) => (
              <li key={index} className="bg-[#000] text-white p-2 rounded-lg">
                <div className="flex items-center justify-between">
                  {team.teamName}
                  <span className="flex gap-2">
                    <Link to={`/committee/editteams/${team._id}`}>
                      <FaEdit className="cursor-pointer text-xl" />
                    </Link>
                    <button onClick={() => handleDelete(team._id)}>
                      <MdOutlineDeleteForever className="text-red-500 text-xl" />
                    </button>
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-white">No teams available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddTeams;
