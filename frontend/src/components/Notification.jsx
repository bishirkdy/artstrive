import React from 'react'
import { useGetMessageQuery } from '../redux/api/customApi'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { useSelector } from 'react-redux';
const Notification = () => {
    const { data, isLoading } = useGetMessageQuery()
    const {user} = useSelector((state) => state.auth);
    const isTeamOrAdmin = user?.user?.teamName;
    
    const finalNotification = isTeamOrAdmin ? data?.data : data?.data?.filter((d) => d.notificationOfTo === "all")
    if (isLoading) return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-white">Loading notifications...</h1>
      </div>
    )
  return (
   <div className="flex flex-col bg-[#111111] w-full rounded-2xl space-y-2 pb-6 shadow-lg transition-transform duration-300">
   
         { finalNotification.length > 0 ? ( 
         finalNotification.map((d, idx) => (
           <div key={d._id}>
             <div className="flex flex-col text-white items-start justify-between w-full px-2 py-1">
                <div className='flex flex-row justify-between w-full mb-2'>
                <h1 className=" max-w-[70%] text-base">
                   {d.notificationTitle}
               </h1>
               <span className="text-sm text-gray-200 animate-pulse">
                 {dayjs(d.notificationDate).fromNow()}
               </span>
                </div>
                <p className='text-sm opacity-80'>{d.notification}</p>

               
             </div>
             {idx < finalNotification.length - 1 && (
               <hr className="border-gray-700 mx-2" />
             )}
           </div>
         ))
        ) :
        (
          <h1 className="text-white/70 m-auto pt-5">Not available notifications</h1>
        )
        }
       </div>
  )
}

export default Notification