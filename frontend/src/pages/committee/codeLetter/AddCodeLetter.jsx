import React, { useState, useEffect } from "react";
import { useGetProgramForCodeLetterQuery, useAddCodeLetterMutation } from "../../../redux/api/programApi";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const AddCodeLetter = () => {
  const [pId, setPId] = useState("");
  const [program, setProgram] = useState("");
  const [codeLetters, setCodeLetters] = useState({});
  const [activeStudents, setActiveStudents] = useState({});

  const { data, isLoading, refetch, error, isError } = useGetProgramForCodeLetterQuery();
  const [addCodeLetter, { isLoading: addLoading }] = useAddCodeLetterMutation();

  const selectedProgram = data ? data.filter((p) => p?.program?.id === pId) : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || "";
  const selectedStudent = selectedProgram.filter((s) => s.student);

  useEffect(() => {
    setProgram(selectedProgramName || "");
    setCodeLetters({});
    setActiveStudents({});
  }, [selectedProgramName]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );

  if (isError) {
    const code = error?.originalStatus || "Error";
    const details =
      error?.data?.message ||
      error?.error ||
      (typeof error?.data === "string" ? error.data : JSON.stringify(error?.data)) ||
      "Something went wrong";
    const title = error?.status || "Error fetching programs";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  // Add this inside your component

const handleGenerateCodeLetters = () => {
  const active = selectedStudent.filter((s) => activeStudents[s.student._id]);
  if (active.length === 0) return;

  // Start scratch effect
  const scrambleDuration = 3000; // 1.5 seconds
  const intervalTime = 100; // change letters every 0.1s

  const tempLetters = {};
  active.forEach((s) => (tempLetters[s.student._id] = "")); // initialize

  let elapsed = 0;
  const scrambleInterval = setInterval(() => {
    active.forEach((s) => {
      const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      tempLetters[s.student._id] = randomChar;
    });
    setCodeLetters({ ...tempLetters });
    elapsed += intervalTime;
    if (elapsed >= scrambleDuration) {
      clearInterval(scrambleInterval);
      // Final letters in alphabetical order
      const shuffled = active
        .map((s) => ({ value: s, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

      const finalLetters = {};
      shuffled.forEach((s, i) => {
        finalLetters[s.student._id] = String.fromCharCode(65 + i); // A, B, C...
      });
      setCodeLetters((prev) => ({ ...prev, ...finalLetters }));
    }
  }, intervalTime);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCodeLetter({ programId: pId, codeLetters }).unwrap();
      toast.success("Code Letter added successfully", { position: "bottom-right", autoClose: 2000 });
      setCodeLetters({});
      setActiveStudents({});
      setPId("");
      setProgram("");
      refetch();
    } catch (error) {
      toast.error(`Error adding code letter: ${error.data?.message || error.message}`, { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div className="mx-auto mt-16 flex flex-col p-6 w-[90vw] max-w-3xl lg:ml-[28vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-6">Add Code Letter</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Program ID & Name */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program ID</label>
            <input
              pattern="\d*"
              type="text"
              value={pId}
              maxLength={4}
              onChange={(e) => setPId(e.target.value)}
              placeholder="Enter program id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program Name</label>
            <input
              readOnly
              type="text"
              value={program}
              placeholder=""
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>

        {!selectedProgramName && pId && pId.length >= 4 && (
          <div className="flex items-center w-full justify-center text-white animate-pulse">
            <p>There is no program with the given ID or code letters are already added.</p>
          </div>
        )}

        {/* Student list */}
        {selectedStudent.length > 0 && (
          <div className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2 w-full rounded-md">
              {selectedStudent.map((s, i) => {
                const studentId = s.student?._id || i;
                const studentName = s.student?.name;
                const studentCode = s.student?.id;
                const codeLetter = codeLetters[studentId] || "";
                const isActive = activeStudents[studentId] || false;

                return (
                  <li
                    key={`${studentId}-${i}`}
                    className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white hover:bg-black flex flex-col md:flex-row md:items-center justify-between transition-all duration-200 gap-2"
                  >
                    <span className="flex-1 truncate">
                      ID: {studentCode} - {studentName}
                    </span>

                    <div className="flex items-center gap-4">
                      {/* Custom Active checkbox with green tick */}
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div
                          className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-colors
                            ${isActive ? "bg-green-500 border-green-500" : "border-gray-600"}`}
                        >
                          {isActive && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) =>
                            setActiveStudents((prev) => ({
                              ...prev,
                              [studentId]: e.target.checked,
                            }))
                          }
                          className="hidden"
                        />
                        <span className="text-white">Active</span>
                      </label>

                      {/* Code letter input */}
                      <input
                        type="text"
                        value={codeLetter}
                        placeholder="---"
                        readOnly
                        maxLength={1}
                        className="border border-gray-600 p-2 w-12 text-center text-lg uppercase bg-black text-white rounded-md"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={handleGenerateCodeLetters}
              className="w-full md:w-1/2 mx-auto mt-2 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-300"
            >
              Generate Code Letters for Active Students
            </button>
          </div>
        )}

        {program && (
          <button
            className="w-full mt-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
            type="submit"
          >
            {addLoading ? "Updating..." : "Update"}
          </button>
        )}
      </form>
    </div>
  );
};

export default AddCodeLetter;
