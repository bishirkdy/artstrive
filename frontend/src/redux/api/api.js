import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
import { logOut } from "../features/authSlice";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const baseQuery = fetchBaseQuery({
  // baseUrl: "/api",
  baseUrl : BASE_URL,
  credentials: "include",
});

// const delayedBaseQuery = async (args, api, extraOptions) => {
//   await delay(2000);
//   return baseQuery(args, api, extraOptions);
// };

// wrapper to catch 401
const baseQueryWithLogout = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(logOut()); // clear redux + localStorage
    window.location.href = "/login"; // redirect
  }

  return result;
};



export const createApiSlice = createApi({
  baseQuery : baseQueryWithLogout,
  tagTypes: ["Team", "User", "Student", "Program"],
  endpoints: () => ({}),
});
