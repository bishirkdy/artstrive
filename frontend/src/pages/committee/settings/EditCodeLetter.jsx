import React, { useEffect, useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { useGetProgramForCodeLetterForEditQuery } from "../../../redux/api/programApi";
import { useEditCodeLetterMutation } from "../../../redux/api/programApi";
import ErrorMessage from "../../../components/ErrorMessage";
import { Loader } from "../../../components/Loader";

const EditCodeLetter = ({ settingsToggle }) => {
  const [pId, setPId] = useState("");
  const [program, setProgram] = useState("");

  const { data, isLoading, refetch, error, isError } =
    useGetProgramForCodeLetterForEditQuery();
  const [codeLetters, setCodeLetters] = useState({});
  const [editCodeLetter, { isLoading: editLoading }] =
    useEditCodeLetterMutation();

  const selectedProgram = data
    ? data.filter((p) => p?.program?.id === pId)
    : [];
  const selectedProgramName = selectedProgram[0]?.program?.name || "";
  const selectedProgramDeclared = selectedProgram[0]?.program?.declare === true;
  const selectedStudent = selectedProgram.filter((s) => s.student);
  useEffect(() => {
    if (selectedProgramName) {
      setProgram(selectedProgramName);
    } else {
      setProgram("");
    }
  }, [selectedProgramName]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  const handleCodeLetterChange = (id, value) => {
    setCodeLetters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editCodeLetter({
        programId: pId,
        codeLetters: codeLetters,
      }).unwrap();
      toast.success("Code Letter added successfully", {
        position: "bottom-right",
        autoClose: 2000,
      });
      setCodeLetters({});
      setPId("");
      setProgram("");
      refetch();
    } catch (error) {
      toast.error(
        `Error adding code letter: ${error?.data?.message || error?.message}`,
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };
  if (isError) {
    const code = error?.originalStatus || "Error";
    const details = error?.error || error?.data || "Something went wrong";
    const title = error?.status || "Error fetching programs";
    return <ErrorMessage code={code} title={title} details={details} />;
  }

  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 overflow-y-auto pb-8 scrollbar-hide border-black bg-[var(--color-primary)]">
      <div className="p-4 text-white  flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Code letter Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Edit existing Code Letters if necessary update required, Edit full
          code letter of program and submit
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex  flex-col space-y-4 w-[90%] "
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Program ID</label>
            <input
              pattern="\d*"
              type="text"
              value={pId}
              maxLength={4}
              onChange={(e) => setPId(e.target.value)}
              placeholder="Enter program id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Name</label>
            <input
              readOnly
              type="text"
              value={program}
              placeholder=""
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>
        {!selectedProgramName && pId && pId.length >= 4 ? (
          <div className="flex items-center w-full justify-center text-white animate-pulse">
            <p>There is no program with the given id</p>
          </div>
        ) : (
          <div className="flex items-center">
            <ul className="flex flex-col gap-4 w-[90vw] rounded-md">
              {selectedStudent.map((s, i) => {
                const studentId = s.student?._id || i;
                const studentName = s.student?.name;
                const studentCode = s.student?.id;
                const codeLetter = codeLetters[studentId] || "";

                return (
                  <li
                    key={`${studentId}-${i}`}
                    className="border-2 rounded-lg border-gray-700 px-4 py-2 text-white hover:bg-black flex justify-between items-center transition-all duration-200"
                  >
                    <span className="flex-1 truncate">
                      ID: {studentCode} - {studentName}
                    </span>
                    <input
                      disabled={selectedProgramDeclared}
                      type="text"
                      value={codeLetter}
                      placeholder={s.codeLetter || "_"}
                      onChange={(e) =>
                        handleCodeLetterChange(
                          studentId,
                          e.target.value.toUpperCase()
                        )
                      }
                      maxLength={1}
                      className="border border-gray-600 p-2 w-12 text-center text-lg uppercase bg-black text-white 
            focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] rounded-md transition-all duration-300"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {program && !selectedProgramDeclared && (
          <button
            className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
            type="submit"
          >
            {editLoading ? " Updating ..." : "Update"}
          </button>
        )}
        {program && selectedProgramDeclared && (
          <div className="flex items-center w-full justify-center text-white animate-pulse">
            <p>Program already declared, cannot edit code letters</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditCodeLetter;
