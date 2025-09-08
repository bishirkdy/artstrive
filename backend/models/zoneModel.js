import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
    zone : {
        type: String,
        required: true,
        unique: true,
        uppercase: true,  
    }
});

const Zone = mongoose.model("Zone", zoneSchema);
export default Zone;