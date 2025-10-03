import React, { useEffect } from "react";
import { useCheeksMarkToDeclareQuery } from "../../../redux/api/programApi";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const CheckMark = () => {
  const { data, isLoading, isError, error , refetch } = useCheeksMarkToDeclareQuery();
useEffect(()=> {
    refetch()
},[])
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
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  // group data by program._id
  const groupedPrograms = data?.reduce((acc, item) => {
    const programId = item.program?._id;
    if (!acc[programId]) {
      acc[programId] = { program: item.program, results: [] };
    }
    acc[programId].results.push(item);
    return acc;
  }, {});

  return (
    <div className="mt-[6rem] flex flex-col mx-4 p-4 w-[90vw] lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg overflow-hidden shadow-lg">
      <div className="flex flex-row justify-center w-full">
        <h1 className="text-2xl font-medium text-center mt-4 text-white">
          Program Result
        </h1>
      </div>
      {groupedPrograms &&
        Object.values(groupedPrograms).map((group, index) => {
          const { program, results } = group;
          return (
            <div
              key={program._id}
              className="mb-12 p-4 border-b border-gray-500 last:border-none"
            >

              <div className="header-row flex flex-wrap justify-center md:justify-between w-full text-sm md:text-base mt-4 gap-2 px-4 text-white">
                {["id", "name", "type", "stage"].map((key) => (
                  <h5 key={key}>
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                      program?.[key] || ""
                    }`}
                  </h5>
                ))}
                <h5>{`Zone: ${program?.zone?.zone || ""}`}</h5>
              </div>

              {/* Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="table-auto text-white w-full border-collapse">
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
                    {results.map((d, i) => (
                      <tr
                        key={d._id}
                        className={`border text-white px-4 py-2 ${
                          i % 2 === 0 ? "even" : "odd"
                        }`}
                      >
                        <td className="border px-4 py-2">{i + 1}</td>
                        <td className="border px-4 py-2">{d.codeLetter}</td>
                        <td className="border px-4 py-2">{d.student.id}</td>
                        <td className="border px-4 py-2">{d.student.name}</td>
                        <td className="border px-4 py-2">
                          {d.student.team?.teamName}
                        </td>
                        <td className="border px-4 py-2">{d.grade}</td>
                        <td className="border px-4 py-2">{d.totalScore}</td>
                        <td className="border px-4 py-2">{d.rank}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {data?.length === 0 && (
          <p className="text-white text-center mt-4">No programs available for result declaration.</p>
        )}
    </div>
  );
};

export default CheckMark;
