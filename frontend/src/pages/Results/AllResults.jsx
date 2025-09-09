import React, { useState } from "react";
import { useDeclaredProgramsQuery } from "../../redux/api/programApi";
import DataTable from "react-data-table-component";
import { Link } from "react-router";
import { FaChevronCircleRight } from "react-icons/fa";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile";
const AllResults = () => {
  const [filterText, setFilterText] = useState();
  const { data, isLoading , isError , error } = useDeclaredProgramsQuery();
  const isMobile = UseIsMobile();

  const columns = [
    {
      name: "No",
      selector: (row) => row.declaredOrder,
      width: isMobile ? "120px" : "13%",
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "ID",
      selector: (row) => row.id,
      width: isMobile ? "120px" :  "13%",
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: isMobile ? "240px" :  "24%",
      sortable: true,
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "Type",
      cell: (row) => row.type,
      width:isMobile ? "120px" :  "13%",
      sortable: true,
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "Zone",
      selector: (row) => row.zone.zone,
      width: isMobile ? "120px" : "13%",
      sortable: true,
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "Stage",
      selector: (row) => row.stage,
      width: isMobile ? "120px" : "13%",
      sortable: true,
      style: { whiteSpace: "nowrap" },
    },
    {
      name: "View",
      width: "12%",
      cell: (row) => (
        <Link to={`/viewprogramdetails/${row._id}`}>
          <button className="px-3 py-2 text-black font-bold rounded-md bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] transition duration-300">
            <FaChevronCircleRight />
          </button>
        </Link>
      ),
      style: { whiteSpace: "nowrap" },
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
    headCells: {
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
    },
  };
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
      const title = error?.status || "Error fetching zones";
      return <ErrorMessage code={code} title={title} details={details} />;
    }
  const filteredData = data.filter((d) =>
    [
      d.declaredOrder || "",
      d.id || "",
      d.name || "",
      d.type || "",
      d.zone?.zone || "",
    ].some((value) =>
      String(value)
        .toLowerCase()
        .includes((filterText || "").toLowerCase())
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
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            className="p-2 rounded-md w-[90vw] mr-4 md:mr-0 md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
          />
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black ">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          subHeaderAlign="right"
          responsive
          customStyles={customStyles}
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Declared Program Found
            </div>
          }
        />
      </div>
    </div>
  );
};

export default AllResults;
