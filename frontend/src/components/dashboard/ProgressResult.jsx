const ProgressResult = ({data}) => {
  
  return (
    <div className="flex flex-col bg-[#121212] w-full rounded-2xl space-y-4 p-6 shadow-lg transition-transform duration-300">
      <h1 className="text-white font-semibold text-2xl">Progress Result</h1>
      <div className="bg-gray-500 h-4 w-full rounded-full mt-4 overflow-hidden">
        <div
          className={`bg-[var(--color-secondary)] h-full rounded-full transition-all duration-300`}
          style={{ width: `${data ? data.declaredPercentage : "0"}%` }}
        ></div>{" "}
      </div>
      <div className="text-center mb-4 -mt-1">
        <h3 className="text-white text-lg">
          Declared {data ? data.declaredProgram : "0"} of {data ? data.totalProgram : 0} Results
        </h3>
        <p className="text-white text-sm leading-tight">
          Progress {data ? data.declaredPercentage : "0"} %
        </p>
      </div>
    </div>
  );
};

export default ProgressResult;
