import mongoose from "mongoose";

const groupLimitSchema = new mongoose.Schema({
    program : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Program',
            required: true
        },
    groupLimit : {type : Number, default : 5},
})

const GroupLimit = mongoose.model("GroupLimit" , groupLimitSchema);
export default GroupLimit;