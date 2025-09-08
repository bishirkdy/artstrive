import React, { useState } from "react";
import { BiUnite } from "react-icons/bi";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { setUser } from "../redux/features/authSlice";
import { toast } from "react-toastify";

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
      const message =
        error?.data?.message ||
        error?.message ||
        "Something went wrong during login.";
      toast.error(
        message.charAt(0).toUpperCase() + message.slice(1),
        {
          autoClose: 3000,
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <div className="hidden lg:block lg:w-2/3 h-1/3 lg:h-full">
        <img
          className="w-full h-full object-cover"
          src="https://images.pexels.com/photos/186464/pexels-photo-186464.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Login Visual"
        />
      </div>

      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-6">
        <BiUnite className="text-7xl text-[var(--color-secondary)] mb-2" />
        <h1 className="text-2xl font-bold mb-1">Login to Festival</h1>
        <p className="text-sm mb-4 text-gray-600">Please enter your login details below</p>

        <form onSubmit={loginHandler} className="flex flex-col items-center w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="p-2 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[var(--color-secondary)]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 w-full rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[var(--color-secondary)]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-[var(--color-secondary)] text-black hover:text-white font-semibold rounded-lg hover:bg-transparent hover:border hover:border-white transition duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
