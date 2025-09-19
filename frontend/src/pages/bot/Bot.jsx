// Bot.jsx
import React, { useRef, useState, useEffect } from "react";
import { socket } from "../bot/Socket";
import logo from "../../assets/logo.png";

export default function Bot() {
  const defaultMessages = [
    "Results",
    "Team Score",
    "Student Score",
    "About Strive",
  ];

  const ABOUT_TEXT =
    "ART STRIVE is a celebration of Islamic culture, creativity, and expression. This vibrant festival brings together talents from all walks of life to participate in a diverse range of competitions, both on stage and off. From powerful speeches and captivating songs to a variety of artistic and intellectual challenges, ART STRIVE is a platform for showcasing the beauty of Islamic art and culture. Whether you're competing or cheering from the audience, this event is sure to inspire and kindle the soul. Come be a part of a journey that deciphers cultural codes through the universal language of art.";

  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const endRef = useRef(null);

  // Auto scroll to last message
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [chat, loading]);

  const resetChat = () => {
    setChat([
      { from: "bot", text: "Select an option:", buttons: defaultMessages },
    ]);
    setInput("");
  };

  useEffect(() => {
    resetChat();
  }, []);

  const handleClick = (msg) => {
    if (!msg) return;
    if (msg === "About Strive") {
      handleAboutClick();
      return;
    }
    setInput(msg);
  };

  const typeWriter = async (fullText, speed = 16) => {
    const id = `tw-${Date.now()}-${Math.random()}`;
    setChat((prev) => [...prev, { id, from: "bot", text: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => setTimeout(r, speed));
      setChat((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, text: (m.text || "") + fullText[i] } : m
        )
      );
    }
  };

  const handleAboutClick = () => {
    setChat((prev) => [...prev, { from: "user", text: "About Strive" }]);
    typeWriter(ABOUT_TEXT, 18);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const msg = input.trim();
    const normalized = msg.toLowerCase();

    setChat((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");

    if (normalized === "results") {
      setLoading(true);
      socket.emit("getZones", (res) => {
        setLoading(false);
        const zonesArr = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (!zonesArr.length) {
          setChat((prev) => [
            ...prev,
            { from: "bot", text: res?.message || "No zones found" },
          ]);
          return;
        }
        setChat((prev) => [
          ...prev,
          { from: "bot", text: "Please select a zone:", zones: zonesArr },
        ]);
      });
    } else if (normalized === "team score") {
      setLoading(true);
      socket.emit("getTeamScore", (res) => {
        setLoading(false);
        const teamsScore = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (!teamsScore.length) {
          setChat((prev) => [
            ...prev,
            { from: "bot", text: "No Score declared" },
          ]);
          return;
        }
        setChat((prev) => [
          ...prev,
          { from: "bot", text: "Teams Scores", score: teamsScore },
        ]);
      });
    } else if (normalized === "student score") {
      setLoading(true);
      socket.emit("getStudentsZones", (res) => {
        setLoading(false);
        const studentZone = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (!studentZone.length) {
          setChat((prev) => [
            ...prev,
            { from: "bot", text: "No Score declared" },
          ]);
          return;
        }
        setChat((prev) => [
          ...prev,
          { from: "bot", text: "Please select student Zone", studentZone },
        ]);
      });
    } else if (normalized === "about strive") {
      handleAboutClick();
    } else {
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `You typed: ${msg}. This bot only supports Results, Team Score, Student Score, About Strive.`,
        },
      ]);
    }
  };

  // Handle zone click -> show programs
  const handleZoneClick = async (zone) => {
    setChat((prev) => [...prev, { from: "user", text: zone.zone }]);
    setLoading(true);

    socket.emit("getZonePrograms", zone._id, (programsRes) => {
      setLoading(false);
      const programsArr = Array.isArray(programsRes?.data?.data)
        ? programsRes.data.data
        : [];
      if (!programsArr.length) {
        setChat((prev) => [
          ...prev,
          { from: "bot", text: `No programs in ${zone.zone}` },
        ]);
        return;
      }
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Programs in ${zone.zone}:`,
          programs: programsArr,
        },
      ]);
    });
  };

  // Handle program click -> show results
  const handleProgramClick = (program) => {
    setChat((prev) => [...prev, { from: "user", text: program.name }]);
    setLoading(true);

    socket.emit("getProgramResult", program._id, (res) => {
      setLoading(false);
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      if (!data.length) {
        setChat((prev) => [
          ...prev,
          {
            from: "bot",
            text: `No result declared for ${program.name}.`,
            noResult: true,
          },
        ]);
        return;
      }
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Results for ${program.name}:`,
          programResult: data,
        },
      ]);
    });
  };

  const handleStudentScoreClick = (zone) => {
    setChat((prev) => [...prev, { from: "user", text: zone.zone }]);
    setLoading(true);
    socket.emit("getStudentScore", zone._id, (res) => {
      setLoading(false);
      const studentsScore = Array.isArray(res?.data?.data) ? res.data.data : [];
      if (!studentsScore.length) {
        setChat((prev) => [
          ...prev,
          { from: "bot", text: `No students score in ${zone.zone}` },
        ]);
        return;
      }
      setChat((prev) => [
        ...prev,
        { from: "bot", text: `Scores in ${zone.zone}:`, studentsScore },
      ]);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-black/50 backdrop-blur-lg border-r border-gray-800 p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-64`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold tracking-wide">Art Strive</h2>
            <p className="text-xs text-gray-400">Kindle the soul</p>
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/5"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/40 p-3 rounded-xl">
            <label className="text-xs text-gray-400">Model</label>
            <input
              type="text"
              readOnly
              placeholder="Art Strive bot"
              className="w-full mt-2 bg-transparent border border-gray-700 rounded-lg p-2 text-sm"
            />
          </div>

          <div className="bg-gray-800/40 p-3 rounded-xl">
            <h3 className="text-sm font-medium">Quick Actions</h3>
            <ul className="mt-2 text-sm text-gray-300 space-y-2">
              {defaultMessages.map((m, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded-lg hover:bg-indigo-600 hover:text-white cursor-pointer transition"
                  onClick={() => handleClick(m)}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 lg:ml-64 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-gray-800/60 border-b border-gray-700 backdrop-blur-md">
          <img
            src={logo}
            alt="Profile"
            className="w-10 h-10 rounded-full object-contain"
          />
          <div className="flex flex-col">
            <span className="text-white font-medium">Art Strive Bot</span>
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>

        {/* Chat Area */}
        <div
          ref={listRef}
          className="flex-1 overflow-auto scrollbar-hide p-4 space-y-6"
          style={{ paddingBottom: "140px" }}
        >
          {chat.map((msg, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`p-3 rounded-xl shadow-md ${
                  msg.from === "user"
                    ? "ml-auto bg-indigo-600 text-white max-w-fit"
                    : "mr-auto bg-gray-800/70 border border-gray-700 max-w-[90%]"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                {/* Buttons */}
                {msg.buttons &&
                  msg.buttons.map((b, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(b)}
                      className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-800 text-xs mt-2 mr-1"
                    >
                      {b}
                    </button>
                  ))}

                {/* Zones */}
                {msg.zones &&
                  msg.zones.map((z) => (
                    <button
                      key={z._id}
                      onClick={() => handleZoneClick(z)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-800 text-xs mt-2 mr-1"
                    >
                      {z.zone}
                    </button>
                  ))}

                {/* Student Zones */}
                {msg.studentZone &&
                  msg.studentZone.map((z) => (
                    <button
                      key={z._id}
                      onClick={() => handleStudentScoreClick(z)}
                      className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-800 text-xs mt-2 mr-1"
                    >
                      {z.zone}
                    </button>
                  ))}

                {/* Programs */}
                {msg.programs &&
                  msg.programs.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => handleProgramClick(p)}
                      className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-800 text-xs mt-2 mr-1"
                    >
                      {p.name}
                    </button>
                  ))}

                {/* Team Scores */}
                {msg.score && (
                  <div className="mt-2">
                    <ul className="text-xs space-y-1">
                      {msg.score.map((s, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{s.teamName || s.team}</span>
                          <span className="font-medium">{s.score ?? "-"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Student Scores */}
                {msg.studentsScore && (
                  <div className="mt-2">
                    <ul className="text-xs space-y-1">
                      {msg.studentsScore.map((s, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{s.name || s.studentName}</span>
                          <span className="font-medium">{s.score ?? "-"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {msg.programResult?.length > 0 && (
  <div className="mt-4 space-y-4">
    <div className="bg-gray-900/70 border border-gray-700 rounded-2xl p-4 shadow-md">
      <h3 className="text-lg font-bold text-indigo-400 mb-3">
        {msg.programResult[0]?.program?.name || "Program Results"}
      </h3>

      {/* Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {msg.programResult
          .filter((it) => it.score && it.score > 0) // only show students with score > 0
          .map((it) => {
            let rankBadge = "-";

            switch (it.rank) {
              case "first":
                rankBadge = "🥇";
                break;
              case "second":
                rankBadge = "🥈";
                break;
              case "third":
                rankBadge = "🥉";
                break;
              default:
                rankBadge = it.rank || "-";
            }

            return (
              <div
                key={it._id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 flex flex-col shadow-sm hover:scale-105 transform transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">
                    {it.student?.name}
                  </span>
                  <span className="text-sm">{rankBadge}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">
                  ID: {it.student?.id}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Team: {it.student?.team?.teamName}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Zone: {it.student?.zone?.zone}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-indigo-600 rounded-full text-xs font-medium">
                    Score: {it.score ?? "-"}
                  </span>
                  <span className="px-2 py-1 bg-green-600 rounded-full text-xs font-medium">
                    Code: {it.codeLetter || "-"}
                  </span>
                  <span className="px-2 py-1 bg-yellow-500 rounded-full text-xs font-medium">
                    Grade: {it.grade || "-"}
                  </span>
                  <span className="px-2 py-1 bg-pink-500 rounded-full text-xs font-medium">
                    Total: {it.totalScore || "-"}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  </div>
)}


                {/* No Result Message */}
                {msg.noResult && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠ No result declared yet
                  </p>
                )}
              </div>
            </React.Fragment>
          ))}

          {/* Loader */}
          {loading && (
            <div className="mr-auto bg-gray-800/70 border border-gray-700 p-3 rounded-xl max-w-[65%]">
              <div className="flex gap-1 text-lg">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </div>
            </div>
          )}

          {/* Home Reset */}
          {chat.length > 0 && chat[chat.length - 1].from === "bot" && (
            <div className="flex justify-center mt-4">
              <button
                onClick={resetChat}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-medium shadow-md hover:opacity-90 transition"
              >
                ⬅ Home
              </button>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black/80 backdrop-blur-lg z-50 lg:left-64">
          <div className="flex gap-3 items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), handleSend())
              }
              rows={1}
              placeholder="Type a message..."
              className="flex-1 resize-none rounded-xl bg-transparent border border-gray-700 p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
