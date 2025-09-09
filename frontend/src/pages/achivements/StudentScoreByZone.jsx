import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useViewStudentPointsByZoneMutation } from "../../redux/api/programApi";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile";

const StudentScoreByZone = () => {
  const [zoneId, setZoneId] = useState("");
  const [fetchScores, { data, isLoading }] =
    useViewStudentPointsByZoneMutation();
  const {
    data: zoneData,
    isLoading: zoneIsLoading,
    isError,
    error,
  } = useViewZoneQuery();
  const isMobile = UseIsMobile();
  const filterZone = zoneData?.filter(
    (z) =>
      z.zone !== "GENERAL" &&
      z.zone !== "MIX ZONE" &&
      z.zone !== "CAT-A" &&
      z.zone !== "CAT-B"
  );

  const handleZoneChange = async (e) => {
    const selectedZone = e.target.value;
    setZoneId(selectedZone);
    if (selectedZone) {
      await fetchScores({ zoneId: selectedZone }).unwrap();
    }
  };

  const columns = [
    {
      name: "Student Id",
      selector: (row) => row.id,
      width:  isMobile ? "80px" : "25%",
      wrap: true,
    },
    { name: "Name", selector: (row) => row.name, width:  isMobile ? "260px" : "25%", wrap: true },
    { name: "Team", selector: (row) => row.team, width:  isMobile ? "120px" : "25%", wrap: "true" },
    {
      name: "Total Score",
      selector: (row) => row.totalScore || 0,
      width: isMobile ? "120px" : "25%",
      wrap: "true",
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
    },
  };
  if (isLoading || zoneIsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    const code = errorData?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  return (
    <div className="flex flex-col items-center mt-[16vh] h-[90vh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl ">
            View Students Score By Zone
          </h1>
        </div>

        <div className="flex items-center">
          <select
            className="p-2 mr-4 md:mr-0 rounded-md w-[90vw] md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
            value={zoneId}
            defaultValue=""
            required
            onChange={handleZoneChange}
          >
            <option disabled hidden value="">
              Select zone
            </option>
            {filterZone?.map((z) => (
              <option key={z._id} value={z._id}>
                {z.zone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black ">
        <DataTable
          columns={columns}
          data={data}
          responsive
          noDataComponent={
            <div
              className="text-center text-gray-400 py-6 text-sm italic"
              style={{ backgroundColor: "#000", width: "100%" }}
            >
              No Student Score Found
            </div>
          }
          customStyles={customStyles}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default StudentScoreByZone;
