import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useGetProgramStudentWiseQuery } from "../../redux/api/programApi";
import { useSelector } from "react-redux";
import printJS from "print-js";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile";
import { printHeader } from "../../components/PrintHeader";
const StudentWise = () => {
  const [filteredData, setFilteredData] = useState("");
  const { data, isLoading, isError ,  error } = useGetProgramStudentWiseQuery();
  const { user } = useSelector((state) => state.auth);
  const isMobile = UseIsMobile();
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
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
      d.program.zone.zone || "",
      d.program.type || "",
      d.student.name || "",
      d.student.id || " ",
      d.student.team.teamName || "",
      d.student.zone.zone || "",
    ].some((value) => value.toLowerCase().includes(filteredData.toLowerCase()))
  );
const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      width: isMobile ? "50px" : "7%",
      wrap: true,
    },
    {
      name: "Id",
      selector: (row) => row.student.id,
      width: isMobile ? "70px" : "8%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.student.name.charAt(0).toUpperCase() + row.student.name.slice(1),
      width: isMobile ? "150px" : "13%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Team",
      selector: (row) => row.student.team.teamName.charAt(0).toUpperCase() + row.student.team.teamName.slice(1),
      width: isMobile ? "120px" : "13%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Zone",
      selector: (row) => row.student.zone.zone,
      width: isMobile ? "120px" : "13%",
      sortable: true,
      wrap: true,
    },
    {
      name: "P Id",
      selector: (row) => row.program.id,
      width: isMobile ? "70px" : "8%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Program",
      selector: (row) => row.program.name.charAt(0).toUpperCase() + row.program.name.slice(1),
      width: isMobile ? "200px" : "13%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Zone",
      selector: (row) => row.program.zone.zone,
      width: isMobile ? "120px" : "13%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Type",
      selector: (row) => row.program.type,
      width: isMobile ? "100px" : "10%",
      sortable: true,
      wrap: true,
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
                <td>${program.student.id}</td>
                <td>${program.student.name.charAt(0).toUpperCase() + program.student.name.slice(1)}</td>
                <td>${program.student.team.teamName.charAt(0).toUpperCase() + program.student.team.teamName.slice(1)}</td>
                <td>${program.student.zone.zone}</td>
                <td>${program.program.id}</td>
                <td>${program.program.name.charAt(0).toUpperCase() + program.program.name.slice(1)}</td>
                <td>${program.program.zone.zone}</td>
                <td>${program.program.type}</td>
              </tr>
            `
      )
      .join("");

    const html = `
              <div class="print-header">
                ${printHeader}
                <h2>Program List By Student</h2>
                <p class="date">Generated on ${new Date().toLocaleDateString()}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Student Id</th>
                    <th>Student Name</th>
                    <th>Student Team</th>
                    <th>Student Zone</th>
                    <th>Program ID</th>
                    <th>Program Name</th>
                    <th>Program Zone</th>
                    <th>Program Type</th>
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
  margin-bottom: 20px;
}

.print-header p,
.print-header h1,
.print-header h2 {
  margin: 2px 0;
  line-height: 1.2;
}

.print-header h1 {
  font-size: 36px;
  font-weight: bold;
  text-transform: uppercase;
                                                
}

.print-header p {
  font-size: 14px;
  color: #444;
}
.italic {
  font-style: italic;
}
.print-header h2 {
  font-size: 16px;
  margin-top: 12px;
  font-weight: semi-bold;
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
                   .date {
        font-size: 12px;
        text-align: right;
        margin-top: 10px;
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
    <div className="flex flex-col items-center  mt-[10dvh] h-[90dvh] overflow-y-auto lg:ml-[20vw] overflow-x-auto scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl ">
            Program List By Students
          </h1>
        </div>

        <div className="flex gap-2 px-4 md:px-0  items-center justify-center">
          <input
            placeholder="Filter Program"
            onChange={(e) => setFilteredData(e.target.value)}
            type="text"
            value={filteredData}
            className="p-2 rounded-md w-[60vw] md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
          />
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black ">
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          subHeaderAlign="right"
          responsive
          headfixed
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

export default StudentWise;
