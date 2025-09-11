import React from "react";
import { useAllStudentQuery } from "../../redux/api/studentApi";
import { useStudentDetailByIdQuery } from "../../redux/api/programApi";
import { useDeleteStudentOneProgramMutation } from "../../redux/api/studentApi";
import { MdDeleteForever } from "react-icons/md";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import { useProgramAddingDeadlineQuery } from "../../redux/api/customApi";
import { useSelector } from "react-redux";

const OneStudent = () => {
  const { _id } = useParams();

  const {
    data: studentData,
    isLoading: studentIsLoading,
    error: studentError,
    isError: studentIsError,
  } = useAllStudentQuery();

  const {
    data: studentProgramData,
    isLoading: studentProgramIsLoading,
    error: studentProgramError,
    isError: detailIsError,
    refetch,
  } = useStudentDetailByIdQuery(_id);
  const {
    data,
    isLoading,
    isError,
    error: dlError,
  } = useProgramAddingDeadlineQuery();
  const { user } = useSelector((state) => state.auth);
  const teams = user.user.isAdmin === false;

  const [deleteStudentOneProgram, { isLoading: isDeleting }] =
    useDeleteStudentOneProgramMutation();

  if (studentIsLoading || studentProgramIsLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  const error = studentError || studentProgramError || dlError;
  if (studentIsError || isError || detailIsError) {
    const code = error.originalStatus || "Error";
    const details = error.error || error.data || "Something went wrong";
    const title = error.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const selectedStudent = studentData?.find((sd) => sd._id === _id);
  const currentDate = new Date();
  const deadlineDate = new Date(data?.data?.deadline);
  const finaldeadline = teams && deadlineDate < currentDate;
  const handleDelete = async (program) => {
    const id = program?._id || program;
    if (!id) {
      toast.error("Invalid program ID");
      return;
    }

    try {
      await deleteStudentOneProgram({ _id: id }).unwrap();
      toast.success("Program deleted successfully", {
        position: "bottom-right",
        autoClose: 2000,
      });
      refetch();
    } catch (error) {
      toast.error(
        `Error: ${
          error.message || error.data?.message || "Something went wrong"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
  };

  return (
    <div className="mt-[6rem] flex flex-col mx-4 p-4 w-full lg:max-w-[75vw] lg:ml-[23vw] xl:ml-[20vw] bg-[var(--color-primary)] rounded-lg overflow-hidden shadow-lg">
      <div className="text-white">
        {selectedStudent ? (
          <>
            <div className="flex flex-row justify-center w-full">
              <h1 className="text-2xl font-medium text-center">
                Details Of {selectedStudent.name}
              </h1>
            </div>
            <div>
              <div className="header-row flex flex-wrap justify-center md:justify-between w-full text-sm md:text-base mt-4 gap-2 px-4">
                {["id", "name"].map((key) => (
                  <h5 key={key}>
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                      selectedStudent?.[key] || ""
                    }`}
                  </h5>
                ))}
                <h5>{`Team: ${selectedStudent?.team?.teamName || ""}`}</h5>
                <h5>{`Zone: ${selectedStudent?.zone?.zone || ""}`}</h5>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              {studentProgramData?.length > 0 ? (
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 px-4 py-2">No</th>
                      <th className="border-2 px-4 py-2">Program Id</th>
                      <th className="border-2 px-4 py-2">Program Name</th>
                      <th className="border-2 px-4 py-2">Program Zone</th>
                      {!finaldeadline && (
                        <th className="border-2 px-4 py-2">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {studentProgramData?.map((d, i) => (
                      <tr
                        key={i}
                        className={`border px-4 py-2 ${
                          i % 2 === 0 ? "even" : "odd"
                        }`}
                      >
                        <td className="border px-4 py-2">{i + 1}</td>
                        <td className="border px-4 py-2">{d.program.id}</td>
                        <td className="border px-4 py-2">{d.program.name}</td>
                        <td className="border px-4 py-2">
                          {d.program.zone.zone}
                        </td>
                        {!finaldeadline && (
                          <td className="border px-4 py-2 text-center">
                            <button
                              onClick={() => handleDelete(d.program)}
                              className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              disabled={isDeleting}
                            >
                              <MdDeleteForever className="text-2xl inline-block" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center w-full mt-5 h-full">
                  <h5 className="text-md animate-pulse m-auto">
                    No program data available
                  </h5>
                </div>
              )}
            </div>
          </>
        ) : (
          <h5 className="text-md animate-pulse m-auto">Student not found</h5>
        )}
      </div>
    </div>
  );
};

export default OneStudent;
