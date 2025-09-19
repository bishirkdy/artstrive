import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

const ResendResults = ({ data }) => {
  return (
    <div className="rounded-lg mt-4 pb-6 bg-[#111111] shadow-lg flex transition-transform duration-300 overflow-x-auto">
      <div className="flex flex-col w-full">
        <h1 className="text-white pl-4 py-4 font-semibold">Resend Results</h1>

        <table className="table-auto w-full text-center px-2 md:pl-8 text-sm text-white border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2">Zone</th>
              <th className="p-2">Updated</th>
            </tr>
          </thead>

          <tbody>
            {data && data.length > 0 ? (
              data.map((d, i) => (
                <tr key={i}>
                  <td className="p-2">{d.declaredOrder}</td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.type}</td>
                  <td className="p-2">{d.zone?.zone || "-"}</td>
                  <td className="text-gray-200 animate-pulse p-2">
                    {dayjs.utc(d.updatedAt).fromNow()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-white/70 p-4">
                  No results available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResendResults;
