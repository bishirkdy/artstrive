import React, { useState } from "react";
import { useGetAllDeclaredResultsQuery } from "../../redux/api/programApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

const SpecifiedResults = () => {
  const [id, setId] = useState("");
  const { data, isLoading , error , isError} = useGetAllDeclaredResultsQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  if (!data || !Array.isArray(data)) return <h5>No data available</h5>;
      if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const filteredProgram = data.filter((fd) => fd.program?.id === id);
  const programHeader = filteredProgram.length > 0 ? filteredProgram[0] : null;

  return (
    <div className="mt-[6rem] flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg overflow-hidden shadow-lg">
      <h1 className="text-2xl text-white text-center font-semibold">
        Specified Results
      </h1>

      <div className="flex flex-col md:flex-row mt-6 items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Enter program id"
          value={id}
          maxLength={4}
          onChange={(e) => setId(e.target.value)}
          className="p-2 rounded-lg w-full md:w-[50%] bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
        />
      </div>

      <hr className="my-4 border-gray-500" />

      {programHeader ? (
        <>
          <div className="flex flex-row justify-center w-full">
            <h1 className="text-white text-2xl font-medium text-center">
              Result {programHeader.program?.declaredOrder}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center md:justify-between w-full text-white text-sm md:text-base mt-4 gap-2 px-4">
            {["id", "name", "type"].map((key) => (
              <h5 key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                programHeader.program?.[key] || ""
              }`}</h5>
            ))}
            <h5>{`Zone: ${programHeader.program?.zone?.zone || ""}`}</h5>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="table-auto w-full text-white border-collapse">
              <thead>
                <tr className="bg-[var(--color-primary)]">
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Letter</th>
                  <th className="border px-4 py-2">Id</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Team</th>
                  <th className="border px-4 py-2">Grade</th>
                  <th className="border px-4 py-2">Score</th>
                  <th className="border px-4 py-2">Rank</th>
                </tr>
              </thead>
              <tbody>
                {filteredProgram.length > 0 ? (
                  filteredProgram.map((d, i) => (
                    <tr
                      key={i}
                      className="even:bg-[var(--color-primary)] odd:bg-black"
                    >
                      <td className="border px-4 py-2 text-center">{i + 1}</td>
                      <td className="border px-4 py-2 text-center">
                        {d.codeLetter}
                      </td>
                      <td className="border px-4 py-2">
                        {d.student?.id || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {d.student?.name || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {d.student?.team?.teamName || "N/A"}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {d.grade}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {d.totalScore}
                      </td>
                      <td className="border px-4 py-2 text-center">{d.rank}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-white text-2xl text-center p-4"
                    >
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h5 className=" animate-pulse text-center text-gray-400 py-6 text-sm italic">
          No program available
        </h5>
      )}
    </div>
  );
};

export default SpecifiedResults;
