import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { useAddGroupLimitsMutation } from "../../../redux/api/customApi";
import { useShowGroupLimitsQuery } from "../../../redux/api/customApi";
import { toast } from "react-toastify";

const GroupLimitSettings = ({ settingsToggle, programFromDB }) => {
  const [programId, setProgramId] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [limit, setLimit] = useState("");
  const [addLimit, { isLoading }] = useAddGroupLimitsMutation();
  const {
    data,
    isLoading: queryLoading,
    error,
    isError,
    refetch,
  } = useShowGroupLimitsQuery();
  if (queryLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Something error</h1>;
  }
  const handleProgramChange = (e) => {
    const enteredId = e.target.value;
    setProgramId(enteredId);

    const program = programFromDB.find((p) => p.id === enteredId);

    if (!program) {
      setSelectedProgram(null);
      return;
    }

    if (program.type === "Individual") {
      toast.error("Limit settings are only for group programs");
      setSelectedProgram(null);
      return;
    }

    setSelectedProgram(program);
  };
  const limitsArray = Array.isArray(data) ? data : data?.data;

  const existing = selectedProgram
    ? limitsArray?.find((d) => d.program?.id === selectedProgram.id) || null
    : null;

  const submitHandler = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!selectedProgram) {
      toast.error("Program not found");
      return;
    }

    try {
      await addLimit({
        programId: selectedProgram._id,
        groupLimit: Number(limit),
      }).unwrap();
      toast.success("Limit settings updated successfully", {
        position: "bottom-right",
      });

      setProgramId("");
      setSelectedProgram(null);
      setLimit("");
      refetch();
    } catch (error) {
      toast.error(
        `Error adding limit settings: ${error?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)] overflow-y-auto">
      {/* Header */}
      <div className="p-4 text-white flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden cursor-pointer"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Limit's Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse text-sm text-gray-300">
          Limit settings are for group programs only. <br />
          Default limit is{" "}
          <span className="text-[var(--color-secondary)] font-semibold">5</span>
          .
        </p>
      </div>

      <form onSubmit={submitHandler} className="space-y-6 w-[90%] max-w-md">
        <div>
          <label className="block text-white text-sm mb-2">Program ID</label>
          <input
            value={programId}
            onChange={handleProgramChange}
            maxLength={4}
            required
            className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none placeholder-gray-400"
            placeholder="Enter Program ID"
          />
        </div>
        {selectedProgram && (
          <>
            <div>
              <label className="block text-white text-sm mb-2">
                Program Zone
              </label>
              <input
                value={selectedProgram?.zone?.zone || ""}
                readOnly
                className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:outline-none"
                placeholder="Zone will appear here"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Program Name
              </label>
              <input
                value={selectedProgram?.name || ""}
                readOnly
                className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:outline-none"
                placeholder="Program name will appear here"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-2">
                Group Program Limit from Team
              </label>
              <input
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                type="number"
                min="1"
                required
                className="w-full p-3 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none placeholder-gray-400"
                placeholder={`${existing?.groupLimit || "Enter limit"}`}
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300 disabled:opacity-50"
              type="submit"
            >
              {isLoading ? "Saving..." : "Save Limits"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default GroupLimitSettings;
