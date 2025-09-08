// import React, { useState } from "react";
// import { IoCaretBack } from "react-icons/io5";
// import { useAddLimitsMutation } from "../../../redux/api/customApi";
// import { toast } from "react-toastify";

// const LimitSettings = ({ settingsToggle  , limitRefetch}) => {
//     const [individualLimit, setIndividualLimit ] = useState("")
//     const [teamLimit, setTeamLimit ] = useState("")
//     const [groupLimit, setGroupLimit ] = useState("")
//     const [addLimit , { isLoading } ]= useAddLimitsMutation()
//     const submitHandler = async (e) => {
//       e.preventDefault();
      
//       const payload = {};
//       if (individualLimit) payload.individualLimit = Number(individualLimit);
//       if (teamLimit) payload.teamLimit = Number(teamLimit);
//       if (groupLimit) payload.groupLimitForTeam = Number(groupLimit);
    
//       if (Object.keys(payload).length === 0) {
//         toast.error("Please fill at least one limit field.");
//         return;
//       }
    
//       try {
//         await addLimit(payload).unwrap();
//         toast.success("Limit settings updated successfully", { position: "bottom-right" });
//         setIndividualLimit("");
//         setTeamLimit("");
//         setGroupLimit("");
//         limitRefetch();
//         settingsToggle();
//       } catch (error) {
//         toast.error(`Error adding limit settings: ${error?.data?.message || error.message}`);
//       }
//     };
//   return (
//     <div className="h-[100dvh] w-screen md:w-[50vw] lg:w-[40vw] xl:w-[30vw] flex flex-col items-center inset-0 lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)]">
//       <div className="p-4 text-white  flex flex-col items-center">
//         <div className="flex w-full items-center md:justify-center pl-1 gap-1">
//           <IoCaretBack
//             onClick={settingsToggle}
//             className="text-2xl md:hidden"
//           />
//           <h1 className="text-white text-2xl font-bold mt-1">
//             Limit's Settings
//           </h1>
//         </div>
//         <p className="leading-5 pt-3 text-center animate-pulse">
//           Default Individual Program Limit is 5 and team program limit is 5 and
//           team's general program limit 1
//         </p>
//       </div>

//       <form onSubmit={submitHandler} className="space-y-4 w-[90%]">
//         <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
//           <div className="flex w-full justify-between items-center">
//             <h3 className="text-lg text-white font-medium">Individual Program Limit</h3>
//             <input value={individualLimit} onChange={e => setIndividualLimit(e.target.value)} pattern="\d*" type="text"className="text-xl font-bold w-[15%] text-[#13F287] bg-white/10 px-3 py-1 rounded-lg" />
//           </div>
//         </div>

//         <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
//           <div className="flex w-full justify-between items-center">
//             <h3 className="text-lg text-white font-medium">Team Limit for each Program</h3>
//             <input value={teamLimit} onChange={e => setTeamLimit(e.target.value)} pattern="\d*" type="text"className="text-xl font-bold w-[15%] text-[#13F287] bg-white/10 px-3 py-1 rounded-lg" />
//           </div>
//         </div>

//         <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
//           <div className="flex w-full justify-between items-center">
//             <h3 className="text-lg text-white font-medium">Team Limit for Group</h3>
//             <input value={groupLimit} onChange={e => setGroupLimit(e.target.value)} pattern="\d*" type="text"className="text-xl font-bold w-[15%] text-[#13F287] bg-white/10 px-3 py-1 rounded-lg" />
//           </div>
//         </div>
//         <button
//           className="w-full mt-2 py-2 bg-[#13F287] hover:bg-[#7dcca6] text-black font-bold rounded-lg transition duration-300"
//           type="submit"
//         >
//           {isLoading ? "Saving..." : "Save Limits"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LimitSettings;
