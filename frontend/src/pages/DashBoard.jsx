import React, { useState } from "react";
import { IoNotificationsCircle } from "react-icons/io5";
import TopDashboard from "../components/dashboard/TopDashboard";
import LineChartWithReferenceLines from "../components/dashboard/ScoreWayHome";
import ResendResults from "../components/dashboard/ResendResults";
import ProgressResult from "../components/dashboard/ProgressResult";
import ScoreBoard from "../components/dashboard/ScoreBoard";
import ResendNotification from "../components/dashboard/ResendNotification";
import Notification from "../components/Notification";
import { IoCaretBack } from "react-icons/io5";
import {
  usePerformanceGraphQuery,
  useProgressResultsQuery,
  useRecentMessageQuery,
  useResendResultsQuery,
  useTopDashBoardQuery,
} from "../redux/api/customApi";
import { useViewTeamScoreQuery } from "../redux/api/programApi";
import { Loader } from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { useParams } from "react-router";
const DashBoard = () => {
  const [isNotification, setIsNotification] = useState(false);
  const toggleNotification = () => setIsNotification(!isNotification);

  const {
    data: topBarData,
    isError: topBarError,
    isLoading: topBarLoading,
    error: topBarErrorData,
  } = useTopDashBoardQuery();
  const {
    data: graphData,
    isLoading: graphLoading,
    isError: graphError,
    error: graphErrorData,
  } = usePerformanceGraphQuery();

  const {
    data: resentResultData,
    isLoading: recentResultLoading,
    isError: resendResultError,
    error: resendResultErrorData,
  } = useResendResultsQuery();

  const {
    data: progressResultData,
    isLoading: progressResultLoading,
    isError: progressResultError,
    error: progressResultErrorData,
  } = useProgressResultsQuery();

  const {
    data: scoreBoard,
    isLoading: scoreBoardLoading,
    isError: scoreBoardError,
    error: scoreBoardErrorData,
  } = useViewTeamScoreQuery();

  const {
    data: resendMessage,
    isLoading: resendMessageLoading,
    isError: resendMessageError,
    error: resendMessageErrorData,
  } = useRecentMessageQuery();
  const { slug } = useParams();
  if (
    topBarLoading ||
    graphLoading ||
    recentResultLoading ||
    progressResultLoading ||
    scoreBoardLoading ||
    resendMessageLoading
  ) {
    return (
      <div>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </div>
    );
  }

  if (
    topBarError ||
    graphError ||
    resendResultError ||
    progressResultError ||
    scoreBoardError ||
    resendMessageError
  ) {
    const code =
      topBarErrorData?.originalStatus ||
      graphErrorData?.originalStatus ||
      resendResultErrorData?.originalStatus ||
      progressResultErrorData?.originalStatus ||
      scoreBoardErrorData?.originalStatus ||
      resendMessageErrorData?.originalStatus;
    const details =
      topBarErrorData?.error ||
      graphErrorData?.error ||
      resendResultErrorData?.error ||
      progressResultErrorData?.error ||
      scoreBoardErrorData?.error ||
      resendMessageErrorData?.error ||
      "Something went wrong";
    const title =
      topBarErrorData?.status ||
      graphErrorData?.status ||
      resendResultErrorData?.status ||
      progressResultErrorData?.status ||
      scoreBoardErrorData?.status ||
      resendMessageErrorData?.status ||
      "Error fetching data";
    return <ErrorMessage code={code} details={details} title={title} />;
  }

  return (
    <>
      <div
        className={`flex flex-col  ${
          slug ? "xl:w-full" : "xl:w-[82vw] xl:ml-[17vw] lg:ml-[23vw]"
        }  lg:mr-4 lg:mt-4 pb-10 md:pb-4 bg-[#141414] rounded-lg shadow-lg overflow-y-auto scrollbar-hide`}
      >
        <div className="w-full flex justify-end md:justify-between p-4 border-b border-gray-700 bg-[#111111]">
          <h1 className="hidden md:block md:pl-[8vw] lg:pl-0 font-semibold text-2xl text-[var(--color-secondary)]">
            Welcome to the Art Strive
          </h1>
          <IoNotificationsCircle
            onClick={toggleNotification}
            className="text-[var(--color-secondary)] text-3xl cursor-pointer hover:scale-110 transition-transform"
          />
        </div>

        <div className="flex flex-col xl:flex-row overflow-y-auto scrollbar-hide gap-6 w-full p-2 md:p-4">
          <div className="flex flex-col w-full xl:w-[70%] px-4 bg-[#000000] p-4 rounded-xl shadow-md">
            <TopDashboard data={topBarData} />
            <LineChartWithReferenceLines data={graphData} />
            <ResendResults data={resentResultData} />
          </div>

          <div className="flex flex-col w-full xl:w-[30%] px-4 gap-5 bg-[#000000] p-4 rounded-xl shadow-md">
            <ProgressResult data={progressResultData} />
            <ScoreBoard data={scoreBoard} />
            <ResendNotification
              toggleNotification={toggleNotification}
              data={resendMessage}
            />
          </div>
        </div>
      </div>
      {isNotification && (
        <div className="fixed inset-0 bg-black/80 flex justify-end z-50">
          <div className="bg-[var(--color-primary)] w-full sm:w-[400px] h-full p-4 sm:p-6 shadow-2xl overflow-y-auto scrollbar-hide transition-transform duration-300 ease-in-out">
            <div className="flex items-center space-x-2 mb-4">
              <IoCaretBack
                onClick={toggleNotification}
                className="text-[var(--color-secondary)] text-3xl cursor-pointer hover:scale-105 transition-transform"
              />
              <span className="text-white text-xl font-semibold">
                Notifications
              </span>
            </div>
            <Notification />
          </div>
        </div>
      )}
    </>
  );
};

export default DashBoard;
