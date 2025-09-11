import React, { useEffect, useState } from "react";
import { useEditStudentMutation } from "../../redux/api/studentApi";
import { useViewTeamsQuery } from "../../redux/api/authApi";
import { useAllStudentQuery } from "../../redux/api/studentApi";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { useStudentAddingDeadlineQuery } from "../../redux/api/customApi";

const EditStudent = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [studentId, setId] = useState("");
  const [team, setTeam] = useState("");
  const [zone, setZone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const admin = user.user.isAdmin === true;
  const teamsCheck = user.user.isAdmin === false;
  const { _id } = useParams();

  const {
    data: teamsData,
    isLoading: teamIsLoading,
    isError: teamIsError,
    error: errorDataOfTeam,
  } = useViewTeamsQuery();
  const {
    data: studentsData,
    isLoading: studentIsLoading,
    isError: studentError,
    error: errorDataOfStudent,

    refetch,
  } = useAllStudentQuery();
  const {
    data,
    isLoading,
    isError,
    error: deadError,
  } = useStudentAddingDeadlineQuery();
  const { data: zonesData, isLoading: zoneIsLoading } = useViewZoneQuery();
  const [editedStudent] = useEditStudentMutation();
  const navigate = useNavigate();
  const studentName = Array.isArray(studentsData)
    ? studentsData.find((s) => s._id === _id)
    : null;

  useEffect(() => {
    if (studentName) {
      setName(studentName.name);
      setId(studentName.id);
      setTeam(studentName.team._id);
      setZone(studentName?.zone._id);
      toast.warn("You can't change id of student");
    }
  }, [studentName]);

  if (teamIsLoading || zoneIsLoading || studentIsLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  const error = teamIsError || studentError || isError;
  const errorData = errorDataOfStudent || errorDataOfTeam || deadError;
  if (error) {
    const code = errorData?.originalStatus || "Error";
    const details =
      errorData?.error || errorData?.data || "Something went wrong";
    const title = errorData?.status || "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={details} />;
  }
  const teams = Array.isArray(teamsData.teamName) ? teamsData.teamName : [];
  const zones = Array.isArray(zonesData) ? zonesData : [];
  const selectedZone = zones.filter((z) => z.zone !== "GENERAL");
  const currentDate = new Date();
  const deadlineDate = new Date(data?.data?.deadline);
  if (teamsCheck && deadlineDate < currentDate) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Student Editing Deadline closed
          </h1>
          <p className="text-white">
            The deadline for editing students has passed. You can no longer add or edit students.
          </p>
        </div>
      </div>
    );
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_id", _id);
      formData.append("id", studentId);
      formData.append("name", name);
      formData.append("team", team);
      formData.append("zone", zone);
      if (profile) {
        formData.append("profile", profile);
      }

      await editedStudent(formData).unwrap();
      setName("");
      setId("");
      setZone("");
      setProfile(null);
      toast.success("Student updated successfully", {
        position: "bottom-right",
      });
      navigate(`/viewstudent`);
      refetch();
    } catch (error) {
      toast.error(
        error.data?.message || error.message || "Error submitting student"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl lg:ml-[28vw] bg-[#121212] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Edit {studentName.name}
      </h1>
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-white text-xl animate-pulse">Submitting...</div>
        </div>
      )}
      <form onSubmit={submitHandler} className="flex  flex-col space-y-4 ">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Profile</label>
            <input
              type="file"
              onChange={(e) => setProfile(e.target.files[0])}
              placeholder="Enter student id"
              className="w-full text-white bg-black  border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-secondary)] file:text-black hover:file:bg-[var(--color-tertiary)]"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Team</label>
            <select
              value={team}
              disabled={!admin}
              onChange={(e) => setTeam(e.target.value)}
              defaultValue=""
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            >
              <option value="" hidden disabled>
                Select a team
              </option>
              {teams.map((team, i) => (
                <option key={i} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
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
                Select a team
              </option>
              {selectedZone.map((zone, i) => (
                <option key={i} value={zone._id}>
                  {zone.zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Student ID</label>
            <input
              disabled
              type="text"
              value={studentId}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter student id"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Student name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
        </div>

        <button
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
        >
          Edit
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
