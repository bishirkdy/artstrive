import { createApiSlice } from "./api.js";
import { AUTH_URL } from "../constants";

const authApi = createApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout : builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
    }),
    viewTeams: builder.query({
      query: () => `${AUTH_URL}/allteams`,
    }),
    updateTeamNameOrPassword: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${AUTH_URL}/updateteam/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteTeam: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/deleteteam`,
        method: "DELETE",
        body: data,
      }),
    }),
    editAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${AUTH_URL}/editadmin/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useViewTeamsQuery,
  useUpdateTeamNameOrPasswordMutation,
  useDeleteTeamMutation,
  useEditAdminMutation,
  useLogoutMutation
} = authApi;
