import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useGetProgramToDeclareQuery } from "../../../redux/api/programApi";
import { useResultDeclarationsMutation } from "../../../redux/api/programApi";

import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
import UseIsMobile from "../../../components/UseIsMobile";

const DeclareResult = () => {
  const [filterText, setFilterText] = useState("");
  const [newDeclared, { isLoading: declareLoading }] =
    useResultDeclarationsMutation();
  const { data, isLoading, refetch , isError , error } = useGetProgramToDeclareQuery();
  const isMobile = UseIsMobile();

  const handleClick = async (id) => {
    try {
      await newDeclared({ isDeclaredID: id }).unwrap();
      toast.success("Result declared successfully", {
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error(`${error?.data?.message || error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }
  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching programs";
    return (
      <ErrorMessage code={code} title={title} details={details} />
    );
  }

  const columns = [
    {
      name: "Id",
      selector: (row) => row.programId,
      sortable: true,
      width: isMobile ? "80px" : "12%",

    },
    {
      name: "Program Name",
      selector: (row) => row.programName,
      sortable: true,
      width: isMobile ? "200px" : "25%",

    },
    {
      name: "Zone",
      selector: (row) => row.programZone,
      sortable: true,
      width: isMobile ? "120px" : "17%",
    },
    {
      name: "Type",
      selector: (row) => row.programType,
      sortable: true,
      width: isMobile ? "120px" : "17%",
    },
    {
      name: "Stage",
      selector: (row) => row.programStage,
      sortable: true,
      width: isMobile ? "120px" : "15%",
    },
    {
      name: "Declare",
      cell: (row) => {
        return (
          <button onClick={() => handleClick(row.program_Id)}>
            <MdVerified
              className={` "text-blue-500" : "text-white" text-2xl absolute"  ${isMobile ? "right-5 top-3" : "right-15 top-3"}`}
            />
          </button>
        );
      },
      width: "15%",
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
        paddingRight: "20px",
      },
    },
    rows: {
      style: {
        backgroundColor: "var(--color-primary)",
        color: "#FFFFFF",
        fontSize: "14px",
        borderBottom: "1px solid #475569",
        "&:nth-of-type(odd)": {
          backgroundColor: "#000",
        },
        paddingRight: "20px",
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

  const finalData = data.filter((d) =>
    [
      d.programId || "",
      d.programName || "",
      d.programZone || "",
      d.programType || "",
    ].some((item) =>
      String(item).toLowerCase().includes(filterText.toLowerCase())
    )
  );
  return (
    <div className="flex flex-col items-center mt-[16vh] h-[90vh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl ">
            Program List
          </h1>
        </div>

        <div className="flex gap-2 items-center">
          <input
            placeholder="Filter Program"
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            value={filterText}
            className="p-2 rounded-md w-[90vw] mr-4 md:mr-0 md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
          />
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black ">
        <DataTable
          columns={columns}
          data={finalData}
          pagination
          subHeaderAlign="right"
          responsive
          disabled={declareLoading}
          customStyles={customStyles}
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Result Found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default DeclareResult;
