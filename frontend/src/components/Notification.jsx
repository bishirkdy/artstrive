import React, { useEffect, useState } from "react";
import { useGetMessageQuery } from "../redux/api/customApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { useSelector } from "react-redux";
import { FaDeleteLeft } from "react-icons/fa6";
import { useDeleteMessageMutation } from "../redux/api/customApi";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const Notification = () => {
  const { data, isLoading, refetch } = useGetMessageQuery();
  const { user } = useSelector((state) => state.auth);
  const isTeamOrAdmin = user?.teamName;
  const [timeLefts, setTimeLefts] = useState({});
  const [deleteMessage, { isLoading: deleteLoading }] = useDeleteMessageMutation();

  const notificationsArray = Array.isArray(data?.data) ? data.data : [];
  const finalNotification = isTeamOrAdmin
    ? notificationsArray
    : notificationsArray.filter((d) => d.notificationOfTo === "all");

  useEffect(() => {
    if (!finalNotification?.length) return;

    const interval = setInterval(() => {
      const updates = {};

      finalNotification.forEach((d) => {
        if (!d.deadline) {
          updates[d._id] = "";
          return;
        }
        const now = dayjs.utc();
        const end = dayjs.utc(d.deadline);
        if (!end.isValid()) {
          updates[d._id] = "Invalid date";
          return;
        }
        const diff = end.diff(now);

        if (diff <= 0) {
          updates[d._id] = "Closed";
        } else {
          const days = end.diff(now, "day");
          const hours = end.diff(now, "hour") % 24;
          const minutes = end.diff(now, "minute") % 60;
          const seconds = end.diff(now, "second") % 60;
          updates[d._id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      });

      setTimeLefts(updates);
    }, 1000);

    return () => clearInterval(interval);
  }, [finalNotification]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-white">Loading notifications...</h1>
      </div>
    );

  const deleteHandler = async (_id) => {
    try {
      await deleteMessage({ _id }).unwrap();
      refetch();
      toast.success("message deleted successfully");
    } catch (error) {
      toast.error(
        "error deleting message ",
        error?.data?.message || error.message
      );
    }
  };

  return (
    <div className="flex flex-col bg-[#111111] w-full rounded-2xl space-y-2 pb-6 shadow-lg transition-transform duration-300">
      {finalNotification.length > 0 ? (
        finalNotification.map((d, idx) => (
          <div key={d._id}>
            <div className="flex flex-col text-white w-full px-2 py-1">
              <div className="flex flex-row justify-between items-center mb-2">
                <h1 className="max-w-[70%] text-base">{d.notificationTitle}</h1>
                <div className="flex flex-row gap-2 items-end">
                  <span className="text-sm text-gray-200 animate-pulse">
                    {dayjs(d.notificationDate).fromNow()}
                  </span>
                  {user?.isAdmin && (
                    <span
                      disabled={deleteLoading}
                      className="cursor-pointer text-red-500 hover:text-red-800"
                      onClick={() => deleteHandler(d._id)}
                    >
                      <FaDeleteLeft />
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm opacity-80">{d.notification}</p>
                {d.deadline && (
                  <span
                    className={`text-xs font-semibold ml-4 whitespace-nowrap ${
                      timeLefts[d._id] === "Closed"
                        ? "text-red-500"
                        : "text-green-400"
                    }`}
                  >
                    {timeLefts[d._id] === "Closed"
                      ? "❌ Closed"
                      : timeLefts[d._id] === "Invalid date"
                      ? "Invalid deadline"
                      : timeLefts[d._id]
                        ? `⏳ ${timeLefts[d._id]}`
                        : ""}
                  </span>
                )}
              </div>
            </div>
            {idx < finalNotification.length - 1 && (
              <hr className="border-gray-700 mx-2" />
            )}
          </div>
        ))
      ) : (
        <h1 className="text-white/70 m-auto pt-5">
          Not available notifications
        </h1>
      )}
    </div>
  );
};

export default Notification;