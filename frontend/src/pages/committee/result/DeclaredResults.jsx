import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useGetAllProgramQuery } from "../../../redux/api/programApi";
import { useViewZoneQuery } from "../../../redux/api/zoneApi";
import { useResultUnDeclarationsMutation } from "../../../redux/api/programApi";

import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";
import UseIsMobile from "../../../components/UseIsMobile";

const DeclaredResults = () => {
  const [filterText, setFilterText] = useState("");
  const [unDeclarableResults] = useResultUnDeclarationsMutation();
  const {
    data,
    isLoading,
    refetch,
    isError: dataIsError,
    error: dataError,
  } = useGetAllProgramQuery();
  const {
    data: zoneData,
    isLoading: zoneIsLoading,
    isError: zoneIsError,
    error: zoneError,
  } = useViewZoneQuery();
  const isMobile = UseIsMobile();

  const filterZone = (id) => {
    const zones = zoneData?.find((z) => z._id === id);
    if (zones) return zones.zone;
  };

  const handleClick = async (id) => {
    try {
      await unDeclarableResults({ _id: id }).unwrap();
      toast.success("Result undeclared successfully", {
        position: "bottom-right",
      });
      refetch();
    } catch (error) {
      toast.error(`${error?.data?.message || error.message}`);
    }
  };
  if (isLoading || zoneIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }
  const columns = [
    {
      name: "Results",
      selector: (row) => row.declaredOrder,
      sortable: true,
      width: isMobile ? "120px" : "10%",
      wrap: true,
    },
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      width: isMobile ? "120px" : "15%",
      wrap: true,
    },
    {
      name: "Program Name",
      selector: (row) => row.name,
      sortable: true,
      width: isMobile ? "240px" : "25%",
      wrap: true,
    },
    {
      name: "Zone",
      selector: (row) => filterZone(row.zone),
      sortable: true,
      width: isMobile ? "120px" : "13%",
      wrap: true,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      width: isMobile ? "120px" : "12%",
      wrap: true,
    },
     {
      name: "Stage",
      selector: (row) => row.stage,
      sortable: true,
      width: isMobile ? "120px" : "12%",
      wrap: true,
    },
    {
      cell: (row) => {
        return (
          <div className="flex flex-row gap-2 absolute right-5">
            <button>
              <MdVerified className={`text-blue-500 text-2xl`} />
            </button>
            <button onClick={() => handleClick(row._id)}>
              <MdDeleteForever
                className={`text-red-500 hover:text-red-900 text-2xl`}
              />
            </button>
          </div>
        );
      },
      width: isMobile ? "80px" : "13%",
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

  if (dataIsError || zoneIsError) {
    const code =
      dataError?.originalStatus || zoneError?.originalStatus || "Error";
    const details =
      dataError?.error ||
      dataError?.data ||
      zoneError?.error ||
      zoneError?.data ||
      "Something went wrong";
    const title =
      dataError?.status || zoneError?.status || "Error fetching programs";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  const dataWithFalseDeclarations =
    data?.filter((d) => d.declare === true) || [];

  const finalData = dataWithFalseDeclarations.filter((d) =>
    [
      d.declaredOrder || "",
      d.id || "",
      d.name || "",
      filterZone(d.zone) || "",
      d.type || "",
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

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] shadow-sm border border-black ">
        <div className="flex text-center mt-2 md:mt-0 mb-2">
          {dataWithFalseDeclarations.length > 0 && (
            <p className="text-blue-300 animate-pulse">
              If you want to undeclare result, enter the delete button
            </p>
          )}
        </div>
        <DataTable
          columns={columns}
          data={finalData}
          pagination
          subHeaderAlign="right"
          responsive
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

export default DeclaredResults;
