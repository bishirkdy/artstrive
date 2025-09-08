import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    id : {
        type : String,
        required: true,
        minlength: 3,
        maxlength: 4,
        unique: true,
        trim: true,
    },
    name : {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    team : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Auth',
        required: true
    },
    zone : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Zone',
        required: true
    },
    qrCode : String,
    profile : String,
})


const Student = mongoose.model("Student", studentSchema);
export default Student;