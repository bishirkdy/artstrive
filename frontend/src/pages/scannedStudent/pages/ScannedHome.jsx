import React from "react";
import { Loader } from "../../../components/Loader";
import { ArrowRight, Play, Star  } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { RiFacebookCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router";


const ScannedHome = () => {
  const buttons = [
    { id: 1, label: "Strive progress", icon: <Play size={18} /> , path : "dashboard" },
    { id: 2, label: "Who is i am", icon: <CgProfile  size={18} /> , path : "profile" },
    { id: 3, label: "Explore my program", icon: <MdOutlinePlaylistAddCheck size={18} />  , path : "program" },
    { id: 4, label: "Performance", icon: <Star size={18} /> , path : "result" },
    { id: 5, label: "Strive bot", icon: <ArrowRight size={18} /> , path : "/bot" },
  ];
  const navigate = useNavigate()
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-neutral-900 text-white flex items-center justify-center p-6">
      <section className="w-full max-w-5xl mx-auto">
        <div className="bg-gray-900/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 border border-white/6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-300">
                  Art Strive
                </span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl">
                ART STRIVE is a celebration of Islamic culture, creativity, and
                expression. This vibrant festival brings together talents from
                all walks of life to participate in a diverse range of
                competitions, both on stage and off. From powerful speeches and
                captivating songs to a variety of artistic and intellectual
                challenges, ART STRIVE is a platform for showcasing the beauty
                of Islamic art and culture. Whether you're competing or cheering
                from the audience, this event is sure to inspire and kindle the
                soul. Come be a part of a journey that deciphers cultural codes
                through the universal language of art.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 border border-white/6 hover:bg-white/8 transition"
                onClick={() =>navigate("/bot")}
              >
                <Play size={16} />
                Strive bot
              </button>

              <button
              onClick={() => navigate("result")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-indigo-500 shadow-md font-medium hover:scale-105 transform transition"
              >
                Performance
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {buttons.map((b) => (
              <button
                key={b.id}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl border shadow-sm bg-gradient-to-br from-white/3 to-white/2 border-white/5 hover:shadow-lg hover:-translate-y-1 transform transition"
                onClick={() => navigate(b.path)}
              >
                <span className="p-2 rounded-md bg-white/6">{b.icon}</span>
                <span className="text-sm font-semibold">{b.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400">
            <div>
              Join a community of art strive. Student update publish quickly.
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/irad_hidaya_palazhi" className="px-3 py-1 rounded-full bg-white/5 cursor-pointer"><FaInstagram/></a>
              <a href="https://www.facebook.com/profile.php?id=100063699746422&mibextid=ZbWKwL" className="px-3 py-1 rounded-full bg-white/5 cursor-pointer"><RiFacebookCircleLine/></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ScannedHome;
