import React, { useState, useRef, useEffect } from "react";
import { SlArrowLeftCircle, SlPeople } from "react-icons/sl";
import { MdOutlineGroupAdd } from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { SiGoogleforms } from "react-icons/si";
import { RiLetterSpacing2 } from "react-icons/ri";
import { GrAchievement, GrGroup } from "react-icons/gr";
import { GiAchievement } from "react-icons/gi";
import { FaPenToSquare } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";
import { logOut } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../redux/api/authApi";
import { BeatLoader } from "react-spinners";

const adminItems = (toggleSidebar) => [
  {
    icon: <LuLayoutDashboard className="text-[#DAD6D1] text-2xl" />,
    text: "Dashboard",
    path: "/dashboard",
    onClick: toggleSidebar,
  },
  {
    icon: <GrGroup className="text-[#DAD6D1] text-2xl" />,
    text: "Teams",
    path: "/committee/addteams",
    onClick: toggleSidebar,
  },
  {
    icon: <MdOutlineGroupAdd className="text-[#DAD6D1] text-2xl" />,
    text: "Zone",
    path: "/committee/addzone",
    onClick: toggleSidebar,
  },
  { icon: <SlPeople className="text-[#DAD6D1] text-2xl" />, text: "Students" },
  {
    icon: <GoTasklist className="text-[#DAD6D1] text-2xl" />,
    text: "Programs",
  },
  {
    icon: <SiGoogleforms className="text-[#DAD6D1] text-2xl" />,
    text: "Forms",
  },
  {
    icon: <RiLetterSpacing2 className="text-[#DAD6D1] text-2xl" />,
    text: "Code Letter",
  },
  {
    icon: <FaPenToSquare className="text-[#DAD6D1] text-2xl" />,
    text: "Marks",
  },
  {
    icon: <GiAchievement className="text-[#DAD6D1] text-2xl" />,
    text: "Results",
  },
  {
    icon: <GrAchievement className="text-[#DAD6D1] text-2xl" />,
    text: "Achievements",
  },
];

const menuItems = (toggleSidebar) => [
  {
    icon: <LuLayoutDashboard className="text-[#DAD6D1] text-2xl" />,
    text: "Dashboard",
    path: "/dashboard",
    onClick: toggleSidebar,
  },
  { icon: <SlPeople className="text-[#DAD6D1] text-2xl" />, text: "Students" },
  {
    icon: <GoTasklist className="text-[#DAD6D1] text-2xl" />,
    text: "Programs",
  },
  {
    icon: <GiAchievement className="text-[#DAD6D1] text-2xl" />,
    text: "Results",
  },
  {
    icon: <GrAchievement className="text-[#DAD6D1] text-2xl" />,
    text: "Achievements",
  },
];

const profileItems = (toggleSidebar) => [
  {
    icon: <LuLayoutDashboard className="text-[#DAD6D1] text-2xl" />,
    text: "Dashboard",
    path: "dashboard",
    onClick: toggleSidebar,
  },
  {
    icon: <SlPeople className="text-[#DAD6D1] text-2xl" />,
    text: "Profile",
    path: "profile",
    onClick: toggleSidebar,
  },
  {
    icon: <GoTasklist className="text-[#DAD6D1] text-2xl" />,
    text: "Programs",
    path: "program",
    onClick: toggleSidebar,
  },
  {
    icon: <GiAchievement className="text-[#DAD6D1] text-2xl" />,
    text: "Results",
    path: "result",
    onClick: toggleSidebar,
  },
];

const menuDropdowns = (isAdmin) => ({
  Students: [
    { to: "addstudent", text: "Add Student" },
    { to: "viewstudent", text: "View Student" },
    { to: "idcard", text: "ID Card" },
  ],
  Programs: [
    ...(isAdmin
      ? [{ to: "committee/createprogram", text: "Create Programs" }]
      : []),
    { to: "programlist", text: "Program List" },
    { to: "addprograms", text: "Add Programs" },
    { to: "viewprogram", text: "View Program wise" },
    { to: "viewprogramsstudentwise", text: "View Student wise" },
  ],
  Forms: [
    { to: "committee/calllist", text: "Call list" },
    { to: "committee/evaluation", text: "Evaluation Form" },
  ],
  "Code Letter": [
    { to: "committee/addcodeletter", text: "Add Code Letter" },
    { to: "committee/viewcodeletter", text: "View Code Letter" },
  ],
  Marks: [
    { to: "committee/addscore", text: "Add Marks" },
    { to: "committee/viewscore", text: "View Marks" },
  ],
  Results: [
    ...(isAdmin
      ? [
          { to: "committee/declareresults", text: "Declare Results" },
          { to: "committee/declaredresults", text: "Declared Results" },
        ]
      : []),
    { to: "specifiedresults", text: "Show Specified" },
    { to: "allresults", text: "Show All" },
  ],
  Achievements: [
    { to: "teamscore", text: "Team Score" },
    { to: "scorebyzone", text: "Student Score" },
    { to: "studentscore", text: "All Student Score" },
  ],
});

const Sidebar = ({ setIsActives }) => {
  const sidebarRef = useRef(null);
  const buttonRef = useRef(null);
  const profileRef = useRef(null);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const [profilePopupVisible, setProfilePopupVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user || null;
  const isAdmin = user?.user?.isAdmin;
  const id = user?.user?._id;

  const forceProfileMenu = useSelector(
    (state) => state.profileMode.forceProfileMode
  );

  let menus;
  if (forceProfileMenu) {
    menus = profileItems(() => setSideBarOpen(false));
  } else if (user) {
    menus = isAdmin
      ? adminItems(() => setSideBarOpen(false))
      : menuItems(() => setSideBarOpen(false));
  }

  const dropdowns = menuDropdowns(isAdmin);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setSideBarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleProfileOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfilePopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleProfileOutside);
    return () =>
      document.removeEventListener("mousedown", handleProfileOutside);
  }, []);

  const logOutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      toast.success("Logout successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={() => setSideBarOpen((prev) => !prev)}
      >
        {!sideBarOpen ? (
          <div className="space-y-1.5 bg-[#13F287] p-2 rounded-e-2xl pr-4">
            <div className="w-7 h-0.5 bg-black"></div>
            <div className="w-5 h-0.5 bg-black"></div>
            <div className="w-7 h-0.5 bg-black"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-[#13F287] p-4 rounded-e-2xl pr-8">
            <div className="w-7 h-1 rounded-lg bg-black rotate-45 absolute"></div>
            <div className="w-7 h-1 bg-black rounded-lg -rotate-45 absolute"></div>
          </div>
        )}
      </button>
      <aside
        ref={sidebarRef}
        className={`fixed h-[100dvh] bg-[#121212] transition-all duration-300 ease-in-out z-20
          ${
            isActive
              ? "w-[80vw] sm:w-screen md:w-[30vw] lg:w-[22vw] xl:w-[16vw]"
              : "w-[75px]"
          }
          ${!sideBarOpen ? "hidden lg:block" : ""}
        `}
      >
        <header className="hidden lg:flex items-center justify-between h-[4rem] bg-[#0a0e03]">
          <button
            onClick={() => setIsActive((prev) => !prev)}
            className="h-14 w-14 flex items-center justify-center"
          >
            <h1 className="text-3xl font-bold ml-3 text-[#13F287]">R</h1>
          </button>
          <button
            onClick={() => setIsActive((prev) => !prev)}
            className={`${
              isActive
                ? "text-[#13F287] text-2xl mr-4 hidden lg:block"
                : "hidden"
            }`}
          >
            <SlArrowLeftCircle />
          </button>
        </header>
        <div className="flex flex-col mt-[10dvh] h-[90dvh] lg:h-[88dvh] lg:mt-0 justify-between overflow-auto scrollbar-hide">
          <nav className="h-full flex flex-col overflow-auto scrollbar-hide">
            <ul className="p-4 flex flex-col space-y-2">
              {menus.map((item, idx) => (
                <li key={idx} className="flex flex-col">
                  <Link to={item.path || "#"}>
                    <button
                      className="flex items-center w-full p-2 hover:bg-[#000000] rounded-lg transition-colors duration-200"
                      onClick={
                        item.onClick ||
                        (() =>
                          setExpandedMenu(expandedMenu === idx ? null : idx))
                      }
                    >
                      {item.icon}
                      <span
                        className={`text-[#DAD6D1] text-sm lg:text-base ml-2 ${
                          !isActive ? "hidden" : ""
                        }`}
                      >
                        {item.text}
                      </span>
                    </button>
                  </Link>
                        
                  {expandedMenu === idx && dropdowns[item.text] && (
                    <div
                      className={`ml-8 mt-2 bg-[#000000] p-2 rounded shadow-lg ${
                        !isActive ? "hidden" : ""
                      }`}
                    >
                      <ul className="space-y-2">
                        {dropdowns[item.text].map((sub, i) => (
                          <Link to={sub.to} key={i}>
                            <li
                              onClick={() => setSideBarOpen(false)}
                              className="text-[#DAD6D1] hover:text-gray-300 cursor-pointer mt-4 first:mt-2"
                            >
                              {sub.text}
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          {user && (
            <button
              onClick={() => setProfilePopupVisible((prev) => !prev)}
              className={`${
                forceProfileMenu ? "hidden" : ""
              } bg-[#13F287] p-2 h-12 w-[80%] mx-auto mb-4 rounded-lg text-[#121212] hover:bg-[#29b870] truncate`}
            >
              <div className="flex gap-4 justify-between p-1 items-center">
                <div className="flex gap-2 items-center">
                  <CgProfile className="text-2xl ml-2" />
                  <span className={`text-xl ${!isActive ? "hidden" : ""}`}>
                    {user?.user?.teamName}
                  </span>
                </div>
                <span>
                  <FaSignOutAlt
                    className={`${!isActive ? "hidden" : ""} text-2xl`}
                  />
                </span>
              </div>
            </button>
          )}

          <div
            ref={profileRef}
            className={`absolute bottom-20 left-1/2 z-50 bg-[#121212] border rounded-lg shadow-lg transition-all duration-300 p-3 cursor-pointer text-[#DAD6D1] ${
              profilePopupVisible
                ? "opacity-100 visible"
                : "opacity-0 invisible"
            }`}
          >
            {user && isAdmin ? (
              <ul>
                <li className="p-2 rounded-lg hover:bg-[#13F287] hover:text-black transition-colors duration-200">
                  <Link to={`/committee/profile/${id}`}>Profile</Link>
                </li>
                <li
                  onClick={() => setIsActives(true)}
                  className="p-2 rounded-lg hover:bg-[#13F287] hover:text-black transition-colors duration-200"
                >
                  Settings
                </li>
                <li
                  onClick={logOutHandler}
                  className="p-2 rounded-lg hover:bg-[#13F287] hover:text-black transition-colors duration-200"
                >
                  {logoutLoading ? (
                    <span className="animate-pulse">
                      <BeatLoader />
                    </span>
                  ) : (
                    "Signout"
                  )}
                </li>
              </ul>
            ) : user ? (
              <ul className="space-y-2">
                <li
                  onClick={logOutHandler}
                  className="p-2 rounded-lg hover:bg-[#13F287] hover:text-black transition-colors duration-200"
                >
                  {logoutLoading ? (
                    <span className="animate-pulse">
                      <BeatLoader />
                    </span>
                  ) : (
                    "Signout"
                  )}
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
