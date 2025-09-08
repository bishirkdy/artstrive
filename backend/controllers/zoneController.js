import { CustomError } from "../utils/errorUtils.js";
import Zone from "../models/zoneModel.js";
import Student from "../models/studentModel.js";
import Program from "../models/programModel.js";

export const addZone = async (req, res, next) => {
  try {
    const { zone } = req.body;
    if (!zone) return next(new CustomError("zone is required", 400));
    const newZone = new Zone({ zone });
    await newZone.save();
    res.status(201).json(newZone);
  } catch (error) {
    next(error);
  }
};

export const getZones = async (req, res, next) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    next(error);
  }
};

export const deleteZone = async (req, res, next) => {
  try {
    const { id } = req.body;
    const zone = await Zone.findById(id);
    if (!zone) return next(new CustomError("Zone not found", 404));

    const studentsInZone = await Student.findOne({ zone: id });
    const programInZone = await Program.findOne({ zone: id });
    if (studentsInZone || programInZone) {
      return next(
        new CustomError(
          "Students or Programs are still in this zone, you can't delete",
          400
        )
      );
    }
    await Zone.findByIdAndDelete(id);
    res.status(200).json({ message: "Zone deleted successfully" });
  } catch (error) {
    next(error);
  }
};
