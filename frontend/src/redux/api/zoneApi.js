import { createApiSlice } from "./api.js";
import { ZONE_URL } from "../constants.js";

const zoneApi = createApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addZone: builder.mutation({
      query: (body) => ({
        url: `${ZONE_URL}/addzone`,
        method: "POST",
        body: body,
      }),
    }),
    viewZone: builder.query({
      query: () => ({
        url: `${ZONE_URL}/allzone`,
        method: "GET",
      }),
    }),
    deleteZone: builder.mutation({
      query: (id) => ({
        url: `${ZONE_URL}/deletezone`,
        method: "DELETE",
        body: { id },
      }),
    }),
  }),
});

export const { useAddZoneMutation, useViewZoneQuery, useDeleteZoneMutation } =
  zoneApi;
