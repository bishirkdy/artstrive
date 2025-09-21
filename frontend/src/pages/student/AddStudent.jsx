import React, { useEffect, useState, useRef } from "react";
import { useAddStudentMutation } from "../../redux/api/studentApi";
import { useViewTeamsQuery } from "../../redux/api/authApi";
import { useViewZoneQuery } from "../../redux/api/zoneApi";
import { useStudentAddingDeadlineQuery } from "../../redux/api/customApi";
import { Loader } from "../../components/Loader";
import ErrorMessage from "../../components/ErrorMessage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { nowIST, toIST } from "../../utils/dayjsSetup";

const AddStudent = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [team, setTeam] = useState("");
  const [zone, setZone] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const teams = user?.user?.isAdmin === false;

  const { data: studentDeadlineData, isLoading, error, isError } =
    useStudentAddingDeadlineQuery();

  const [student, { isLoading: isStudentLoading }] = useAddStudentMutation();

  const { data: teamFormDB, isLoading: teamIsLoading, error: teamError, isError: teamIsError } =
    useViewTeamsQuery();
  const { data: zoneFromDB, isLoading: zoneIsLoading, error: zoneError, isError: zoneIsError } =
    useViewZoneQuery();

  const teamFromStore = user?.user?.teamName;
  const sameTeam =
    teamFormDB?.teamName && teamFromStore
      ? teamFormDB.teamName.find((t) => t.teamName === teamFromStore)
      : undefined;

  useEffect(() => {
    if (sameTeam && !team) setTeam(sameTeam._id);
  }, [sameTeam, team]);

  if (teamIsLoading || zoneIsLoading || isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <Loader />
      </div>
    );

  // Convert deadline to IST
  const currentDate = nowIST();
  const deadlineDate = studentDeadlineData?.data?.deadline
    ? toIST(studentDeadlineData.data.deadline)
    : null;

  if (teams && deadlineDate && deadlineDate.isBefore(currentDate)) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#121212]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Student Adding Deadline Closed
          </h1>
          <p className="text-white">The deadline for adding students has passed.</p>
          <p className="text-gray-400 mt-4">
            Deadline was: {deadlineDate.format("YYYY-MM-DD hh:mm A")} IST
          </p>
        </div>
      </div>
    );
  }

  if (teamIsError || zoneIsError || isError) {
    const code =
      teamError?.originalStatus || zoneError?.originalStatus || error?.originalStatus || "Error";
    const details =
      teamError?.error || zoneError?.error || error?.error || "Something went wrong";
    const title =
      teamError?.status || zoneError?.status || error?.status || "Error fetching data";
    return <ErrorMessage code={code} title={title} details={details} />;
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

      // reset form
      setId("");
      setName("");
      setTeam("");
      setZone("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      toast.success("Student added successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Error adding student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedZone = zoneFromDB.filter(
    (z) => !["GENERAL", "MIX ZONE", "CAT-A", "CAT-B"].includes(z.zone)
  );

  return (
    <div className="mx-auto lg:ml-[28vw] mt-[6rem] flex flex-col p-6 w-[90vw] md:max-w-2xl bg-[#121212] rounded-lg shadow-lg">
      <h1 className="text-white text-2xl font-semibold text-center mb-4">Add Students</h1>

      {deadlineDate && (
        <div className="text-center text-gray-400 mb-4">
          Deadline: {deadlineDate.format("YYYY-MM-DD hh:mm A")} IST
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col items-center gap-4">
          <label className="text-white font-medium w-full md:w-40">Profile Image</label>
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
                value={sameTeam.teamName}
                readOnly
                className="w-full p-2 rounded-lg bg-black text-white border border-gray-600"
              />
            ) : (
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
                className="w-full p-2 rounded-lg bg-black text-white border border-gray-600"
              >
                <option value="" hidden>
                  Select a team
                </option>
                {teamFormDB.teamName.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.teamName}
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
              required
              className="w-full p-2 rounded-lg bg-black text-white border border-gray-600"
            >
              <option value="" hidden>
                Select a zone
              </option>
              {selectedZone.map((z) => (
                <option key={z._id} value={z._id}>
                  {z.zone}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            maxLength={4}
            placeholder="Student ID"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student Name"
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg"
        >
          {isStudentLoading ? `Adding ${name}...` : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;