import React, { useState, useEffect } from "react";
import { useGetStudentByProgramQuery } from "../../../redux/api/programApi";
import { Loader } from "../../../components/Loader";

const ViewCodeLetter = () => {
  const [pId, setPId] = useState();
  const [program, setProgram] = useState();
  const { data: programData, isLoading  , refetch} = useGetStudentByProgramQuery();

  const selectedProgram = programData
    ? programData.filter((pd) => pd.program.id === pId)
    : [];

    useEffect(() => {
      refetch();
    },[])
  const selectedStudents = selectedProgram ? selectedProgram : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || "";

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
  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl lg:ml-[28vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        View Code Letter
      </h1>
      <form className="flex  flex-col space-y-4 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program ID</label>
            <input
              pattern="\d*"
              type="text"
              maxLength={4}
              value={pId}
              onChange={(e) => setPId(e.target.value)}
              placeholder="Enter program id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Name</label>
            <input
              readOnly
              value={program}
              placeholder=""
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex flex-col gap-4 w-[90vw] rounded-md">
            
           { !selectedStudents.some(s => s.codeLetter) && program  ? ( 
            <div className="text-center py-6 text-white/70">
            Not assigned code letter
          </div>
           ) : ( selectedStudents.map((s, i) => {
            const studentId = s.student?._id || i;
            const studentName = s.student?.name;
            const studentCode = s.student?.id;
            const codeLetter = s.codeLetter;
            
            return (
                <li
                key={studentId}
                className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white flex justify-between items-center transition-all duration-200"
              >
                <span className="flex-1 truncate">
                  ID: {studentCode} - {studentName}
                </span>
                <input
                  value={codeLetter}
                  readOnly
                  className="border border-gray-600 p-2 w-12 text-center text-lg uppercase bg-black text-white 
          rounded-md transition-all duration-300"
                />
              </li> )
          }))
            }
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ViewCodeLetter;
