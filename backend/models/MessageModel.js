import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    notificationTitle : {type : String, required: true},
    notification :  {type : String, required: true},
    notificationDate : {type : Date, required: true},
    notificationOfTo : {type : String , enum : ["all", "team"] , required: true},
})

const Message = mongoose.model("Message", messageSchema);
export default Message;