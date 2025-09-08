import React from "react";
import { useGetScannedStudentResultsQuery } from "../../../redux/api/scannedApi";
import { useParams } from "react-router-dom";
import { Loader } from "../../../components/Loader";
const ResultScanned = () => {
  const { slug } = useParams();
  const parts = slug.split("-")
  const id = parts[parts.length - 1]
  const { data, isLoading, isError } = useGetScannedStudentResultsQuery(id);
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  if (isError) return toast.error("Failed to fetch results");
  return (
    <div className="mt-20 mx-2 md:ml-4 lg:ml-[23vw] xl:ml-[22vw] w-[96vw] xl:max-w-5xl lg:max-w-3xl bg-[var(--color-primary)] rounded-2xl shadow-2xl p-4 md:p-8">
      <h1 className="text-center text-3xl text-white font-extrabold mb-12 tracking-wide">
        Results
      </h1>
      <div className="mt-4 overflow-x-auto">
        <table className="table-auto w-full text-white border-collapse">
          {data.length > 0 && (
            <thead>
              <tr className="bg-[var(--color-primary)]">
                <th className="border px-4 py-2">Declaration No</th>
                <th className="border px-4 py-2">Id</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Zone</th>
                <th className="border px-4 py-2">Letter</th>
                <th className="border px-4 py-2">Grade</th>
                <th className="border px-4 py-2">Score</th>
                <th className="border px-4 py-2">Rank</th>
              </tr>
            </thead>
          )}

          <tbody>
            {data.length > 0 ? (
              data.map((d, i) => {
                return (
                  <tr
                    key={i}
                    className="even:bg-[var(--color-primary)] odd:bg-black"
                  >
                    <td className="border px-4 py-2 text-center">
                      {d.program.declaredOrder}
                    </td>
                    <td className="border px-4 py-2">{d.program.id}</td>
                    <td className="border px-4 py-2">{d.program.name}</td>
                    <td className="border px-4 py-2">{d.program.type}</td>
                    <td className="border px-4 py-2">{d.program.zone.zone}</td>
                    <td className="border px-4 py-2">{d.codeLetter}</td>
                    <td className="border px-4 py-2">{d.grade}</td>
                    <td className="border px-4 py-2">{d.totalScore}</td>
                    <td className="border px-4 py-2">{d.rank}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-white text-xs md:text-sm animate-pulse text-center"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultScanned;
