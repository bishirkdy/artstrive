import React, { useEffect, useState } from "react";

import { useAllStudentQuery } from "../../redux/api/studentApi";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { useGetAllProgramQuery } from "../../redux/api/programApi";
import { useAddStudentToProgramsMutation } from "../../redux/api/programApi";
import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { useProgramAddingDeadlineQuery } from "../../redux/api/customApi";

const AddProgram = () => {
  const [zone, setZone] = useState("");
  const [sId, setSId] = useState("");
  const [sName, setSName] = useState("");
  const [pName, setPName] = useState("");
  const [pId, setPId] = useState("");
  const [pType, setPType] = useState("");
  const [pZone, setPZone] = useState("");

  const { user } = useSelector((state) => state.auth);
  const admin = user.user.isAdmin === true;
  const teams = user.user.isAdmin === false;

  const {data , isLoading , isError , error : dlError } = useProgramAddingDeadlineQuery();
  const [addStudentToProgram, { isLoading: addStudentIsLoading }] =
    useAddStudentToProgramsMutation();
  const {
    data: studentFromDB,
    isLoading: studentIsLoading,
    error: studentError,
    isError : studentIsError,
    refetch: studentRefetch,
  } = useAllStudentQuery();

  const {
    data: zoneFromDB,
    isLoading: zoneIsLoading,
    error: zoneError,
    isError : zoneIsError,
    refetch: zoneRefetch,
  } = useViewZoneQuery();
  const {
    data: programFromDB,
    isLoading: programIsLoading,
    error: programError,
    isError : programIsError,
    refetch: programRefetch,
  } = useGetAllProgramQuery();

  const student = studentFromDB
    ? studentFromDB.find((s) => s.id === sId)
    : null;

  useEffect(() => {
    if (student) {
      setSId(student.id);
      setSName(student.name);
      setZone(student.zone._id);
    } else {
      setSName("");
      setZone("");
    }
  }, [student, setSId, setSName, setZone]);
  const studentTeam = student?.team.teamName;
  const sameTeam = user.user.teamName === studentTeam;

  const program = programFromDB?.find((p) => p.id === pId);
  useEffect(() => {
    if (program) {
      setPId(program.id);
      setPName(program.name);
      setPType(program.type);
      setPZone(program.zone._id);
    } else {
      setPName("");
      setPType("");
      setPZone("");
    }
  }, [program, setPId, setPName, setPType, setPZone]);
  if (studentIsLoading || zoneIsLoading || zoneIsLoading || programIsLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Loader />
      </div>
    );
  }
  const error = studentError || zoneError || programError || dlError;
  if (isError || zoneIsError || studentIsError || programIsError) {
    const code = error.originalStatus || "Error";
    const details = error.error || error.data || "Something went wrong";
    const title = error.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (admin || sameTeam) {
      try {
        await addStudentToProgram({
          studentId: student._id,
          programId: program._id,
          programZoneId: pZone,
        }).unwrap();
        toast.success("Student added to program successfully", {
          position: "bottom-right",
        });
        setSId("");
        setPId("");
        setZone("");
      } catch (error) {
        toast.error(
          `Error adding student to program: ${
            error.data?.message || error.message
          }`
        );
      }
    } else {
      toast.error("Student is not in your team 😂");
    }
  };
  const selectedZone = zoneFromDB.filter(
    (z) =>
      z.zone !== "GENERAL" &&
      z.zone !== "MIX ZONE" &&
      z.zone !== "CAT-A" &&
      z.zone !== "CAT-B"
  );
  const currentDate = new Date();
  const deadlineDate = new Date(data?.data?.deadline);
  if (teams && deadlineDate < currentDate) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Program Adding Deadline closed
          </h1>
          <p className="text-white">
            The deadline for adding programs has passed. You can no longer add
            or edit programs.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto mt-[4rem] mb-[2rem] flex flex-col p-6 overflow-y-auto scrollbar-hide md:max-w-2xl lg:ml-[28vw] bg-[var(--color-primary)] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add Student To Program
      </h1>

      <form onSubmit={handleSubmit} className="flex  flex-col space-y-4 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Zone</label>
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select zone of Student
              </option>
              {selectedZone.map((zone, i) => (
                <option key={i} value={zone._id}>
                  {zone.zone}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">ID</label>
            <input
              pattern="\d*"
              type="text"
              value={sId}
              maxLength={4}
              onChange={(e) => setSId(e.target.value)}
              placeholder="Enter Student id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Name</label>
            <input
              type="text"
              value={sName}
              onChange={(e) => setSName(e.target.value)}
              placeholder="Enter student name"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Zone</label>
            <select
              value={pZone}
              onChange={(e) => setPZone(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select zone of program
              </option>
              {zoneFromDB.map((zone, i) => (
                <option key={i} value={zone._id}>
                  {zone.zone}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Type</label>
            <select
              value={pType}
              onChange={(e) => setPType(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select program type
              </option>
              <option value="Individual">Individual</option>
              <option value="Group">Group</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">ID</label>
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
              type="text"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              placeholder="Enter program name"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>

        <button
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
        >
          {addStudentIsLoading ? `Adding program to ${sName}` : "Add Program"}
        </button>
      </form>
    </div>
  );
};

export default AddProgram;
