import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

// const delayedBaseQuery = async (args, api, extraOptions) => {
//   await delay(2000);
//   return baseQuery(args, api, extraOptions);
// };



export const createApiSlice = createApi({
  baseQuery,
  tagTypes: ["Team", "User", "Student", "Program"],
  endpoints: () => ({}),
});
