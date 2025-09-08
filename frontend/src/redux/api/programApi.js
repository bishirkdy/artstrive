import { createApiSlice } from "./api";
import { PROGRAM_URL } from "../constants";

const programApi = createApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addProgram: builder.mutation({
            query: (body) => ({
                url: `${PROGRAM_URL}/addprogram`,
                method: "POST",
                body: body,
            }),
        }),
        getAllProgram : builder.query ({
            query: () => `${PROGRAM_URL}/viewprogram`,
            invalidateTags: "Program",
        }),
        editPrograms : builder.mutation({
            query: ({_id,...body}) => ({
                url: `${PROGRAM_URL}/editprogram/${_id}`,
                method: "PATCH",
                body: body,
            }),
        }),
        deleteProgram : builder.mutation({
            query: (_id) => ({
                url: `${PROGRAM_URL}/deleteprogram`,
                method: "DELETE",
                body: { _id },
            }),
        }),
        studentDetailById : builder.query({
            query : (_id) => ({
                url : `${PROGRAM_URL}/studentdetail/${_id}`,
                method : "GET",
            })
        }),
        addMarkToPrograms : builder.mutation({
            query : (body) =>({
                url: `${PROGRAM_URL}/addmarktoprogram`,
                method: "POST",
                body: body,
            })
        }),
        addStudentToPrograms : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/addstudentstoprogram`,
                method: "POST",
                body: body,
            })
        }),
        getStudentByProgram : builder.query({
            query : () => ({
                url: `${PROGRAM_URL}/getstudentbyprogram`,
                method: "GET",
            })
        }),
        getProgramStudentWise : builder.query({
            query : () => ({
                url: `${PROGRAM_URL}/getprogramsstudentwise`,
                method: "GET",
            })
        }),
        getProgramForCodeLetter : builder.query({
            query : () => ({
                url : `${PROGRAM_URL}/getprogramforcodeletter`,
                method : "GET"
            })
        }),
        addCodeLetter : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/addcodeletter`,
                method: "POST",
                body: body,
            })
        }),
        addScoreOfProgram : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/addscoreofprogram`,
                method: "POST",
                body: body,
            })
        }),
        viewCodeLetter : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/viewcodeletter`,
                method: "POST",
                body: body,
            })
        }),
        viewMarks : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/viewcodeletter`,
                method: "POST",
                body: body,
            })
        }),
        getProgramToDeclare : builder.query({
            query : () => `${PROGRAM_URL}/getprogramtodeclare`,
            method : "GET",
        }),
        resultDeclarations : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/declare`,
                method: "POST",
                body: body,
            })
        }),
        ResultUnDeclarations : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/undeclare`,
                method: "POST",
                body: body,
            })
        }),
        getAllDeclaredResults: builder.query({
            query: () => `${PROGRAM_URL}/viewdeclared`,
        }),
        declaredPrograms : builder.query({
            query : () => `${PROGRAM_URL}/alldeclared`
        }),
        viewSelectedResult : builder.query({
            query : (_id) => `${PROGRAM_URL}/view/${_id}`
        }),
        viewTeamScore : builder.query({
            query : () => `${PROGRAM_URL}/teamscore`
        }),
        viewStudentPoints : builder.query({
            query : () => `${PROGRAM_URL}/studentpoints`
        }),
        viewStudentPointsByZone : builder.mutation({
            query : (body) => ({
                url: `${PROGRAM_URL}/studentpointsbyzone`,
                method: "POST",
                body : body,
            })
        })
    }),
    
});

export const { useGetProgramStudentWiseQuery,useStudentDetailByIdQuery , useGetProgramToDeclareQuery ,useGetProgramForCodeLetterQuery , useViewStudentPointsByZoneMutation , useViewStudentPointsQuery, useViewTeamScoreQuery,useViewSelectedResultQuery,useDeclaredProgramsQuery,useGetAllDeclaredResultsQuery, useResultUnDeclarationsMutation , useResultDeclarationsMutation,useViewMarksMutation, useViewCodeLetterMutation, useAddScoreOfProgramMutation ,useAddCodeLetterMutation,useGetStudentByProgramQuery,useAddStudentToProgramsMutation,useAddProgramMutation , useGetAllProgramQuery , useEditProgramsMutation , useDeleteProgramMutation , useAddMarkToProgramsMutation} = programApi
export default programApi;