import React, { useEffect, useState, useRef } from "react";
import { useAddStudentMutation } from "../../redux/api/studentApi";
import { useViewTeamsQuery } from "../../redux/api/authApi";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { useStudentAddingDeadlineQuery } from "../../redux/api/customApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const AddStudent = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [team, setTeam] = useState("");
  const [zone, setZone] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const {
    data: studentDeadlineData,
    isLoading,
    error,
    isError,
  } = useStudentAddingDeadlineQuery();
  const [student, { isLoading: isStudentLoading }] = useAddStudentMutation();
  const {
    data: teamFormDB,
    isLoading: teamIsLoading,
    error: teamError,
    isError: teamIsError,
  } = useViewTeamsQuery();
  const {
    data: zoneFromDB,
    isLoading: zoneIsLoading,
    error: zoneError,
    isError: zoneIsError,
  } = useViewZoneQuery();
  const { user } = useSelector((state) => state.auth);

  const teamFromStore = user.user.teamName;
  const teams = user.user.isAdmin === false;
  const sameTeam =
    teamFormDB?.teamName && teamFromStore
      ? teamFormDB.teamName.find((team) => team.teamName === teamFromStore)
      : undefined;

  useEffect(() => {
    if (sameTeam && !team) {
      setTeam(sameTeam._id);
    }
  }, [sameTeam, team]);
  if (teamIsLoading || zoneIsLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <Loader />
      </div>
    );
  }

  const currentDate = dayjs.utc();
  const deadlineDate = dayjs.utc(studentDeadlineData?.data?.deadline);
console.log("Current UTC:", currentDate.format());
console.log("Deadline UTC:", deadlineDate.format());
 if (teams && deadlineDate.isBefore(currentDate)) {
  return (
    <div className="flex items-center justify-center h-screen bg-[#121212]">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Student Adding Deadline closed
        </h1>
        <p className="text-white">
          The deadline for adding students has passed. You can no longer add
          new students.
        </p>
      </div>
    </div>
  );
}
  if (teamIsError || zoneIsError || isError) {
    const code =
      teamError?.originalStatus ||
      zoneError?.originalStatus ||
      error?.originalStatus ||
      "Error";
    const details =
      teamError?.error ||
      teamError?.data ||
      error?.error ||
      error?.data ||
      zoneError?.error ||
      zoneError?.data;

    const detailsString =
      typeof details === "object" ? JSON.stringify(details) : details;

    const title =
      teamError?.status ||
      zoneError?.status ||
      error?.status ||
      "Error fetching zones";
    return <ErrorMessage code={code} title={title} details={detailsString} />;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!id || !team || !name || !zone) {
        toast.error("All fields are required");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("team", team);
      formData.append("zone", zone);
      formData.append("profile", image);

      await student(formData).unwrap();
      setImage(null);
      setName("");
      setId("");
      setTeam("");
      setZone("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Student added successfully", { position: "bottom-right" });
    } catch (error) {
      console.error("Error adding student:", error);

      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("An error occurred while adding the student");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedZone = zoneFromDB.filter(
    (z) =>
      z.zone !== "GENERAL" &&
      z.zone !== "MIX ZONE" &&
      z.zone !== "CAT-A" &&
      z.zone !== "CAT-B"
  );

  return (
    <div className="mx-auto lg:ml-[28vw] mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl bg-[#121212] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">
        Add Students
      </h1>

      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-white text-xl animate-pulse">Submitting...</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col items-center gap-4">
          <label className="text-white font-medium w-full md:w-40">
            Profile Image
          </label>
          <input
            type="file"
            accept="image/jpeg"
            ref={fileInputRef}
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-white bg-black p-2 border border-gray-600 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-secondary)] file:text-black hover:file:bg-[var(--color-tertiary)]"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Team</label>
            {sameTeam ? (
              <input
                type="text"
                value={sameTeam?.teamName}
                readOnly
                className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              />
            ) : (
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                defaultValue=""
                required
                className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
              >
                <option value="" hidden disabled>
                  Select a team
                </option>
                {teamFormDB.teamName.map((team, i) => (
                  <option key={i} value={team._id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            )}
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
                Select a zone
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
              pattern="\d*"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              maxLength={4}
              placeholder="Enter student ID"
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-white font-medium mb-1">Student Name</label>
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
          type="submit"
          className="w-full mt-2 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          disabled={isSubmitting}
        >
          {isStudentLoading ? `Adding ${name} ` : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
