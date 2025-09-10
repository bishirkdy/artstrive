import React, { useEffect, useState } from "react";
import { useGetAllProgramQuery } from "../../redux/api/programApi";
import DataTable from "react-data-table-component";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { useDeleteProgramMutation } from "../../redux/api/programApi";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import printJS from "print-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile"
const ProgramList = () => {
  const [filterText, setFilterText] = useState("");
  const {
    data: programData,
    isLoading: programIsLoading,
    error,
    isError : programIsError,
    refetch,
  } = useGetAllProgramQuery();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user.user.isAdmin;

  useEffect(() => {
    refetch();
  }, [refetch]);


  const isMobile = UseIsMobile();

  const [deletePrograms] = useDeleteProgramMutation();
  const deleteProgram = async (deletableId) => {
    try {
      await deletePrograms({ _id: deletableId }).unwrap();
      toast.success("Program deleted successfully", {
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error("Error deleting program", error?.data?.message || error?.message || "Something went wrong");
    }
  };
  const columns = [
    {
      name: "No",
      selector: (row, i) => i + 1,
      width: isMobile ? "60px" : "10%",
    },
    {
      name: "ID",
      selector: (row) => row.id,
      width: isMobile ? "80px" : "10%",
      sortable: true,
    },
    {
      name: "Program",
      selector: (row) => row.name,
      width: isMobile ? (isAdmin ? "160px" : "160px") : isAdmin ? "22%" : "30%",
      sortable: true,
    },
    {
      name: "Zone",
      selector: (row) => row.zone.zone,
      width: isMobile ? (isAdmin ? "120px" : "140px") : isAdmin ? "15%" : "18%",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      width: isMobile ? "120px" : "15%",
      sortable: true,
    },
    {
      name: "Stage",
      selector: (row) => row.stage,
      width: isMobile ? "120px" : "15%",
      sortable: true,
    },
  ];
  if (isAdmin) {
    columns.push(
      {
        name: "",
        cell: (row) => (
          <Link to={`/committee/editprogram/${row._id}`}>
            <button className="px-3 py-1 text-black font-bold rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] transition duration-300">
              <FaRegEdit />
            </button>
          </Link>
        ),
        width: "5%",
      },
      {
        name: "",
        cell: (row) => (
          <button
            onClick={() => deleteProgram(row._id)}
            className="px-3 py-1 text-white font-bold rounded-md bg-red-600 hover:bg-red-700 transition duration-300"
          >
            <MdOutlineDeleteForever />
          </button>
        ),
        width: "5%",
      }
    );
  }
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
  if (programIsLoading )
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  if (programIsError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const filterProgram =
    programData && Array.isArray(programData)
      ? programData.filter((p) =>
          [p.name || "", p.id || "", p.type || "", p.zone.zone || "" ,  p.stage || ""].some(
            (v) => v.toLowerCase().includes(filterText.toLowerCase())
          )
        )
      : [];

  function html() {
    const tableRows = filterProgram
      .map(
        (program, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${program.id}</td>
            <td>${program.name}</td>
            <td>${program.zone.zone}</td>
            <td>${program.type}</td>
            <td>${program.stage}</td>
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
                <th>ID</th>
                <th>Program</th>
                <th>Zone</th>
                <th>Type</th>
                <th>Stage or Non-stage</th>
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
  const handleDownload = async () => {
    try {
      const loadingToast = toast.loading("Downloading Pdf");
      const pdf = new jsPDF("p", "mm", "a4");
      const rowPerPage = 25;

      const programChunk = [];
      for (let i = 0; i < filterProgram.length; i += rowPerPage) {
        programChunk.push(filterProgram.slice(i, i + rowPerPage));
      }

      for (let pageIndex = 0; pageIndex < programChunk.length; pageIndex++) {
        const program = programChunk[pageIndex];

        if (pageIndex > 0) {
          pdf.addPage();
        }

        const downloadContainer = document.createElement("div");
        downloadContainer.style.position = "absolute";
        downloadContainer.style.left = "-10000px";
        downloadContainer.style.width = "350mm";
        downloadContainer.style.margin = "10mm";
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
          title.textContent = "Program List";

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

        ["No", "ID", "Program", "Zone", "Type", "Stage or Non-stage"].forEach(
          (text) => {
            const th = document.createElement("th");
            th.style.border = "1px solid #000";
            th.style.padding = "6pt";
            th.style.fontWeight = "bold";
            th.style.textAlign = "center";
            th.style.paddingBottom = "5mm";
            th.textContent = text;
            headerRow.appendChild(th);
          }
        );

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        program.forEach((program, index) => {
          const row = document.createElement("tr");
          row.style.backgroundColor = index % 2 === 0 ? "#fff" : "#f9f9f9";
          const indexNo = pageIndex * rowPerPage + index + 1;

          [
            indexNo,
            program.id,
            program.name,
            program.zone.zone,
            program.type,
            program.stage,
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
          allowTaint: false,
          logging: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);

        document.body.removeChild(downloadContainer);
      }
      pdf.save("program_List.pdf");
      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.dismiss(loadingToast);
      toast.error(`PDF generation failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center mt-[10dvh] h-[90dvh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl ">
            Program List
          </h1>
        </div>

        <div className="flex gap-2 items-center flex-wrap justify-center">
          <input
            placeholder="Filter Program"
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            value={filterText}
            className="p-2 rounded-md w-[90vw] md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
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

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black ">
        <DataTable
          columns={columns}
          data={filterProgram}
          pagination
          subHeaderAlign="right"
          responsive
          customStyles={customStyles}
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Program Found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default ProgramList;
