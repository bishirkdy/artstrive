import React from "react";
import { useGetScannedStudentProgramsQuery } from "../../../redux/api/scannedApi";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import ErrorMessage from "../../../components/ErrorMessage";

const ProgramScanned = () => {
  const { slug } = useParams();
  const parts = slug.split("-");
  const id = parts[parts.length - 1];
  
  const { data, isLoading, isError , error } = useGetScannedStudentProgramsQuery(id);
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );

 if (isError) {
      const code = error?.originalStatus || "Error";
      const details = error?.error || error?.data || "Something went wrong";
      const title = error?.status || "Error fetching zones";
      return <ErrorMessage code={code} title={title} details={details} />;
    }  
    return (
    <div className="mt-20 mx-auto w-[96vw] xl:max-w-5xl lg:max-w-3xl bg-gradient-to-br from-black via-gray-900 to-neutral-900 rounded-2xl shadow-2xl p-4 md:p-8">
      <h1 className="text-center text-3xl text-white font-extrabold mb-12 tracking-wide">
        Program
      </h1>
      <div className="mt-4 overflow-x-auto">
        <table className="table-auto w-full text-white border-collapse">
          {data.length > 0 && (
            <thead>
              <tr className="bg-[var(--color-primary)]">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Id</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Zone</th>
                <th className="border px-4 py-2">Result arrived</th>
              </tr>
            </thead>
          )}

          <tbody>
            {data.length > 0 ? (
              data.map((d, i) => {
                const result = d.program.declare === true ? "Yes" : "No";
                return (
                  <tr
                    key={i}
                    className="even:bg-[var(--color-primary)] odd:bg-black"
                  >
                    <td className="border px-4 py-2 text-center">{i + 1}</td>
                    <td className="border px-4 py-2">{d.program.id}</td>
                    <td className="border px-4 py-2">{d.program.name}</td>
                    <td className="border px-4 py-2">{d.program.type}</td>
                    <td className="border px-4 py-2">{d.program.zone.zone}</td>
                    <td className="border px-4 py-2">{result}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-white text-sm md:text-base animate-pulse text-center"
                >
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramScanned;
