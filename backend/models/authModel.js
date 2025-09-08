import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    
    teamName:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    isAdmin : {
        type: Boolean,
        default: false,
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        select: false
    }
    
});

const Auth = mongoose.model('Auth',authSchema);
export default Auth;