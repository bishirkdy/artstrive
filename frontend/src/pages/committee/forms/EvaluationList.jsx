import React, { useEffect, useState } from "react";
import { useGetStudentByProgramQuery } from "../../../redux/api/programApi";
import printJS from "print-js";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import { printHeader } from "../../../components/PrintHeader";

const EvaluationSheet = () => {
  const [pId, setPId] = useState("");
  const [program, setProgram] = useState("");

  const { data, isLoading, isError } = useGetStudentByProgramQuery();

  const selectedProgram = data ? data.filter((d) => d.program.id === pId) : [];
  const selectedStudents = selectedProgram.length > 0 ? selectedProgram : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || "";
  const selectedProgramId = selectedProgram[0]?.program?.id || "";
  const selectedProgramZone = selectedProgram[0]?.program?.zone.zone || "";
    const selectedProgramType = selectedProgram[0]?.program?.type || "";


  useEffect(() => {
    setProgram(selectedProgramName);
  }, [selectedProgramName]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  if (isError) return toast.error("A Error occurred while loading , try again ");

 const handlePrint = () => {
  printJS({
    printable: "printable",
    type: "html",
    scanStyles: false,
    honorMarginPadding: true,
    header: `
      <div class="print-header">
        <p style="font-style: italic; font-size: 14px; margin: 0; text-align: center;">Kindle the soul</p>
        <h1 style="margin: 2px 0; font-size: 26px; font-weight: 700; text-align: center;">ART STRIVE 2025</h1>

        <h2 style="text-align: center; font-weight: semi-bold; font-size: 16px; margin: 20px 0;">Evaluation Sheet</h2>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 600;">
            <h3 style="margin: 0; padding-left: 3px;">Id: ${selectedProgramId}</h3>
            <h3 style="margin: 0;">Program: ${selectedProgramName}</h3>
            <h3 style="margin: 0;">Type: ${selectedProgramType}</h3>
            <h3 style="margin: 0; padding-right: 3px;">Zone: ${selectedProgramZone}</h3>
        </div>
      </div>
    `,
    style: `
      @page { size: auto; margin: 15mm; }
      body { font-family: Arial, sans-serif; color: black; }
      #printable-area { color: black; }

      .print-header {
        text-align: center;
        margin-bottom: 15px;
      }

      table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #000;
        padding: 5px;
        text-align: center;
        font-size: 14px;
      }
      thead {
        background-color: #f0f0f0;
      }
    `,
  });
};


  const studentsWithCodeLetter = selectedStudents.filter((s) => s.codeLetter);

  return (
    <div className=" mt-[10dvh] lg:mt-[6rem] mb-[2dvh] lg:mb-0 flex flex-col mx-auto p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg overflow-hidden shadow-lg">
      <h2 className="text-white text-center text-xl font-semibold">
        Evaluation List
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

      {!studentsWithCodeLetter.length && program ? (
        <div className="text-center py-6 animate-pulse text-white/70">
          Not assigned code letter <br /> Please assign code letter
        </div>
      ) : (
        <div id="printable" className="mt-4 overflow-x-auto scrollbar-hide">
          <table className="table-auto w-full text-white border-collapse">
            {studentsWithCodeLetter.length > 0 && (
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-center">Code Letter</th>
                  <th className="border px-4 py-2 text-center"></th>
                  <th className="border px-4 py-2 text-center"></th>
                  <th className="border px-4 py-2 text-center"></th>
                  <th className="border px-4 py-2 text-center"></th>
                  <th className="border px-4 py-2 text-center"></th>
                  <th className="border px-4 py-2 text-center">Out of 100</th>
                </tr>
              </thead>
            )}

            <tbody>
              {studentsWithCodeLetter.map((s, i) => (
                <tr key={s.student?._id || i}>
                  <td className="border px-4 py-2 text-center">
                    {s.codeLetter}
                  </td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                  <td className="border p-4 text-center"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {studentsWithCodeLetter.length > 0 && (
        <div className="flex flex-row justify-center w-full mt-4 space-x-2">
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
};

export default EvaluationSheet;
