import React from "react";
import { useViewTeamScoreQuery, useProgramCountQuery } from "../../redux/api/programApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";

const TeamScore = () => {
  const { data, isLoading, error, isError } = useViewTeamScoreQuery();

  const { data: programCountData, isLoading: isProgramLoading } = useProgramCountQuery();
  const programCount = programCountData?.programCount || 0;

  if (isLoading || isProgramLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }

  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching team scores";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  const teamScores = Array.isArray(data?.totalTeamScores) ? data.totalTeamScores : [];
  const showingCount = Number(data?.showingCount) || 0;

  return (
    <div className="flex flex-col lg:ml-[22vw] lg:w-[70vw] xl:ml-[20vw] justify-center items-center h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-screen-lg mx-auto">
        <h1 className="text-white font-bold text-2xl text-center w-full">
          View Team Points
        </h1>
      </div>

      {/* Showing count */}
      {showingCount >= 0 && (
        <div className="w-full max-w-screen-md mx-auto mt-6 text-left">
          <h2 className="text-gray-400 text-sm sm:text-sm md:text-base">
            {showingCount > 0 && showingCount !== programCount
              ? `After ${showingCount} ${showingCount === 1 ? "result" : "results"}`
              : showingCount === programCount && programCount > 0
              ? "Final Status"
              : ""}
          </h2>
        </div>
      )}

      {teamScores.length > 0 ? (
        <div className="space-y-4 w-full max-w-screen-md mx-auto mt-4">
          {teamScores.map((team, i) => (
            <div
              key={team._id || i}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white/20 w-full"
            >
              <div className="flex items-center">
                <span className="text-xl font-bold text-[var(--color-secondary)] mr-4 w-8 text-center">
                  {i + 1}
                </span>
                <h3 className="text-lg text-white font-medium">{team.teamName}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-[var(--color-secondary)] bg-white/10 px-3 py-1 rounded-lg">
                  {team.totalScore ?? "-"}
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
