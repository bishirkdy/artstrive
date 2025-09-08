import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
    id : {
        type : String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 4,
    },
    name : {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    zone : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Zone',
        required: true
    },
    type : {
        type: String,
        required: true,
        enum: ['Group', 'Individual']
    },
    stage : {
        type: String,
        required: true,
        enum: ['Stage', 'Non-stage' , 'Sports']
    },
    score : {
        type : Number,
        default : 5
    },
    declare : {
        type: Boolean,
        default: false
    },
    declaredOrder : {
        type: Number,
        default: null,
    }
}, { timestamps: true });

const Program = mongoose.model('Program', programSchema);
export default Program;