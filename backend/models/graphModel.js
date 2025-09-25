import mongoose from "mongoose";

const graphSchema = new mongoose.Schema({
    teams: [
        {
          teamName: { type: String, required: true },
          totalScore: { type: Number, required: true },
        }
    ],
     id: { type: Number, required: true },
    xLabelPercentage: { type: Number, required: true },
    declareCount : { type: Number, required: true }
});

const Graph = mongoose.model("Graph", graphSchema);
export default Graph;
