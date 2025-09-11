import React, { useEffect, useState } from "react";
import {
  useAllStudentQuery,
  useDeleteStudentMutation,
} from "../../redux/api/studentApi";
import DataTable from "react-data-table-component";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import printJS from "print-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile";
import { printHeader } from "../../components/PrintHeader";
import { useStudentAddingDeadlineQuery } from "../../redux/api/customApi";
const ViewStudent = () => {
  const [filterText, setFilterText] = useState("");
  const [deleteId] = useDeleteStudentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: studentsData,
    isLoading: studentIsLoading,
    isError: studentIsError,
    error: studentError,
    refetch,
  } = useAllStudentQuery();
  const { data, isLoading, isError, error } = useStudentAddingDeadlineQuery();

  const user = useSelector((state) => state.auth.user);
  const isAdmin = user.user.isAdmin;
  const teamFromStore = user.user.teamName;
  const teams = user.user.isAdmin === false;

  const currentDate = new Date();
  const deadlineDate = new Date(data?.data?.deadline);

  const finaldeadline = teams && deadlineDate < currentDate;

  const navigate = useNavigate();
  const isMobile = UseIsMobile();
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (studentIsLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  if (studentIsError || isError) {
    const code =
      studentError?.originalStatus || error?.originalStatus || "Error";
    const details =
      studentError?.error ||
      studentError?.data ||
      error?.error ||
      error?.data ||
      "Something went wrong";
    const title =
      studentError?.status || error?.status || "Error fetching student";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const students = isAdmin
    ? Array.isArray(studentsData)
      ? studentsData
      : []
    : studentsData.filter((s) => s.team.teamName === teamFromStore);

  const handleDeleteStudent = async (id) => {
    setIsSubmitting(true);
    try {
      await deleteId({ _id: id }).unwrap();
      toast.success("Student deleted successfully", {
        autoClose: 3000,
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error(
        error?.error?.message ||
          error?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleShowMore = (_id) => {
    navigate(`/student/${_id}`);
  };

  const handlePrint = () => {
    const tableRows = filteredStudents
      .map(
        (student, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${student.id}</td>
        <td>${student.name.charAt(0).toUpperCase() + student.name.slice(1)}</td>
        <td>${
          student.team?.teamName.charAt(0).toUpperCase() +
          student.team?.teamName.slice(1)
        }</td>
        <td>${student.zone?.zone}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <div class="print-header">
        ${printHeader}
        <h2>Student List</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>ID</th>
            <th>Name</th>
            <th>Team</th>
            <th>Zone</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          <p class="date">Generated on ${new Date().toLocaleDateString()}</p>

        </tbody>
      </table>
    `;

    printJS({
      printable: html,
      type: "raw-html",
      scanStyles: false,
      style: `
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

      tr:nth-child(even) {
        background-color: #f9f9f9;
      }

      tr:nth-child(odd) {
        background-color: #fff;
      }

      .date {
        font-size: 12px;
        text-align: right;
        margin-top: 10px;
      }
    `,
    });
  };

  const handleDownload = async () => {
    try {
      const loadingToast = toast.loading("Downloading PDF...");

      const pdf = new jsPDF("p", "mm", "a4");
      const rowsPerPage = 25;

      const studentChunks = [];
      for (let i = 0; i < filteredStudents.length; i += rowsPerPage) {
        studentChunks.push(filteredStudents.slice(i, i + rowsPerPage));
      }

      for (let pageIndex = 0; pageIndex < studentChunks.length; pageIndex++) {
        const chunk = studentChunks[pageIndex];

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const downloadContainer = document.createElement("div");
        downloadContainer.style.position = "absolute";
        downloadContainer.style.left = "-10000px";
        downloadContainer.style.width = "350mm";
        downloadContainer.style.backgroundColor = "white";
        downloadContainer.style.color = "black";
        downloadContainer.style.fontFamily = "Arial, sans-serif";
        document.body.appendChild(downloadContainer);

        if (pageIndex === 0) {
          const header = document.createElement("div");
          header.style.textAlign = "center";
          header.style.marginBottom = "15mm";

          const title = document.createElement("h1");
          title.style.fontSize = "30pt";
          title.style.marginBottom = "2mm";
          title.style.fontWeight = "bold";
          title.textContent = "Student List";

          const date = document.createElement("p");
          date.style.fontSize = "16pt";
          date.textContent = `Generated on ${new Date().toLocaleDateString()}`;

          header.appendChild(title);
          header.appendChild(date);
          downloadContainer.appendChild(header);
        }

        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.marginTop = pageIndex === 0 ? "2mm" : "0";
        table.style.fontSize = "20px";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        headerRow.style.backgroundColor = "#f0f0f0";

        ["No", "ID", "Name", "Team", "Zone"].forEach((text) => {
          const th = document.createElement("th");
          th.style.border = "1px solid #000";
          th.style.padding = "6pt";
          th.style.fontWeight = "bold";
          th.style.textAlign = "center";
          th.style.paddingBottom = "5mm";
          th.textContent = text;
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        chunk.forEach((student, index) => {
          const row = document.createElement("tr");
          row.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f9f9f9";
          const globalIndex = pageIndex * rowsPerPage + index + 1;

          [
            globalIndex,
            student.id,
            student.name,
            student.team?.teamName || "-",
            student.zone?.zone || "-",
          ].forEach((text) => {
            const td = document.createElement("td");
            td.style.border = "1px solid #000";
            td.style.padding = "6pt";
            td.style.textAlign = "center";
            td.style.paddingBottom = "5mm";
            td.textContent = text;
            row.appendChild(td);
          });

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        downloadContainer.appendChild(table);

        const canvas = await html2canvas(downloadContainer, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#FFFFFF",
          logging: true,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);

        document.body.removeChild(downloadContainer);
      }

      pdf.save("student_list.pdf");
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss(loadingToast);
      toast.error(`PDF generation failed: ${error.message}`);
    }
  };

  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      width: isMobile ? "60px" : "10%",
      wrap: true,
    },
    {
      name: "ID",
      selector: (row) => row.id,
      width: isMobile ? "100px" : "15%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Name",
      selector: (row) => row.name.charAt(0).toUpperCase() + row.name.slice(1),
      width: isMobile ? "160px" : "20%",
      wrap: true,
    },
    {
      name: "Team",
      cell: (row) =>
        row.team.teamName.charAt(0).toUpperCase() + row.team?.teamName.slice(1),
      width: isMobile ? "120px" : "20%",
      sortable: true,
      wrap: true,
    },
    {
      name: "Zone",
      selector: (row) => row.zone.zone,
      width: isMobile ? "120px" : "15%",
      sortable: true,
      wrap: true,
    },
    {
      width: isMobile ? "30px" : "5%",
      cell: (row) => (
        <Link to={finaldeadline ? "#" : `/editStudent/${row._id}`}>
          <button
            disabled={finaldeadline}
            onClick={() => {
              if (finaldeadline) toast.warn("Deadline passed to edit student");
            }}
            className={`no-print px-2 lg:px-3 py-1 text-black font-bold rounded-s-lg lg:rounded-md ${
              finaldeadline
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)]"
            } transition duration-300`}
          >
            <FaRegEdit />
          </button>
        </Link>
      ),
    },
    {
      width: isMobile ? "30px" : "5%",
      cell: (row) => (
        <button
          className={`no-print px-2 lg:px-3 py-1 text-white font-bold lg:rounded-md transition duration-300 ${
            finaldeadline
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
          onClick={() => {
            if (finaldeadline) {
              toast.warn("Deadline passed, cannot delete student");
            } else {
              handleDeleteStudent(row._id);
            }
          }}
          disabled={finaldeadline}
        >
          <MdOutlineDeleteForever />
        </button>
      ),
    },
    {
      width: isMobile ? "30px" : "5%",
      cell: (row) => (
        <button
          className="no-print px-2 lg:px-3 py-1 text-white font-bold rounded-e-lg lg:rounded-md bg-blue-600 hover:bg-blue-700 transition duration-300"
          onClick={() => handleShowMore(row._id)}
        >
          <BsArrowRightCircleFill />
        </button>
      ),
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
        paddingRight: "20px",
        whiteSpace: "nowrap",
      },
    },
    rows: {
      style: {
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
        fontSize: "14px",
        borderBottom: "1px solid #475569",
        "&:nth-of-type(odd)": {
          backgroundColor: "#000000",
        },
        paddingRight: "20px",
        whiteSpace: "nowrap",
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

  const filteredStudents = students.filter((s) =>
    [s.id || "", s.name || "", s.team?.teamName || "", s.zone?.zone || ""].some(
      (value) => value.toLowerCase().includes(filterText?.toLowerCase() || "")
    )
  );

  return (
    <div className="flex flex-col items-center mt-[10dvh] h-[90dvh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl">
            View Students
          </h1>
          {isSubmitting && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="text-white text-xl animate-pulse">
                Deleting Student and Program Of Student...
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center justify-center flex-wrap">
          <input
            placeholder="Filter details..."
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            value={filterText}
            className="p-2 rounded-md w-[90vw] md:w-[30vw] lg:w-[20vw] bg-[#000] border border-gray-600 text-white placeholder-gray-400 focus:border-[#13F287] focus:outline-none focus:ring-2 focus:ring-[#13F287] transition-all duration-200"
          />
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handlePrint}
          >
            Print
          </button>
          <button
            className="bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] p-2 px-4 rounded-lg font-semibold text-base"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>

      <div
        id="printable-component"
        className="table-container w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[var(--color-primary)] mt-[2vh] shadow-sm border border-black"
      >
        <DataTable
          columns={columns}
          data={filteredStudents}
          pagination
          subHeaderAlign="right"
          responsive
          customStyles={customStyles}
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Student Found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ViewStudent;
