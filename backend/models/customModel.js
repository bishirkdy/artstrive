import mongoose from "mongoose";

const customSchema = new mongoose.Schema({
    notificationTitle : { type: String, required: true },
    notification : { type: String, required: true },
    notificationOfTo : { type: String, required: true , default : "team" },
    deadline : { type: Date, required: true },
    deadlineOf : { type: String, required: true },
    notificationDate: { type: Date, default: Date.now },
})

const Custom = mongoose.model("Custom", customSchema);
export default Custom;

// const customSchema = new mongoose.Schema({
//     programLimitToEachStudent : {type : Number, default : 5},
//     studentFromATeamLimit : {type : Number, default : 5},
//     groupLimitForTeam : {type : Number, default : 1 },
//     stageCount : {type : Number, default : 0},
// })