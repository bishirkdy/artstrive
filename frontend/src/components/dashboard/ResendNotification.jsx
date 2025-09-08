import React from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1s",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});
const ResendNotification = ({toggleNotification , data }) => {

  const {user} = useSelector((state) => state.auth);
  const isTeamOrAdmin = user?.user?.teamName

  const finalNotification = isTeamOrAdmin ? data?.data : data?.data?.filter((d) => d.notificationOfTo === "all")
  return (
    <div className="flex flex-col bg-[#111111] w-full rounded-2xl space-y-2 p-4 pb-6 shadow-lg transition-transform duration-300">
      <h1 className="text-white font-semibold text-lg">Resend Notifications</h1>

      {finalNotification.length > 0 ? (
    <>
      {finalNotification?.map((d, idx) => (
        <div key={d._id}>
          <div className="flex flex-row text-white items-center justify-between w-full px-2 py-1">
            <p className="truncate max-w-[70%]">
              {d.notificationTitle.length > 20
                ? `${d.notificationTitle.slice(0, 20)}...`
                : d.notificationTitle}
            </p>
            <span className="text-sm text-gray-200 animate-pulse">
              {dayjs(d.notificationDate).fromNow()}
            </span>
          </div>
          {idx < finalNotification.length - 1 && (
            <hr className="border-gray-700 mx-2" />
          )}
        </div>
      ))}
      
      <button
        onClick={toggleNotification}
        className="mt-4 self-end font-semibold hover:bg-[var(--color-tertiary)] bg-[var(--color-secondary)] rounded-md px-4 py-1"
      >
        See All
      </button>
    </>
  ) : (
    <h1 className="text-white/70 m-auto pt-5">Not available notifications</h1>
  )}
    </div>
  );
};

export default ResendNotification;
