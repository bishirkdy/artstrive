// Bot.jsx
import React, { useRef, useState, useEffect } from "react";
import { socket } from "../bot/Socket";
import logo from '../../assets/logo.png'

export default function Bot() {
  const defaultMessages = [
    "Programs",
    "Results",
    "Team Score",
    "Student Score",
  ];
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
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

    setChat((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");

    if (msg === "Programs" || msg === "Results") {
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
    } else if (msg === "Team Score") {
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
    } else if (msg === "Student Score") {
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
          {
            from: "bot",
            text: "Please select student Zone",
            studentZone: studentZone,
          },
        ]);
      });
    } else {
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `You clicked: ${msg}, this is not in my dataset , this is limited for only art strive😭 . If you have any suggestion connect to imad student official team or connect in irad_hidaya_palazhi in social platform💕💕👍`,
        },
      ]);
    }
  };

  const handleZoneClick = (zone) => {
    setChat((prev) => [...prev, { from: "user", text: zone.zone }]);
    setLoading(true);
    socket.emit("getZonePrograms", zone._id, (res) => {
      setLoading(false);
      const programsArr = Array.isArray(res?.data?.data) ? res.data.data : [];
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

  const handleStudentScoreClick = (zone) => {
    setChat((prev) => [...prev, { from: "user", text: zone.zone }]);
    setLoading(true);
    socket.emit("getStudentScore", zone._id, (res) => {
      setLoading(false);
      const studentsScore = Array.isArray(res?.data?.data) ? res.data.data : [];
      console.log(studentsScore);

      if (!studentsScore.length) {
        setChat((prev) => [
          ...prev,
          { from: "bot", text: `No students score added in ${zone.zone}` },
        ]);
        return;
      }
      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Programs in ${zone.zone}:`,
          studentsScore: studentsScore,
        },
      ]);
    });
  };

  const handleResultClick = (program) => {
    setChat((prev) => [...prev, { from: "user", text: program.name }]);
    setLoading(true);

    socket.emit("getProgramResult", program._id, (res) => {
      setLoading(false);

      const programScore = Array.isArray(res?.data?.data) ? res.data.data : [];
      console.log(programScore);

      if (!programScore.length) {
        setChat((prev) => [
          ...prev,
          { from: "bot", text: `No program declared` },
        ]);
        return;
      }

      setChat((prev) => [
        ...prev,
        {
          from: "bot",
          text: `Result of ${program.zone.zone}`,
          programScore: programScore,
        },
      ]);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col lg:flex-row">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-black/60 backdrop-blur-md border-r border-gray-800 p-4 transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-64`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Art Strive</h2>
            <p className="text-xs text-gray-400">Kindle the soul</p>
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-white/5"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-800/40 p-3 rounded-lg">
            <label className="text-xs text-gray-400">Model</label>
            <input
              type="text"
              readOnly
              placeholder="Art Strive bot"
              className="focus-none outline-none w-full mt-2 bg-transparent border border-gray-700 rounded-md p-2 text-sm"
            />
          </div>

          <div className="bg-gray-800/40 p-3 rounded-lg">
            <h3 className="text-sm font-medium">Saved prompts</h3>
            <ul className="mt-2 text-sm text-gray-300 space-y-2">
              {defaultMessages.map((m, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded hover:bg-white/5 cursor-pointer"
                  onClick={() => handleClick(m)}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col relative">
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          {/* Left: Profile */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Profile"
              className="w-10 h-10 rounded-full object-contain"
            />
            <div className="flex flex-col">
              <span className="text-white font-medium">Art strive</span>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>

        <div
          ref={listRef}
          className="flex-1 overflow-auto scrollbar-hide p-4 flex flex-col gap-4"
          style={{ paddingBottom: "80px" }}
        >
          {chat.map((msg, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`p-3 rounded-lg ${
                  msg.from === "user"
                    ? "ml-auto bg-indigo-600"
                    : "mr-auto bg-gray-800"
                }`}
                style={{ maxWidth: "calc(100% - 1rem)" }}
              >
                <p>{msg.text}</p>

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

                {msg.zones &&
                  msg.zones.map((z) => (
                    <button
                      key={z._id}
                      onClick={() => handleZoneClick(z)}
                      className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-800 text-xs mt-2 mr-1"
                    >
                      {z.zone}
                    </button>
                  ))}
                {msg.studentZone &&
                  msg.studentZone.map((z) => (
                    <button
                      key={z._id}
                      onClick={() => handleStudentScoreClick(z)}
                      className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-800 text-xs mt-2 mr-1"
                    >
                      {z.zone}
                    </button>
                  ))}

                {msg.programs && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.programs.map((p) => (
                      <button
                        onClick={() => handleResultClick(p)}
                        key={p._id}
                        className="px-4 py-2 rounded-md bg-[var(--color-secondary)] text-white text-xs hover:opacity-80"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {loading && msg.from === "bot" && (
                  <div className="flex gap-1 mt-2">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-150">.</span>
                    <span className="animate-bounce delay-300">.</span>
                  </div>
                )}
              </div>

              {msg.score && (
                <div className="w-full flex justify-center">
                  <div className="space-y-4 mt-2 w-full max-w-3xl">
                    {msg.score.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
                      >
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-[var(--color-secondary)] mr-4 w-8 text-center">
                            {i + 1}
                          </span>
                          <h3 className="text-lg text-white font-medium">
                            {s.teamName}
                          </h3>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xl font-bold text-[var(--color-secondary)] bg-white/10 px-3 py-1 rounded-lg">
                            {s.totalScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.studentsScore && (
                <div className="w-full flex justify-center">
                  <div className="space-y-4 mt-2 w-full max-w-3xl">
                    {msg.studentsScore.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
                      >
                        <div className="flex flex-col items-start mr-4">
                          <span className="text-sm text-gray-400">
                            #{i + 1}
                          </span>
                          <span className="text-xs text-gray-300">
                            ID: {s.id}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-lg text-white font-medium">
                            {s.name}
                          </h3>
                          <span className="text-sm text-gray-300">
                            Team: {s.team}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="text-xl font-bold text-[var(--color-secondary)] bg-white/10 px-3 py-1 rounded-lg">
                            {s.totalScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {msg.programScore && (
                <div className="w-full flex justify-center">
                  <div className="space-y-4 mt-2 w-full max-w-3xl">
                    {msg.programScore.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20"
                      >
                        {/* Left column - rank */}
                        <div className="flex flex-col items-start mr-4 min-w-[80px]">
                          <span className="text-sm text-gray-400">
                            {p.rank}
                          </span>
                          <span className="text-xs text-gray-300">
                            {p.codeLetter}
                          </span>
                        </div>

                        {/* Middle column */}
                        <div className="flex flex-col flex-1">
                          <h3 className="text-lg text-white font-medium truncate">
                            {p.student?.name}
                          </h3>
                          <span className="text-sm text-gray-300">
                            Team: {p.student?.team?.teamName}
                          </span>
                          <span className="text-sm text-gray-400">
                            Program: {p.program?.name}
                          </span>
                        </div>

                        {/* Right column - score */}
                        <div className="flex items-center min-w-[60px] justify-end">
                          <span className="text-xl font-bold text-[var(--color-secondary)] bg-white/10 px-3 py-1 rounded-lg">
                            {p.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.from === "bot" && idx !== 0 && (
                <div className="flex justify-start">
                  <button
                    onClick={resetChat}
                    className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-800 text-xs mt-1"
                  >
                    Home
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-black/80 z-50 lg:left-64">
          <div className="flex gap-3 justify-between items-center w-full">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Type a message..."
              className="flex-1 resize-none rounded-xl bg-transparent border border-gray-700 p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleClick(input)}
              className="px-4 py-3 rounded-md bg-[var(--color-secondary)] hover:opacity-95 text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
