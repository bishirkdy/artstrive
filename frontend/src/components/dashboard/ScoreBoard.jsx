const ScoreBoard = ({data}) => {
  return (
    <div className="flex flex-col bg-[#111111] w-full rounded-2xl p-5 shadow-lg transition-transform duration-300">
      <h1 className="text-white font-semibold text-2xl mb-4">Score Board</h1>

      {data?.length > 0 ? (
        <div className="space-y-4">
          {data.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
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
        <div className="text-center py-6 text-white/70">
          No teams available yet
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
