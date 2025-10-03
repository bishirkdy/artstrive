import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { useViewStudentPointsByStageMutation, useProgramCountQuery } from "../../redux/api/programApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import UseIsMobile from "../../components/UseIsMobile";

const StudentScoreByScore = () => {
  const [zoneId, setZoneId] = useState("");
  const [fetchScores, { data, isLoading }] = useViewStudentPointsByStageMutation();

  const { data: programCountData, isLoading: programCountLoading ,error , isError } = useProgramCountQuery();
  const programCount = programCountData?.programCount || 0;

  const isMobile = UseIsMobile();

  const handleStageChange = async (e) => {
    const selectedZone = e.target.value;
    setZoneId(selectedZone);
    if (selectedZone) {
      await fetchScores({ stage: selectedZone }).unwrap();
    }
  };

  const columns = [
    { name: "Rank", selector: (_, index) => index + 1, width: isMobile ? "60px" : "10%", center: true },
    { name: "Student Id", selector: (row) => row.id, width: isMobile ? "100px" : "15%", wrap: true },
    { name: "Name", selector: (row) => row.name, width: isMobile ? "160px" : "30%", wrap: true },
    { name: "Team", selector: (row) => row.team, width: isMobile ? "120px" : "15%", wrap: true },
    { name: "Zone", selector: (row) => row.zone, width: isMobile ? "120px" : "15%", wrap: true },
    { name: "Total Score", selector: (row) => row.totalScore || 0, width: isMobile ? "100px" : "15%", center: true },
  ];

  const customStyles = {
    headRow: { style: { backgroundColor: "var(--color-primary)", color: "#FFFFFF", fontWeight: "bold", fontSize: "16px", borderBottom: "2px solid #475569", paddingRight: "20px" } },
    rows: { style: { backgroundColor: "var(--color-primary)", color: "#FFFFFF", fontSize: "14px", borderBottom: "1px solid #475569", "&:nth-of-type(odd)": { backgroundColor: "#000" }, paddingRight: "20px" } },
    pagination: { style: { backgroundColor: "var(--color-primary)", color: "#FFFFFF", borderTop: "1px solid #475569" } },
  };

  if (isLoading  || programCountLoading) {
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

  return (
    <div className="flex flex-col items-center mt-[16vh] h-[90vh] overflow-y-auto lg:ml-[20vw] overflow-x-hidden scrollbar-hide">
      {/* Header + Zone Selector */}
      <div className="flex items-center md:px-2 lg:px-0 justify-between w-[98vw] lg:w-[75vw]">
        <div>
          <h1 className="text-[white] hidden md:block font-bold text-2xl">View Students Score By Stage / Non stage</h1>
        </div>
        <div className="flex items-center">
          <select
            className="p-2 mr-4 md:mr-0 rounded-md w-[90vw] md:w-[30vw] lg:w-[20vw] bg-black border border-gray-600 text-white placeholder-gray-400 focus:border-[var(--color-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-all duration-200"
            value={zoneId}
            defaultValue=""
            required
            onChange={handleStageChange}
          >
            <option disabled hidden value="">
              Select stage
            </option>
            <option value="Stage">Stage</option>
            <option value="Non-stage">Non stage</option>
          </select>
        </div>
      </div>

      {/* Showing Count */}
      {data && (
        <div className="w-[90vw] lg:w-[75vw] lg:mx-auto mt-3">
          <p className="text-white/70 text-sm">
            {data.showingCount > 0 && data.showingCount !== programCount
              ? `After ${data.showingCount} ${data.showingCount === 1 ? "result" : "results"}`
              : data.showingCount === programCount && programCount > 0
              ? "Final Status"
              : "No result published"}
          </p>
        </div>
      )}

      {/* DataTable */}
      <div className="w-[90vw] lg:w-[75vw] lg:mx-auto md:w-[95vw] bg-[#1E293B] mt-[2vh] shadow-sm border border-black">
        <DataTable
          columns={columns}
          data={data?.studentScoreByStage || []}
          responsive
          noDataComponent={
            <div className="text-center text-gray-400 py-6 text-sm italic" style={{ backgroundColor: "#000", width: "100%" }}>
              No Student Score Found
            </div>
          }
          customStyles={customStyles}
          pagination
        />
      </div>
    </div>
  );
};

export default StudentScoreByScore;
