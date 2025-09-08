import {createApiSlice} from './api.js';
import {STUDENT_URL} from '../constants.js'

const studentApi = createApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addStudent : builder.mutation({
            query:(formData)=> ({
                url: `${STUDENT_URL}/addstudent`,
                method: 'POST',
                body: formData,
            }),
        }),
        allStudent : builder.query({
            query: ()=> `${STUDENT_URL}/allstudents`,
            validateTags: "Student",

        }),
        editStudent: builder.mutation({
            query: (formData) => ({
              url: `${STUDENT_URL}/editstudent/${formData.get('_id')}`,
              method: 'PATCH',
              body: formData,
            }),
          }),
          
        deleteStudent : builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/deletestudent`,
                method: 'DELETE',
                body: data,
            }),
        }),
        deleteStudentOneProgram : builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/deletestudentoneprogram`,
                method: 'DELETE',
                body: data,
            }),
        }),
    })
});

export const {useDeleteStudentOneProgramMutation , useAddStudentMutation , useAllStudentQuery, useEditStudentMutation , useDeleteStudentMutation} = studentApi
export default studentApi;