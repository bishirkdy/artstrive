import React from "react";
import { useProgramCountQuery } from "../../redux/api/programApi";

const ScoreBoard = ({ data }) => {
  const scores = data?.totalTeamScores || [];
  const showingCount = Number(data?.showingCount) || 0;
  const { data: programData, isLoading } = useProgramCountQuery();
  const programCount = Number(programData?.programCount) || 0;

  if (isLoading) return <h1 className="text-white p-4">Loading...</h1>;

  return (
    <div className="flex flex-col bg-[#111111] w-full rounded-2xl p-5 shadow-lg transition-transform duration-300">
      <h1 className="text-white font-semibold text-2xl mb-2">Score Board</h1>

      <p className="text-white/70 text-sm mb-4">
        {showingCount > 0 && showingCount !== programCount
          ? `After ${showingCount} ${showingCount === 1 ? "result" : "results"}`
          : showingCount === programCount && programCount > 0
          ? "Final Status"
          : "No result published"}
      </p>

      {scores.length > 0 ? (
        <div className="space-y-4">
          {scores.map((d, i) => (
            <div
              key={d._id}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
            >
              <div className="flex items-center">
                <span className="text-xl font-bold text-[var(--color-secondary)] mr-4 w-8 text-center">
                  {i + 1}
                </span>
                <h3 className="text-lg text-white font-medium">{d.teamName}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-bold text-[var(--color-secondary)] bg-white/10 px-3 py-1 rounded-lg">
                  {d.totalScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-white/70 italic">
          No teams available yet
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
