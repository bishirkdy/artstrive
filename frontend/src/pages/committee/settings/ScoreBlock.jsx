import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { useUpdateShowingCountMutation } from "../../../redux/api/customApi";
import { useGetCountForShowingResultQuery } from "../../../redux/api/customApi";
import { useGetShowingCountQuery } from "../../../redux/api/customApi";

const ScoreBlock = ({ settingsToggle }) => {
  const [declareCount, setDeclareCount] = useState("");
  const { data, isLoading, isError, error } = useGetCountForShowingResultQuery();
  const { data : countData, isLoading : countLoading , isError : countIsError , error : countError , refetch } = useGetShowingCountQuery();
  const [updateCount, { isLoading: updateLoading }] =
    useUpdateShowingCountMutation();
    
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateCount({ declareCount }).unwrap();
      setDeclareCount("");
      refetch()
      toast.success("deadline sent successfully", { position: "bottom-right" });
    } catch (error) {
      toast.error(error.message || error.data?.message || "Failed to Update", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  if (isLoading || countLoading) {
    <h1>Loading...</h1>
  }
  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)] overflow-y-auto">
      <div className="p-4 text-white  flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Score display Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Showing score and student score in dashboard. 
          Currently showed {countData?.data?.showingCount || 0}
        </p>
      </div>
      <form
        onSubmit={submitHandler}
        className="flex mt-5 w-[75%] flex-col space-y-4 "
      >
        <div className="flex flex-col w-full space-y-3">
          <select
            value={declareCount}
            onChange={(e) => setDeclareCount(e.target.value)}
            required
            className="w-full mt-4 p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          >
            <option value="" hidden disabled>
              Select Declare count
            </option>
            <option value={0}>Off</option>
            {data?.data.map((count, idx) => (
              <option key={idx} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        {declareCount && (
          <button
            className="w-full py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
            type="submit"
            disabled={updateLoading}
          >
            {updateLoading ? "Updating..." : "Update"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ScoreBlock;
