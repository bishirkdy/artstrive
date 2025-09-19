import React, { useEffect, useState } from "react";
import {
  useGetStudentByProgramQuery,
  useAddScoreOfProgramMutation,
} from "../../../redux/api/programApi";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const AddScore = () => {
  const [pId, setPId] = useState("");
  const [pName, setPName] = useState("");
  const [pZone, setPZone] = useState("");
  const [mark, setMark] = useState({});

  const [markEntry, { isLoading: markLoading }] =
    useAddScoreOfProgramMutation();
  const { data, isLoading, refetch, error, isError } =
    useGetStudentByProgramQuery();

  const selectedProgram = data?.filter((p) => p.program.id === pId) || [];
  const programInfo = selectedProgram?.[0]?.program || {};
  const programId = programInfo?._id || "";

  useEffect(() => {
    if (programInfo) {
      setPName(programInfo.name || "");
      setPZone(programInfo.zone?.zone || "");
    }
  }, [programInfo]);

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

  // --------- CONDITIONAL STATES ----------
  const noProgramFound = pId.length >= 4 && selectedProgram.length === 0;
  const alreadyDeclared = programInfo?.declare === true;
  const alreadyScored =
    selectedProgram.length > 0 &&
    selectedProgram.some((sp) => sp.score);

  // Only students with codeLetter
  const studentsWithCode = selectedProgram.filter((sp) => sp.codeLetter);

  const canSubmit =
    pName &&
    studentsWithCode.length > 0 &&
    !alreadyScored &&
    Object.keys(mark).length > 0;

  return (
    <div className="mx-auto  mt-[6rem] flex flex-col p-6 w-[90vw] lg:ml-[28vw] md:max-w-2xl bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add Score
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
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
              placeholder="Enter program id"
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
            {noProgramFound ? (
              <h1 className="text-center text-white/70 py-6">
                No program found
              </h1>
            ) : alreadyDeclared ? (
              <h1 className="text-center text-white/70 py-6">
                Program already declared
              </h1>
            ) : alreadyScored ? (
              <div className="text-center py-6 text-white/70">
                Score Assigned
              </div>
            ) : studentsWithCode.length === 0 ? (
              <div className="text-center py-6 text-white/70">
                No students with code letters
              </div>
            ) : (
              studentsWithCode.map((sp, i) => {
                const studentId = sp.student?._id || i;
                return (
                  <li
                    key={studentId}
                    className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white flex justify-between items-center transition-all duration-200"
                  >
                    <span className="flex-1 truncate">{sp.codeLetter}</span>
                    {!sp.score && (
                      <input
                        type="text"
                        pattern="\d*"
                        placeholder="Out of 100"
                        value={mark[studentId] || ""}
                        onChange={(e) =>
                          handleChange(studentId, e.target.value)
                        }
                        maxLength={3}
                        className="border border-gray-600 p-2 w-36 text-center text-lg bg-black text-white 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded-md transition-all duration-300"
                      />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {canSubmit && (
          <button
            disabled={markLoading}
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

export default AddScore;
