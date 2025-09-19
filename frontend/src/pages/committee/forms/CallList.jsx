import React, { useEffect, useState } from "react";
import { useGetStudentByProgramQuery } from "../../../redux/api/programApi";
import printJS from "print-js";
import { Loader } from "../../../components/Loader";

const CallList = () => {
  const [pId, setPId] = useState("");
  const [program, setProgram] = useState("");

  const { data, isLoading, isError } = useGetStudentByProgramQuery();

  const selectedProgram = data ? data.filter((d) => d.program.id === pId) : [];
  const selectedStudents = selectedProgram.length > 0 ? selectedProgram : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || null;
  const selectedProgramId = selectedProgram[0]?.program?.id || "";
  const selectedProgramType = selectedProgram[0]?.program?.type || "";
  const selectedProgramZone = selectedProgram[0]?.program?.zone.zone || "";

  useEffect(() => {
    setProgram(selectedProgramName);
  }, [selectedProgramName]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  if (isError) return <h1>Error loading data.</h1>;

const handlePrint = () => {
  printJS({
    printable: "printable",
    type: "html",
    scanStyles: false,
    honorMarginPadding: true,
    header: `
      <div style="display: flex; flex-direction: column; margin-bottom: 12px;">
        <!-- Title -->
        <h1 style="text-align: center; font-weight: 700; font-size: 22px; margin: 0; text-transform: uppercase;">
          Call List
        </h1>
        <hr style="margin: 8px 0 12px 0; border: 1px solid #000;" />

        <!-- Program Info Row -->
        <div style="
          display: flex; 
          flex-direction: row; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 14px; 
          font-weight: 600;">
          
          <span style="padding-left: 3px;">Id: ${selectedProgramId}</span>
          <span>Program: ${selectedProgramName.replace(/^./, (c) => c.toUpperCase())}</span>
          <span>Type: ${selectedProgramType}</span>
          <span style="padding-right: 3px;">Zone: ${selectedProgramZone}</span>
        </div>
      </div>
    `,
    style: `
      @page { size: auto; margin: 15mm; }
      body { font-family: Arial, sans-serif; color: black; }
      #printable-area { color: black; }

      table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #000;
        padding: 12px;
        text-align: center;
        font-size: 14px;
      }
      thead {
        background-color: #f0f0f0;
      }
    `,
  });
};

  return (
    <div className=" mt-[10dvh] lg:mt-[6rem] mb-[3dvh] lg:mb-0 flex flex-col mx-auto p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h2 className="text-white text-center text-xl font-semibold">
        Call List
      </h2>
      <form className="flex mt-4 flex-col space-y-4">
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
              className="w-full p-2 rounded-lg bg-[var(--color-primary)] text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program Name</label>
            <input
              readOnly
              value={program}
              placeholder="Program name"
              className="w-full p-2 rounded-lg bg-[var(--color-primary)] text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>
      </form>
      <div id="printable" className="mt-4 overflow-x-auto scrollbar-hide">
        <table className="table-auto w-full text-white border-collapse">
          {selectedProgramName && (
            <thead>
              <tr>
                <th className="border px-4 py-2 text-center">No</th>
                <th className="border px-4 py-2 text-center">Student Id</th>
                <th className="border px-4 py-2 text-center">Name</th>
                <th className="border px-4 py-2 text-center">Team</th>
                <th className="border px-4 py-2 text-center">Code Letter</th>
                <th className="border px-4 py-2 text-center">Sign</th>
              </tr>
            </thead>
          )}
          <tbody>
            {selectedProgramName ? (
              selectedStudents.map((s, i) => (
                <tr key={s.student?._id || i}>
                  <td className="border px-2 py-2 text-center">{i + 1}</td>
                  <td className="border p-4 text-center">{s.student.id}</td>
                  <td className="border p-4 text-center">{s.student.name}</td>
                  <td className="border p-4 text-center">
                    {s.student.team.teamName}
                  </td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                </tr>
              ))
            ) : pId.length >= 4 ? (
              <h1 colSpan="6" className="px-4 py-2 text-center">
                No program found
              </h1>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-row justify-center w-full mt-4 space-x-2">
        {selectedProgramName && (
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handlePrint}
          >
            Print
          </button>
        )}
      </div>
    </div>
  );
};

export default CallList;
