import React, { useState } from "react";
import { useAddMarkToProgramsMutation } from "../../../redux/api/programApi";
import { toast } from "react-toastify";
import { IoCaretBack } from "react-icons/io5";

const MarkSettings = ({
  settingsToggle,
  programFromDB,
  refetch,
  zoneFromDB,
}) => {
  const [program, setProgram] = useState("");
  const [zone, setZone] = useState("");
  const [mark, setMark] = useState("");

  const [newMark, { isLoading: newMarkLoading }] =
    useAddMarkToProgramsMutation();

  const selectedProgram = zone
    ? programFromDB.filter((p) => p.zone._id === zone)
    : programFromDB;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newMark({ program, zone, mark }).unwrap();
      toast.success("Mark added successfully", { position: "bottom-right" });
      setProgram("");
      setZone("");
      setMark("");
      refetch();
    } catch (error) {
      toast.error(error.message || error.data?.message || "Failed to add mark", {
        position: "bottom-right", autoClose : 3000});
    }
  };

  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)]">
      <div className="p-4 text-white  flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Mark's Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Default Individual Program Mark is 5 and group program mark is 10
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex mt-5 w-[75%]  flex-col space-y-4 "
      >
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
              Select zone
            </option>
            {zoneFromDB.map((zone, i) => (
              <option key={i} value={zone._id}>
                {zone.zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-white font-medium mb-1">Name</label>
          <select
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            defaultValue=""
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] scrollbar-hide focus:outline-none"
          >
            <option value="" hidden disabled>
              Select program
            </option>
            {selectedProgram.map((p, i) => (
              <option key={i} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-white font-medium mb-1">Mark</label>
          <select
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            defaultValue=""
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          >
            <option value="" hidden disabled>
              Update mark
            </option>
            <option value="30">30</option>
            <option value="20">20</option>
            <option value="15">15</option>
            <option value="10">10</option>
            <option value="5">5</option>
          </select>
        </div>

        <button
          className="w-full py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
          disabled={newMarkLoading}
        >
          {newMarkLoading ? `Adding Mark ...` : "Add Mark"}
        </button>
      </form>
    </div>
  );
};

export default MarkSettings;
