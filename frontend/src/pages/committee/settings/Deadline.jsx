import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAddDeadLineMutation } from "../../../redux/api/customApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const Deadline = ({ settingsToggle }) => {
  const [messageSubject, setMessageSubject] = useState("");
  const [message, setMessage] = useState("");
  const [deadline, setDeadline] = useState(""); // will hold UTC ISO string
  const [deadlineOf, setDeadlineOf] = useState("");
  const [addDeadLine, { isLoading }] = useAddDeadLineMutation();

  // Convert local datetime-local to IST, then to UTC ISO string
  const handleDeadlineChange = (e) => {
    const localTime = e.target.value;
    // Interpret as local time, convert to IST, then get UTC ISO string
    const istDate = dayjs(localTime).tz("Asia/Kolkata");
    setDeadline(istDate.utc().format());
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addDeadLine({ messageSubject, message, deadline, deadlineOf }).unwrap();
      toast.success("deadline sent successfully", { position: "bottom-right" });
      setMessage("");
      setMessageSubject("");
      setDeadline("");
      setDeadlineOf("");
    } catch (error) {
      toast.error(error.message || error.data?.message || "Failed to send message", {
        position: "bottom-right", autoClose: 3000
      });
    }
  };
  return (
    <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)]">
      <div className="p-4 text-white  flex flex-col items-center">
        <div className="flex w-full items-center md:justify-center pl-1 gap-1">
          <IoCaretBack
            onClick={settingsToggle}
            className="text-2xl md:hidden"
          />
          <h1 className="text-white text-2xl font-bold mt-1">
            Deadline Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
            Set deadlines for students or programs and notify teams
        </p>
      </div>
      <form
        onSubmit={submitHandler}
        className="flex mt-5 w-[75%] flex-col space-y-4 "
      >
        <div className="flex flex-col w-full space-y-3">
          <select
            value={deadlineOf}
            onChange={(e) => setDeadlineOf(e.target.value)}
            defaultValue=""
            required
            className="w-full mt-4 p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          >
            <option value="" hidden disabled>
              Select recipient
            </option>
            <option value="student-deadline">Student adding deadline</option>
            <option value="program-deadline">Program adding deadline</option>
            <option value="score-deadline">deadline for showing scores</option>
          </select>
          <input
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            placeholder="Enter message title"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            rows={10}
            placeholder="Enter message here..."
          />
          <input
            type="datetime-local"
            onChange={handleDeadlineChange}
            required
            className="w-full mt-4 p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          />
        </div>
        <button
          className="w-full py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] text-black font-bold rounded-lg transition duration-300"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Deadline;