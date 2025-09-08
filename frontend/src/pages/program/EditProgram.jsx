import React, { useEffect, useState } from "react";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { useEditProgramsMutation } from "../../redux/api/programApi";
import {toast} from 'react-toastify'
import { useGetAllProgramQuery } from "../../redux/api/programApi";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

const EditProgram = () => {
    const [id , setId] = useState("");
    const [zone, setZone] = useState("");
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [stage , setStage] = useState("");

    const [editProgram , {isLoading : updateLoading}] = useEditProgramsMutation();
    const {data : programs , isLoading , error : programError ,  refetch} = useGetAllProgramQuery();
    const navigate = useNavigate();
   
    const {_id} = useParams()
   
    
   
    const { data , isLoading : zoneLoading , error : zoneError } = useViewZoneQuery();
    const zoneFromDB = Array.isArray(data) ? data : []
    const specificProgram = Array.isArray(programs) ? programs.find(p => p._id === _id) : [];
    useEffect(() => {
        if (specificProgram) {
            setName(specificProgram.name);
            setId(specificProgram.id);
            setZone(specificProgram.zone);
            setType(specificProgram.type);
            setStage(specificProgram.stage);
        } 

    },[specificProgram ])
    useEffect(() => {
      toast.warn("You can't change id of program")
    },[toast])
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editProgram({ _id , id ,  zone, name, type  , stage}).unwrap();
           toast.success("Program updated successfully",{position : "bottom-right"});
            setName("");
            setZone("");
            setType("");
            setId("");
            setStage("");
            navigate('/programlist')
            refetch();
        } catch (error) {
            toast.error("An error occurred while updating the program , Please try again");
        }
    };
    if(isLoading || zoneLoading) return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader/>
      </div>
    )
    const error = programError || zoneError;
      if (error) {
      const code = error.originalStatus || "Error";
      const details = error.error || error.data || "Something went wrong";
      const title = error.status ||  "Error fetching zones";
      return (
        <ErrorMessage
          code={code}
          title={title}
          details={details}
        />
      );
    }
  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl lg:ml-[28vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
       Update {specificProgram.name}
      </h1>
      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4 ">
        <div className="flex flex-col md:flex-row gap-4">      
            <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
            
          
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Zone</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select a zone
              </option>
              {zoneFromDB.map((zone, i) => (
                <option key={i} value={zone._id}>
                  {zone.zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">      
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">ID</label>
            <input
            disabled
              pattern="\d*"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter program id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select a type
              </option>
              <option value='Individual'>Individual</option>
              <option value="Group">Group</option>
              
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Type</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                stage or non-stage
              </option>
              <option value='Stage'>Stage</option>
              <option value="Non-stage">Non-stage</option>
              <option value="Sports">Sports</option>
              
            </select>
          </div>
        </div>

        <button
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
        >
          {updateLoading ? "Updating ..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditProgram;
