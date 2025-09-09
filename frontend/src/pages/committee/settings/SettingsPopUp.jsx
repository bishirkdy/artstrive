import React, { useState } from "react";
import { IoCloseSharp, IoSettingsOutline } from "react-icons/io5";
import { FaPenToSquare } from "react-icons/fa6";
import { TbClockStop } from "react-icons/tb";
import { RiMessage3Line } from "react-icons/ri";
import { BiSolidCreditCard } from "react-icons/bi";
// import { MdConfirmationNumber } from "react-icons/md";

import MarkSettings from "./MarkSettings";
import MessageSettings from "./MessageSettings";
import IdCardEdit from "./IdCardEdit";
// import { useStageCountMutation } from "../../../redux/api/customApi";
// import { useShowLimitsQuery } from "../../../redux/api/customApi";
// import { toast } from "react-toastify";
import { Loader } from "../../../components/Loader";
import { useGetAllProgramQuery } from "../../../redux/api/programApi";
import { useViewZoneQuery } from "../../../redux/api/zoneApi";
import ErrorMessage from "../../../components/ErrorMessage";
import EditCodeLetter from "./EditCodeLetter";
import EditScore from "./EditScore";

const SettingsPopUp = ({ setIsActive }) => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  // const { data, isLoading , refetch : limitRefetch } = useShowLimitsQuery();

  const {
    data: programFromDB,
    isLoading: teamIsLoading,
    isError,
    error,
    refetch,
  } = useGetAllProgramQuery();
  const {
    data: zoneFromDB,
    isLoading: zoneIsLoading,
    isError: zoneIsError,
    error: zoneError,
  } = useViewZoneQuery();

  if (teamIsLoading || zoneIsLoading)
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <Loader />
      </div>
    );

  if (zoneIsError || isError) {
    const code = zoneError?.originalStatus || error?.originalStatus || "Error";
    const details =
      zoneError?.error ||
      zoneError?.data ||
      error?.error ||
      error?.data ||
      "Something went wrong";
    const title = zoneError?.status || error?.status || "Error fetching data";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-primary)]">
          <ErrorMessage code={code} title={title} details={details} />
      </div>
    );
  }
  const menuItems = [
    {
      title: "Add Mark",
      description: "Add mark to programs",
      icon: <FaPenToSquare className="text-2xl" />,
      component: (
        <MarkSettings
          settingsToggle={() => setSelectedComponent(null)}
          programFromDB={programFromDB}
          refetch={refetch}
          zoneFromDB={zoneFromDB}
        />
      ),
    },
    // {
    //   title: "Update Limit",
    //   description: "Modify existing limits",
    //   icon: <TbClockStop className="text-2xl" />,
    //   component: (
    //     <LimitSettings settingsToggle={() => setSelectedComponent(null)} limitRefetch={limitRefetch}/>
    //   ),
    // },
    {
      title: "Message",
      description: "Send information",
      icon: <RiMessage3Line className="text-2xl" />,
      component: (
        <MessageSettings settingsToggle={() => setSelectedComponent(null)} />
      ),
    },
    {
      title: "Id Card",
      description: "Make Id Card",
      icon: <BiSolidCreditCard className="text-2xl" />,
      component: (
        <IdCardEdit settingsToggle={() => setSelectedComponent(null)} />
      ),
    },
     {
      title: "Edit Code Letter",
      description: "Edit existing Code Letters",
      icon: <TbClockStop className="text-2xl" />,
      component: (
        <EditCodeLetter settingsToggle={() => setSelectedComponent(null)}/>
      ),
    },
     {
      title: "Edit Score",
      description: "Edit Marks",
      icon: <TbClockStop className="text-2xl" />,
      component: (
        <EditScore settingsToggle={() => setSelectedComponent(null)}/>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center h-[100dvh] justify-end overflow-y-auto scrollbar-hide">
      {selectedComponent ? selectedComponent : ""}
      <div
        className={`h-full ${
          selectedComponent ? "w-0" : "w-full"
        } lg:w-[25vw] md:w-[35vw] xl:w-[17vw] lg:border-l-2 md:border-l-2 border-black bg-[var(--color-primary)] shadow-lg 
        transition-transform duration-500 ease-in-out  relative`}
      >
        <header className="flex items-center justify-between p-4 bg-[var(--color-secondary)] text-black">
          <div className="flex items-center gap-2 text-lg">
            <IoSettingsOutline className="text-2xl" />
            <span>Settings</span>
          </div>
          <IoCloseSharp
            onClick={() => setIsActive(false)}
            className="text-2xl cursor-pointer hover:text-gray-700"
          />
        </header>

        <ul className="p-3 space-y-1 text-white">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setSelectedComponent(item.component)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-black cursor-pointer"
            >
              {item.icon}
              <div className="flex flex-row justify-between w-full">
                <div>
                  <span className="text-sm font-medium">{item.title}</span>
                  <p className="text-[10px] opacity-80">{item.description}</p>
                </div>
                {/* <div className="">{item.html}</div> */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsPopUp;
