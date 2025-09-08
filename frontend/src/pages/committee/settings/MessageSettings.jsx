import React, { useState } from "react";
import { IoCaretBack } from "react-icons/io5";
import { useSendMessagesMutation } from "../../../redux/api/customApi";
import { toast } from "react-toastify";
const MessageSettings = ({ settingsToggle }) => {
  const [messageSubject, setMessageSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messageTo, setMessageTo] = useState("");

  const [newMessage, { isLoading }] = useSendMessagesMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await newMessage({
        message,
        messageTo,
        notificationTitle: messageSubject,
      }).unwrap();
      toast.success("Message sent successfully", { position: "bottom-right" });
      setMessage("");
      setMessageTo("");
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
            Message Settings
          </h1>
        </div>
        <p className="leading-5 pt-3 text-center animate-pulse">
          Send Updates and details to the Teams or Students
        </p>
      </div>
      <form
        onSubmit={submitHandler}
        className="flex mt-5 w-[75%]  flex-col space-y-4 "
      >
        <div className="flex flex-col w-full space-y-3">
          <input
            value={messageSubject}
            onChange={(e) => setMessageSubject(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            placeholder="Enter message title"
          ></input>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
            rows={10}
            placeholder="Enter message here..."
          ></textarea>
          <select
            value={messageTo}
            onChange={(e) => setMessageTo(e.target.value)}
            defaultValue=""
            required
            className="w-full mt-4 p-2 rounded-lg bg-black text-white border border-gray-600 focus:ring-2 focus:ring-[var(--color-secondary)] focus:outline-none"
          >
            <option value="" hidden disabled>
              Select recipient
            </option>
            <option value="team">Teams</option>
            <option value="all">All</option>
          </select>
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

export default MessageSettings;
