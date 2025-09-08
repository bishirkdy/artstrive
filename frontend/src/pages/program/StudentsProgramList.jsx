import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useGetStudentByProgramQuery } from "../../redux/api/programApi";
import { useSelector } from "react-redux";

import printJS from "print-js";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
const StudentsProgramList = () => {
  const { data, isLoading, isError, error } = useGetStudentByProgramQuery();
  const [filteredData, setFilteredData] = useState("");
  const { user } = useSelector((state) => state.auth);
  function useIsMobile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
  }
    const isMobile = useIsMobile();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <Loader />
      </div>
    );



  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  const sameTeam = data.filter(
    (d) => d.student.team.teamName === user.user.teamName
  );

  const checkedData = user.user.isAdmin ? data : sameTeam;
  const filtered = checkedData.filter((d) =>
    [
      d.program.name || "",
      d.program.id || "",
      d.program.type || "",
      d.program.zone.zone || "",
      d.student.name || "",
      d.student.id || " ",
      d.student.team.teamName || "",
    ].some((value) => value.toLowerCase().includes(filteredData.toLowerCase()))
  );


  const columns = [
    {
      name: "",
      selector: (row, i) => i + 1,
      width: isMobile ? "50px" : "7%", 
    },
    {
      name: "Id",
      selector: (row) => row.program.id,
      width: isMobile ? "70px" : "10%",
      sortable: true,
    },
    {
      name: "Program",
      selector: (row) => row.program.name,
      width: isMobile ? "150px" : "20%",
      sortable: true,
    },
    {
      name: "Zone",
      selector: (row) => row.program.zone.zone,
      width: isMobile ? "120px" : "13%",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.program.type,
      width: isMobile ? "100px" : "13%",
      sortable: true,
    },
    {
      name: "Stage",
      selector: (row) => row.program.stage,
      width: isMobile ? "100px" : "12%",
      sortable: true,
    },
    {
      name: "S Id",
      selector: (row) => row.student.id,
      width: isMobile ? "80px" : "10%",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.student.name,
      width: isMobile ? "100px" : "15%",
      sortable: true,
    },
  ];
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "16px",
        borderBottom: "2px solid #475569",
      },
    },
    rows: {
      style: {
        backgroundColor: "black",
        color: "#FFFFFF",
        fontSize: "14px",
        borderBottom: "1px solid #475569",
        "&:nth-of-type(odd)": {
          backgroundColor: "var(--color-primary)",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
        borderTop: "1px solid #475569",
      },
      pageButtonsStyle: {
        color: "#FFFFFF",
        fill: "#FFFFFF",
        "&:hover:not(:disabled)": {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };
  function html() {
    const tableRows = filtered
      .map(
        (program, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${program.program.id}</td>
              <td>${program.program.name}</td>
              <td>${program.program.zone.zone}</td>
              <td>${program.program.type}</td>
              <td>${program.program.stage}</td>
              <td>${program.student.id}</td>
              <td>${program.student.name}</td>
              <td>${program.student.team.teamName}</td>
            </tr>
          `
      )
      .join("");

    const html = `
            <div class="print-header">
              <h1>Program List</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Program ID</th>
                  <th>Program Name</th>
                  <th>Program Zone</th>
                  <th>Program Type</th>
                  <th>Stage or Non-stage</th>
                  <th>Student Id</th>
                  <th>Student Name</th>
                  <th>Student Team</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                font-family: 'Arial', sans-serif;
                color: #000;
                background-color: #fff;
              }
              .print-header {
                text-align: center;
                margin-bottom: 15px;
              }
              .print-header h1 {
                font-size: 20px;
                margin-bottom: 5px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #000;
                padding: 6px;
                text-align: center;
              }
              th {
                background-color: #f0f0f0;
              }
            </style>
          `;

    return html;
  }

  const handlePrint = () => {
    printJS({
      printable: html(),
      type: "raw-html",
      scanStyles: false,
    });
  };
  return (
    <div className="flex flex-col items-center  mt-[10dvh] h-[90dvh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl ">
            View Program Wise
          </h1>
        </div>

        <div className="flex gap-2 px-4 md:px-0 items-center">
          <input
            placeholder="Filter Program"
            onChange={(e) => setFilteredData(e.target.value)}
            type="text"
            value={filteredData}
            className="p-2 rounded-md w-[65vw] md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
          />
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          subHeaderAlign="right"
          responsive
          fixedHeader
          customStyles={customStyles}
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Data Found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default StudentsProgramList;
