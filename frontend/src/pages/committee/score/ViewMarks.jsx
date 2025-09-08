import React, { useEffect, useState } from "react";
import { useGetStudentByProgramQuery } from "../../../redux/api/programApi";
import { useViewZoneQuery } from "../../../redux/api/zoneApi";
import { Loader } from "../../../components/Loader";

const viewMarks = () => {
  const [pId, setPId] = useState("");
  const [pName, setPName] = useState("");
  const [pZone, setPZone] = useState("");

  const { data, isLoading } = useGetStudentByProgramQuery();
  const { data: zoneData, isLoading: zoneIsLoading } = useViewZoneQuery();

  const selectedProgram = data?.filter((p) => p.program.id === pId);

  const selectedProgramName = selectedProgram?.[0]?.program?.name || "";
  const selectedProgramZone = selectedProgram?.[0]?.program?.zone || "";
  const markCheck = selectedProgram?.some((sp) => sp.totalScore > 0);

  const filterZone = () => {
    const zones =
      zoneData?.find((z) => z._id === selectedProgramZone._id) || "";
    if (zones) {
      return zones.zone;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (selectedProgram) {
      setPName(selectedProgramName);
      setPZone(filterZone());
    }
  }, [selectedProgram]);

  if (isLoading || zoneIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] lg:ml-[28vw] md:max-w-2xl bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        View Score
      </h1>

      <form className="flex  flex-col space-y-4 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program ID</label>
            <input
              pattern="\d*"
              type="text"
              value={pId}
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
          <ul className="w-full rounded-md border border-gray-700 bg-black/30 overflow-hidden shadow-lg">
            {markCheck === false && pName ? (
              <div className="text-center py-6 text-white/70">
                No marks available for the selected program
              </div>
            ) : selectedProgram.length === 0 && pId.length >= 4 ? (
              <h1 className="text-center text-white/70 py-6">
                No program found
              </h1>
            ) : (
              selectedProgram.map((sp) => (
                <li
                  key={sp.student._id}
                  className={`border-b border-gray-700 px-6 py-4 flex justify-around w-full items-center 
                 transition-all duration-200`}
                >
                  <span className="flex-1 truncate min-w-[120px] text-white">
                    Letter - {sp.codeLetter || "--"}
                  </span>
                  <span className="flex-1 truncate min-w-[120px] text-yellow-400 font-medium">
                    Grade - {sp.grade || "--"}
                  </span>
                  <span className="flex-1 truncate min-w-[120px] font-bold text-green-400">
                    Total - {sp.totalScore || "--"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default viewMarks;
