import React, { useEffect, useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { toast } from "react-toastify";
import ErrorMessage from "../../../components/ErrorMessage";
import { Loader } from "../../../components/Loader";
import { useGetStudentByProgramQuery } from "../../../redux/api/programApi";
import { useAddScoreOfProgramMutation } from "../../../redux/api/programApi";
const EditScore = ({ settingsToggle }) => {
  const [pId, setPId] = useState("");
  const [pName, setPName] = useState("");
  const [pZone, setPZone] = useState("");
  const [mark, setMark] = useState({});

  const [markEntry, { isLoading: markLoading }] =
    useAddScoreOfProgramMutation();
  const { data, isLoading, refetch, error, isError } =
    useGetStudentByProgramQuery();

  const selectedProgram = data?.filter((p) => p.program.id === pId);
  const selectedProgramName = selectedProgram?.[0]?.program?.name || "";
  const selectedProgramZone = selectedProgram?.[0]?.program?.zone || "";
  const programId = selectedProgram?.[0]?.program._id || "";

  useEffect(() => {
    if (selectedProgram) {
      setPName(selectedProgramName);
      setPZone(selectedProgramZone?.zone);
    }
  }, [selectedProgram]);

  const handleChange = (id, value) => {
    setMark((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markEntry({ programId, mark }).unwrap();
      toast.success("Mark added successfully", { position: "bottom-right" });
      setMark({});
      setPId("");
      setPName("");
      setPZone("");
      refetch();
    } catch (error) {
      toast.error(
        `Error occurred while updating the mark: ${
          error?.data?.message || error.message
        }`
      );
    }
  };
  useEffect(() => {
    toast.info("Enter program Id", {
      position: "top-right",
      autoClose: 2000,
    });
  }, []);
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching programs";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] pb-10 overflow-y-auto scrollbar-hide flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)]">
      <div className="p-4 text-white  flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">Score Settings</h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Edit existing Score if necessary update required, Edit full Score of
          program for safe and submit
        </p>
      </div>
        <form onSubmit={handleSubmit} className="flex w-[90%] flex-col space-y-4 ">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program ID</label>
            <input
              pattern="\d*"
              type="text"
              value={pId}
              min={0}
              max={100}
              maxLength={4}
              onChange={(e) => setPId(e.target.value)}
              placeholder="Enter student id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program</label>
            <input
              readOnly
              type="text"
              value={pName}
              placeholder="Program name"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Zone</label>
            <input
              readOnly
              type="text"
              value={pZone}
              placeholder="Program zone"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex flex-col gap-4 w-[90vw] rounded-md">
            {selectedProgram?.length === 0 && pId.length >= 4 ? (
              <h1 className="text-center text-white/70 py-6">
                No program found
              </h1>
            ) : selectedProgram?.length > 0 && selectedProgram[0].program.declare === true ? (
              <h1 className="text-center text-white/70 py-6">
                Program already declared
              </h1>
            ) :
             selectedProgram.some((sp) => !sp.codeLetter) ? (
              <div className="text-center py-6 text-white/70">
                Please assign code letter
              </div>
            ) :
            (
              selectedProgram.map((sp, i) => {
                const studentId = sp.student?._id || i;                
                return (
                  <li
                    key={studentId}
                    className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white flex justify-between items-center transition-all duration-200"
                  >
                    <span className="flex-1 truncate">{sp.codeLetter}</span>
                      <input
                        type="text"
                        pattern="\d*"
                        placeholder="Out of 100"
                        onChange={(e) =>
                          handleChange(studentId, e.target.value)
                        }
                        maxLength={3}
                        className="border border-gray-600 p-2 w-36 text-center text-lg bg-black text-white 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded-md transition-all duration-300"
                      />
                  </li>
                );
              })
            )}
          </ul>
        </div>
        {pName && selectedProgram.length > 0 &&  !selectedProgram[0].program.declare === true  && selectedProgram.every(sp => sp.codeLetter) && (
          <button
            className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
            type="submit"
          >
            {markLoading ? "Updating Mark" : "Update"}
          </button>
         )}
      </form>
    </div>
  );
};

export default EditScore;
