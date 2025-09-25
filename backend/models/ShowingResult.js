import mongoose from "mongoose";

const showingCount = new mongoose.Schema({
    showingCount : {
        type : Number,
    }
})

const ShowingCount = mongoose.model("showingCount" , showingCount);
export default ShowingCount;