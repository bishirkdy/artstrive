import React from "react";
import { useGetScannedStudentResultsQuery } from "../../../redux/api/scannedApi";
import { useParams } from "react-router-dom";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const ResultScanned = () => {
  const { slug } = useParams();
  const parts = slug.split("-");
  const id = parts[parts.length - 1];

  const { data, isLoading, isError, error } =
    useGetScannedStudentResultsQuery(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );

  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching results";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  return (
    <div className="mt-20 mx-auto w-[96vw] xl:max-w-6xl lg:max-w-5xl bg-gradient-to-br from-black via-gray-900 to-neutral-900 rounded-2xl shadow-2xl p-6 md:p-10">
      <h1 className="text-center text-3xl text-white font-extrabold mb-12 tracking-wide">
        Results
      </h1>

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((d) => {
            let rankBadge = "-";

            switch (d.rank) {
              case 1:
              case "1":
              case "first":
                rankBadge = "🥇";
                break;
              case 2:
              case "2":
              case "second":
                rankBadge = "🥈";
                break;
              case 3:
              case "3":
              case "third":
                rankBadge = "🥉";
                break;
              default:
                rankBadge = d.rank || "-";
            }

            return (
              <div
                key={d._id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col shadow-sm hover:scale-105 transform transition"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm text-white">
                    {d.program?.name.charAt(0).toUpperCase() + d.program?.name?.slice(1) || "-"}
                  </span>
                  <span className="text-sm">{rankBadge}</span>
                </div>

                {/* Program Info */}
                <p className="text-xs text-gray-400 mb-1">
                  Program ID: {d.program?.id}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Type: {d.program?.type}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Zone: {d.program?.zone?.zone}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Declaration: {d.program?.declaredOrder}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {/* <span className="px-2 py-1 bg-indigo-600 rounded-full text-xs font-medium text-white">
                    Score: {d.score ?? "-"}
                  </span> */}
                  <span className="px-2 py-1 bg-green-600 rounded-full text-xs font-medium text-white">
                    Code: {d.codeLetter || "-"}
                  </span>
                  <span className="px-2 py-1 bg-yellow-500 rounded-full text-xs font-medium text-black">
                    Grade: {d.grade || "-"}
                  </span>
                  <span className="px-2 py-1 bg-pink-500 rounded-full text-xs font-medium text-white">
                    Total: {d.totalScore || "-"}
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

export default ResultScanned;
