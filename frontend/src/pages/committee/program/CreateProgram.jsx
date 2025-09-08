import React, { useState } from "react";
import { useViewZoneQuery } from "../../../redux/api/zoneApi";
import { useAddProgramMutation } from "../../../redux/api/programApi";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const CreateProgram = () => {
  const [id, setId] = useState("");
  const [zone, setZone] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [stage , setStage] = useState("");

  const [addProgram, { isLoading: addProgramLoading }] =
    useAddProgramMutation();
  const {
    data,
    isLoading: zoneIsLoading,
    isError: zoneIsError,
    error 
  } = useViewZoneQuery();
  const zoneFromDB = Array.isArray(data) ? data : [];

  if (zoneIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (zoneIsError) {
      const code = error?.originalStatus || "Error";
      const details = error?.error || error?.data || "Something went wrong";
      const title = error?.status ||  "Error fetching zones";
      return (
        <ErrorMessage
          code={code}
          title={title}
          details={details}
        />
      );
    }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProgram({ id, zone, name, type , stage }).unwrap();
      toast.success("Program added successfully", { position: "bottom-right" });
      setName("");
      setZone("");
      setType("");
      setId("");
      setStage("");
    } catch (error) {
      toast.error(
        `${error.data?.message || error.message ||  "Failed to add program"}`,
      );
    }
  };
  return (
    <div className="mx-auto lg:ml-[28vw] mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Create Program
      </h1>

      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4 ">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter program name"
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
              <option value="" disabled hidden>
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

        <div className="flex items-center flex-col lg:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">ID</label>
            <input
              pattern="\d*"
              type="text"
              value={id}
              maxLength={4}
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
              <option value="Individual">Individual</option>
              <option value="Group">Group</option>
            </select>
          </div>
           <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Stage or non-stage
              </option>
              <option value="Stage">Stage</option>
              <option value="Non-stage">Non-stage</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <button
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
        >
          {addProgramLoading ? `Adding ${name}` : "Add Program"}
        </button>
      </form>
    </div>
  );
};

export default CreateProgram;
