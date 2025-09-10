import React from "react";
import { SlPeople } from "react-icons/sl";
import { RiPlayList2Fill } from "react-icons/ri";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlineEventSeat } from "react-icons/md";

const TopDashboard = ({ data }) => {
  return (
    <div className="flex flex-col flex-nowrap items-center justify-center md:ml-1 lg:flex-row gap-4 md:gap-6">
      <div className="flex flex-row flex-nowrap gap-2 md:gap-6">
        <div className="w-[43vw] lg:w-[12vw] h-[25vh] md:min-w-[140px] min-h-[110px] rounded-xl [background:radial-gradient(at_right_bottom,_rgba(205,157,47,0.3)_0%,_#121212_70%)] flex items-center justify-center transition-transform duration-300 hover:scale-105 ">
          <div className="flex flex-col items-center text-white font-semibold ">
            <SlPeople
              className="text-2xl md:text-4xl drop-shadow-md"
              aria-hidden="true"
            />
            <h1 className="text-2xl md:text-3xl font-extrabold mt-2">
              {data && `${data.students < 10 ? "0" : ""}${data.students}+`}
            </h1>
            <h1 className="text-xs md:text-sm uppercase tracking-widest opacity-95">
              Students
            </h1>
          </div>
        </div>

        <div className="w-[43vw] lg:w-[12vw] h-[25vh] md:min-w-[140px] min-h-[110px] rounded-xl [background:radial-gradient(at_right_bottom,_rgba(205,157,47,0.3)_0%,_#121212_70%)] flex items-center justify-center transition-transform duration-300 hover:scale-105 ">
          <div className="flex flex-col items-center text-white font-semibold">
            <RiPlayList2Fill
              className="text-4xl drop-shadow-md"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-extrabold mt-2">
              {data && `${data.program < 10 ? "0" : ""}${data.program}+`}
            </h1>
            <h1 className="text-sm uppercase tracking-widest opacity-95">
              Programs
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-nowrap gap-2 md:gap-6">
        <div className="w-[43vw] lg:w-[12vw] h-[25vh] md:min-w-[140px] min-h-[110px] rounded-xl [background:radial-gradient(at_right_bottom,_rgba(205,157,47,0.3)_0%,_#121212_70%)] flex items-center justify-center transition-transform duration-300 hover:scale-105 ">
          <div className="flex flex-col items-center text-white font-semibold">
            <RiTeamLine
              className="text-4xl drop-shadow-md"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-extrabold mt-2">
              {data && `${data.team < 10 ? "0" : ""}${data.team}`}
            </h1>{" "}
            <h1 className="text-sm uppercase tracking-widest opacity-95">
              Teams
            </h1>
          </div>
        </div>

        <div className="w-[43vw] lg:w-[12vw] h-[25vh] md:min-w-[140px] min-h-[110px] rounded-xl [background:radial-gradient(at_right_bottom,_rgba(205,157,47,0.3)_0%,_#121212_70%)] flex items-center justify-center transition-transform duration-300 hover:scale-105 ">
          <div className="flex flex-col items-center text-white font-semibold">
            <MdOutlineEventSeat
              className="text-4xl drop-shadow-md"
              aria-hidden="true"
            />
            <h1 className="text-3xl font-extrabold mt-2">6</h1>
            <h1 className="text-sm uppercase tracking-widest opacity-95">
              Venues
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDashboard;
