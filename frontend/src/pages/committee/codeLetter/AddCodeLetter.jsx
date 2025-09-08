import React, { useState, useEffect } from "react";
import { useGetProgramForCodeLetterQuery } from "../../../redux/api/programApi";
import { useAddCodeLetterMutation } from "../../../redux/api/programApi";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";

const AddCodeLetter = () => {
  const [pId, setPId] = useState("");
  const [program, setProgram] = useState("");
  const { data, isLoading, refetch } = useGetProgramForCodeLetterQuery();
  const [codeLetters, setCodeLetters] = useState({});

  const [addCodeLetter  , { isLoading : addLoading}] = useAddCodeLetterMutation();
  const selectedProgram = data
    ? data.filter((p) => p?.program?.id === pId)
    : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || "";
  const selectedStudent = selectedProgram.filter((s) => s.student);
// console.log("data",data);
// console.log("selected" , selectedProgram);


  useEffect(() => {
    if (selectedProgramName) {
      setProgram(selectedProgramName);
    } else {
      setProgram("");
    }
  }, [selectedProgramName]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  const handleCodeLetterChange = (id, value) => {
    setCodeLetters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCodeLetter({
        programId: pId,
        codeLetters: codeLetters,
      }).unwrap();
      toast.success("Code Letter added successfully", {
        position: "bottom-right", autoClose: 2000
      });
      setCodeLetters({});
      setPId("");
      setProgram("");
      refetch();
    } catch (error) {
      toast.error(
        `Error adding code letter: ${error.data?.message || error.message}` , {
        position: "top-right", autoClose: 2000}
      );
    }
  };

  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] overflow-auto md:max-w-2xl lg:ml-[28vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add Code Letter
      </h1>

      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4 ">
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
            <label className="text-white font-medium mb-1">Name</label>
            <input
              readOnly
              type="text"
              value={program}
              placeholder=""
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>
        {!selectedProgramName && pId && pId.length >= 4 ? (
          <div className="flex items-center w-full justify-center text-white animate-pulse">
            <p>There is no program with the given id or Code letter is added</p>
          </div>
        ) : (
          <div className="flex items-center">
            <ul className="flex flex-col gap-4 w-[90vw] rounded-md">
              {selectedStudent.map((s, i) => {
                const studentId = s.student?._id || i;
                const studentName = s.student?.name;
                const studentCode = s.student?.id;
                const codeLetter = codeLetters[studentId] || "";

                return (
                  <li
                    key={`${studentId}-${i}`}
                    className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white hover:bg-black flex justify-between items-center transition-all duration-200"
                  >
                    <span className="flex-1 truncate">
                      ID: {studentCode} - {studentName}
                    </span>
                    <input
                      type="text"
                      value={codeLetter}
                      placeholder="---"
                      onChange={(e) =>
                        handleCodeLetterChange(
                          studentId,
                          e.target.value.toUpperCase()
                        )
                      }
                      maxLength={1}
                      className="border border-gray-600 p-2 w-12 text-center text-lg uppercase bg-black text-white 
            focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded-md transition-all duration-300"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {program && (
          <button
            className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
            type="submit"
          >
            {addLoading ? " Updating ..." : "Update"}
          </button>
        )}
      </form>
    </div>
  );
};

export default AddCodeLetter;
