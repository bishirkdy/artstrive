import React, { useEffect, useState } from "react";
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

const ResendNotification = ({ toggleNotification, data }) => {
  const [timeLefts, setTimeLefts] = useState({});
  const { user } = useSelector((state) => state.auth);
  const isTeamOrAdmin = user?.user?.teamName;

  const finalNotification = isTeamOrAdmin
    ? data?.data
    : data?.data?.filter((d) => d.notificationOfTo === "all");

  useEffect(() => {
    if (!finalNotification?.length) return;

    const interval = setInterval(() => {
      const updates = {};

      finalNotification.forEach((d) => {
        if (!d.deadline) return;

        const now = dayjs();
        const end = dayjs(d.deadline);
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

  return (
   <div className="flex flex-col bg-[#111111] w-full rounded-2xl space-y-2 p-4 pb-6 shadow-lg transition-transform duration-300">
  <h1 className="text-white font-semibold text-lg">Resend Notifications</h1>

  {finalNotification?.length > 0 ? (
    <>
      {finalNotification.map((d, idx) => (
        <div key={d._id}>
          <div className="flex flex-row text-white items-center justify-between w-full px-2 py-1">
            <p className="truncate max-w-[70%]">
              {d.notificationTitle.length > 20
                ? `${d.notificationTitle.slice(0, 20)}...`
                : d.notificationTitle}
            </p>

            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-200 animate-pulse">
                {dayjs(d.notificationDate).fromNow()}
              </span>

              {d.deadline && (
                <span
                  className={`text-xs font-semibold truncate ${
                    timeLefts[d._id] === "Closed"
                      ? "text-red-500"
                      : "text-green-400"
                  }`}
                >
                  {timeLefts[d._id] === "Closed"
                    ? "❌ Closed"
                    : `⏳ ${timeLefts[d._id]}`}
                </span>
              )}
            </div>
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
    <h1 className="text-white/70 m-auto pt-5">
      Not available notifications
    </h1>
  )}
</div>

  );
};

export default ResendNotification;
