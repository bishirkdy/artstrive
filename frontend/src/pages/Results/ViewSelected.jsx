import React from "react";
import { useViewSelectedResultQuery } from "../../redux/api/programApi";
import { useParams } from "react-router";
import printJS from "print-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { printHeader } from "../../components/PrintHeader";

const ViewSelected = () => {
  const { _id } = useParams();
  const { data, isLoading, error, isError } = useViewSelectedResultQuery(_id);
  const programHeader = data?.find((d) => d.program._id === _id);
  const resultNumber = programHeader?.program.declaredOrder;

  const handlePrint = () => {
    printJS({
      printable: "printable-area",
      type: "html",
      documentTitle: `Result ${resultNumber}`,
      honorMarginPadding: true,
      scanStyles: false,

      header: `${printHeader}`,

      style: `
      @page { size: auto; margin: 5mm; }
      body { font-family: Arial, sans-serif; }
      #printable-area { color: black; }

      /* Header styling */
      .print-header {
        display: block;
        width: 100%;
        text-align: center;
        margin: 0 auto 20px auto;
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
        font-weight: 600;
      }

      /* Table styling */
      h1 {
        text-align: center;
        font-size: 20px;
        margin-bottom: 1rem;
        color: black;
      }
  
      .header-row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        margin: 10px 0;
        padding: 0 10px;
      }
  
      .header-row h5 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        color: black;
      }
  
      table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
      th, td { border: 1px solid #000; padding: 5px; text-align: center; font-size: 13px; }
      thead { background-color: #f0f0f0; }
      .even { background-color: #f9f9f9; }
      .odd { background-color: white; }
    `,
    });
  };

  const handleDownload = () => {
    const element = document.getElementById("printable-area");
    toast.loading(`Downloading result ${resultNumber}`);
    if (!element) return;

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      onclone: (clonedDoc) => {
        const cloneElement = clonedDoc.getElementById("printable-area");

        cloneElement.style.backgroundColor = "white";

        const headerDiv = cloneElement.querySelector(".header-row");
        if (headerDiv) {
          headerDiv.style.display = "flex";
          headerDiv.style.justifyContent = "space-between";
          headerDiv.style.flexWrap = "wrap";
          headerDiv.style.gap = "10px";
          headerDiv.style.margin = "10px 0";
          headerDiv.style.padding = "0 10px";
          headerDiv.style.fontSize = "16px";
        }
        const h5Elements = cloneElement.querySelectorAll("h5");
        h5Elements.forEach((h) => {
          h.style.fontSize = "16px";
          h.style.fontWeight = "500";
          h.style.margin = "0";
        });

        const tableElement = cloneElement.querySelectorAll("td , th");
        tableElement.forEach((el) => {
          el.style.borderColor = "black";
          el.style.borderStyle = "solid";
          el.style.borderWidth = "1px";
          el.style.paddingBottom = "15px";
          el.style.textAlign = "center";
        });

        const allElements = cloneElement.querySelectorAll("*");
        allElements.forEach((el) => {
          el.style.color = "black";
        });
      },
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const margin = 10;
        const imgWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const xPos = margin;
        const yPos = 10;
        pdf.addImage(imgData, "PNG", xPos, yPos, imgWidth, imgHeight);
        toast.dismiss();
        pdf.save(`Result ${resultNumber}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };

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
  return (
    <div className="mt-[6rem] flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg overflow-hidden shadow-lg">
      <div id="printable-area" className="print-container text-white">
        {data ? (
          <>
            <div className="flex flex-row justify-center w-full">
              <h1 className="text-2xl font-medium text-center">
                Result {programHeader.program?.declaredOrder}
              </h1>
            </div>
            <div>
              <div className="header-row flex flex-wrap justify-center md:justify-between w-full text-sm md:text-base mt-4 gap-2 px-4">
                {["id", "name", "type" , "stage"].map((key) => (
                  <h5 key={key}>
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                      programHeader.program?.[key] || ""
                    }`}
                  </h5>
                ))}
                <h5>{`Zone: ${programHeader.program?.zone?.zone || ""}`}</h5>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-2 px-4 py-2">No</th>
                    <th className="border-2 px-4 py-2">Letter</th>
                    <th className="border-2 px-4 py-2">Id</th>
                    <th className="border-2 px-4 py-2">Name</th>
                    <th className="border-2 px-4 py-2">Team</th>
                    <th className="border-2 px-4 py-2">Grade</th>
                    <th className="border-2 px-4 py-2">Score</th>
                    <th className="border-2 px-4 py-2">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr
                      key={i}
                      className={`border px-4 py-2 ${
                        i % 2 === 0 ? "even" : "odd"
                      }`}
                    >
                      <td className="border px-4 py-2">{i + 1}</td>
                      <td className="border px-4 py-2">{d.codeLetter}</td>
                      <td className="border px-4 py-2">{d.student.id}</td>
                      <td className="border px-4 py-2">{d.student.name}</td>
                      <td className="border px-4 py-2">
                        {d.student.team.teamName}
                      </td>
                      <td className="border px-4 py-2">{d.grade}</td>
                      <td className="border px-4 py-2">{d.totalScore}</td>
                      <td className="border px-4 py-2">{d.rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h5 className="text-xl animate-pulse m-auto">No program available</h5>
        )}
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={handlePrint}
          className="text-black  font-semibold text-base bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] px-4 py-2 rounded"
        >
          Print
        </button>
        <button
          onClick={handleDownload}
          className="text-black  font-semibold text-base bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] px-4 py-2 rounded"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default ViewSelected;
