import { createApiSlice } from "./api";
import { SCANNED_URL } from "../constants";

const scannedApi = createApiSlice.injectEndpoints({
    endpoints : (builder) => ({
        getScannedStudent : builder.query({
            query : (id) => ({
                url : `${SCANNED_URL}/getscannedstudent/${id}`,
                method : "GET",
            })
        }),
        getScannedStudentPrograms : builder.query({
            query : (id) => ({
                url : `${SCANNED_URL}/getscannedstudentprograms/${id}`,
                method : "GET",
            })
        }),
        getScannedStudentResults : builder.query({
            query : (id) => ({
                url : `${SCANNED_URL}/getscannedstudentresults/${id}`,
                method : "GET",
            })
        })
    })
});

export const {useGetScannedStudentQuery , useGetScannedStudentProgramsQuery , useGetScannedStudentResultsQuery} = scannedApi;
export default scannedApi;
