import React, { useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../redux/features/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/logo.png";
const Login = () => {
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    toast.dismiss();
    try {
      const res = await login({ teamName, password }).unwrap();
      dispatch(setUser({ ...res }));
      toast.success("Login Successful", {
        autoClose: 3000,
        position: "bottom-right",
      });
      navigate("/dashboard");
    } catch (error) {
      console.log("Login error:", error);
      const message =
        (error?.data && error.data.message) ||
        error?.error ||
        error?.message ||
        "Something went wrong during login.";
      toast.error(message.charAt(0).toUpperCase() + message.slice(1), {
        autoClose: 3000,
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div className="hidden lg:flex lg:w-2/3 lg:h-screen">
        <img
          className="w-full h-full object-cover"
          src="https://scontent.fcjb3-1.fna.fbcdn.net/v/t1.6435-9/45278484_1885577281497432_2599804856013160448_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=3jx05Wlsby0Q7kNvwFNUQ6q&_nc_oc=AdmKTQT34-9OM73e6scnP2Xc5UG9clh4YNYb-pnL4A02rw2_2_Gu1ywzgKlCSj41rkdWGJuUJ27mhB_AuVyEZwqt&_nc_zt=23&_nc_ht=scontent.fcjb3-1.fna&_nc_gid=gdrJ42aSw1r_uPhUZfTtpg&oh=00_AfZgtQxhGmobuQZJLXvLZru8QEy61695lWBa5s0DcQO3Cw&oe=68E8EC4F"
          alt="Login Visual"
        />
      </div>

      <div className="w-full lg:w-1/3 flex flex-col justify-center items-center px-6 py-12 bg-gray-900 min-h-[100vh] lg:min-h-screen">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4">
            <img
              src={logo}
              alt="Festival Logo"
              className="w-24 h-28 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Login to Festival
          </h1>
          <p className="text-sm text-gray-400 text-center">
            Enter your login details below
          </p>
        </div>

        <form
          onSubmit={loginHandler}
          className="w-full max-w-sm flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="p-3 w-full rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-secondary)]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 w-full rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-secondary)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-[var(--color-secondary)] text-black font-semibold rounded-lg hover:text-white hover:bg-transparent hover:border hover:border-[var(--color-secondary)] transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Bot Button */}
        <button
          className="relative px-6 py-3 mt-4 rounded-md overflow-hidden text-white font-medium bg-gray-700 w-full max-w-sm"
          onClick={() => navigate("/bot")}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 animate-[shimmer_2s_infinite] opacity-30"></span>
          <span className="relative z-10 text-center w-full">Bot Button</span>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(100%);
              }
            }
            .animate-[shimmer_2s_infinite] {
              animation: shimmer 2s linear infinite;
            }
          `}</style>
        </button>
      </div>
    </div>
  );
};

export default Login;
