import mongoose from "mongoose";

const customSchema = new mongoose.Schema({
    programLimitToEachStudent : {type : Number, default : 5},
    studentFromATeamLimit : {type : Number, default : 5},
    groupLimitForTeam : {type : Number, default : 1 },
    stageCount : {type : Number, default : 0},
})

const Custom = mongoose.model("Custom", customSchema);
export default Custom;