import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const ResendResults = ({data}) => {
 
  return (
    <div className="rounded-lg mt-4 pb-6 bg-[#111111] shadow-lg flex transition-transform duration-300 overflow-x-auto">
      <div className="flex flex-col w-full">
        <h1 className="text-white pl-4 py-4 font-semibold">Resend Results</h1>
        <table className="table-auto w-full text-center px-2 md:pl-8 text-sm text-white border-separate border-spacing-0">
          {data &&
            data.map((d, i) => (
              <tbody key={i}>
                <tr>
                  <td className="p-2">{d.declaredOrder}</td>
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.type}</td>
                  <td className="p-2">{d.zone.zone}</td>
                  <td className="text-gray-200 animate-pulse p-2">
                    {dayjs(d.updatedAt).fromNow()}
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </div>
  );
};

export default ResendResults;
