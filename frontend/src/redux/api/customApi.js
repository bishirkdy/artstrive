import { createApiSlice } from "./api";
import { CUSTOM_URL } from "../constants";

const customApi = createApiSlice.injectEndpoints({
    endpoints : (builder) => ({
        TopDashBoard : builder.query({
            query : () => ({
                url: `${CUSTOM_URL}/topdashboard`,
                method: "GET",
            }),
            keepUnusedDataFor : 30
        }),
        performanceGraph: builder.query({
            query: () => ({
                url: `${CUSTOM_URL}/performance`,
                method: "GET",
            }),
            keepUnusedDataFor: 30,
        }),
        resendResults : builder.query({
            query: () => ({
                url: `${CUSTOM_URL}/resendresult`,
                method: "GET",
            }),
            keepUnusedDataFor : 30,
        }),
        progressResults : builder.query({
            query: () => ({
                url: `${CUSTOM_URL}/progressresult`,
                method: "GET",
            }),
            keepUnusedDataFor : 30,
        }),
        // addLimits : builder.mutation({
        //     query: (data) => ({
        //         url: `${CUSTOM_URL}/addlimits`,
        //         method: "PUT",
        //         body: data,
        //     }),
        // }),
        // stageCount : builder.mutation({
        //     query : (data) => ({
        //         url : `${CUSTOM_URL}/stagecount`,
        //         method : "PUT",
        //         body : data
        //     })
        // }),
        // showLimits : builder.query({
        //     query : () => ({
        //         url : `${CUSTOM_URL}/showlimits`,
        //         method : "GET"
        //     }),
        //     keepUnusedDataFor : 30,
        // }),
        // showStageCount : builder.query({
        //     query : () => ({
        //         url : `${CUSTOM_URL}/showstagecount`,
        //         method : "GET"
        //     }),
        //     keepUnusedDataFor : 30,
        // }),
        //...................................................
        sendMessages : builder.mutation({
            query: (data) => ({
                url: `${CUSTOM_URL}/sendmessage`,
                method: "POST",
                body: data,
            }),
        }),
        recentMessage : builder.query({
            query: () => ({
                url: `${CUSTOM_URL}/recentmessage`,
                method: "GET",
            }),
            keepUnusedDataFor : 30,
        }),
        getMessage : builder.query({
            query: () => ({
                url: `${CUSTOM_URL}/getmessage`,
                method: "GET",
            }),
            keepUnusedDataFor : 30,
        }),
        deleteMessage : builder.mutation({
            query : (_id) => ({
                url : `${CUSTOM_URL}/deletemessage`,
                method : "DELETE",
                body : _id  
            })
        }),
        addIdCardUi : builder.mutation({
            query : (FormData) => ({
                url : `${CUSTOM_URL}/idcardui`,
                method : "PUT",
                body : FormData
            })
        }),
        getIdCardUi : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/getidcard`,
                method : "GET"
            }),
            keepUnusedDataFor : 30,
        }),
        //.............................................
        addDeadLine : builder.mutation({
            query : (data) => ({
                url : `${CUSTOM_URL}/adddeadline`,
                method : "POST",
                body : data
            })
        })
        ,studentAddingDeadline : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/studentaddingdeadline`,
                method : "GET"
            }),
            keepUnusedDataFor : 30,
        }),
        programAddingDeadline : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/programaddingdeadline`,
                method : "GET"
            }),
            keepUnusedDataFor : 30,
        }),
         stopDeadline : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/stopdeadline`,
                method : "GET"
            }),
            keepUnusedDataFor : 30,
        }),
        //........................................
        addGroupLimits : builder.mutation({
            query: (data) => ({
                url: `${CUSTOM_URL}/addlimit`,
                method: "PUT",
                body: data,
            }),
        }),
        showGroupLimits : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/showlimits`,
                method : "GET"
            }),
            keepUnusedDataFor : 30,
        }),
         getCountForShowingResult : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/getcountforshowingresult`,
                method : "GET"
            }),   
                keepUnusedDataFor : 30,
        }),
         updateShowingCount : builder.mutation({
            query : (data) => ({
                url : `${CUSTOM_URL}/updateshowingcount`,
                method : "PUT",
                body : data
            }),   
        }),
         getShowingCount : builder.query({
            query : () => ({
                url : `${CUSTOM_URL}/getshowingcount`,
                method : "GET"
            }),   
                keepUnusedDataFor : 30,
        }),
    }),
});

export const {useShowStageCountQuery ,useShowLimitsQuery,useStageCountMutation,useGetIdCardUiQuery , useAddIdCardUiMutation , useRecentMessageQuery , useGetMessageQuery ,  useSendMessagesMutation,useAddLimitsMutation ,useTopDashBoardQuery , usePerformanceGraphQuery , useResendResultsQuery , useProgressResultsQuery , useAddDeadLineMutation , useProgramAddingDeadlineQuery , useStudentAddingDeadlineQuery , useDeleteMessageMutation , useStopDeadlineQuery , useAddGroupLimitsMutation , useShowGroupLimitsQuery , useGetCountForShowingResultQuery  , useUpdateShowingCountMutation , useGetShowingCountQuery} = customApi;
export default customApi;