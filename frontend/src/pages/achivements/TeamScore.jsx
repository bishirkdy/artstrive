import React from "react";
import { useViewTeamScoreQuery } from "../../redux/api/programApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
const TeamScore = () => {
  const { data, isLoading  , error ,isError} = useViewTeamScoreQuery();
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
    <div className="flex flex-col lg:ml-[22vw] lg:w-[70vw] xl:ml-[20vw]  justify-center items-center h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide px-4">
      <div className="flex items-center justify-between w-full max-w-screen-lg mx-auto">
        <h1 className="text-white font-bold text-2xl text-center w-full">
          View Team Points
        </h1>
      </div>

      {data?.length > 0 ? (
        <div className="space-y-4 w-full max-w-screen-md mx-auto mt-6">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/20 w-full"
            >
              <div className="flex items-center">
                <span className="text-xl font-bold text-[#13F287] mr-4 w-8 text-center">
                  {i + 1}
                </span>
                <h3 className="text-lg text-white font-medium">{d.teamName}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-[#13F287] bg-white/10 px-3 py-1 rounded-lg">
                  {d.totalScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-pulse text-center text-gray-400 py-6 text-sm italic">
          No teams available yet
        </div>
      )}
    </div>
  );
};

export default TeamScore;
