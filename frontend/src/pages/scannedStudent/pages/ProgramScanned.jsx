import React from "react";
import { useGetScannedStudentProgramsQuery } from "../../../redux/api/scannedApi";
import { useParams } from "react-router";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const ProgramScanned = () => {
  const { slug } = useParams();
  const parts = slug.split("-");
  const id = parts[parts.length - 1];

  const { data, isLoading, isError, error } =
    useGetScannedStudentProgramsQuery(id);

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
    <div className="mt-20 mx-auto w-[96vw] xl:max-w-5xl lg:max-w-3xl bg-gradient-to-br from-black via-gray-900 to-neutral-900 rounded-2xl shadow-2xl p-4 md:p-8">
      <h1 className="text-center text-3xl text-white font-extrabold mb-12 tracking-wide">
        Program
      </h1>

      {data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((d, i) => {
            const result = d.program.declare === true ? "Yes" : "No";
            return (
              <div
                key={i}
                className="bg-black border border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                   {d.program.name.charAt(0).toUpperCase() + d.program.name.slice(1)}
                  </h2>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="font-semibold">ID:</span> {d.program.id}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="font-semibold">Type:</span> {d.program.type}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <span className="font-semibold">Zone:</span>{" "}
                    {d.program.zone.zone}
                  </p>
                </div>
                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      result === "Yes"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    Result Arrived: {result}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-white text-sm md:text-base animate-pulse text-center">
          No Data Available
        </div>
      )}
    </div>
  );
};

export default ProgramScanned;
