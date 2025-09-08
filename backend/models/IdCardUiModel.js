import mongoose from "mongoose";

const IdCardUiSchema = new mongoose.Schema({
  cardImg: {
    type: String,
  },
  orientation: {
    type: String,
    enum: ["portrait", "landscape"],
    required: true,
  },
  name: {
    color: { type: String },
    fontSize: { type: Number },
    fontWeight: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
  idText: {
    color: { type: String },
    fontSize: { type: Number },
    fontWeight: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
  team: {
    color: { type: String },
    fontSize: { type: Number },
    fontWeight: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
  zone: {
    color: { type: String },
    fontSize: { type: Number },
    fontWeight: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "left",
    },
  },
  profileImage: {
    size: { type: Number },
    borderRadius: { type: Number },
    zIndex: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
  },
  qrCode: {
    visible: { type: Boolean },
    size: { type: Number },
    positionX: { type: Number },
    positionY: { type: Number },
  },
});

const IdCardUi = mongoose.model("IdCard", IdCardUiSchema);
export default IdCardUi;
