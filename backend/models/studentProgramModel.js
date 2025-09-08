import mongoose from "mongoose";

const studentProgramSchema = new mongoose.Schema({
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
        required: true
    },
    codeLetter : {
        type: String,
        minlength: 1,
        maxlength: 1,
        uppercase: true,
    },
    program : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Program',
        required: true
    },
    score : {
        type : Number,
        default : 0
    },
    grade : String,
    gradeScore : Number,
    totalScore : Number,
    
})
 
  
const StudentProgram = mongoose.model("StudentProgram", studentProgramSchema);
export default StudentProgram;