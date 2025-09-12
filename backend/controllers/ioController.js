import mongoose from "mongoose";
import Program from "../models/programModel.js";
import StudentProgram from "../models/studentProgramModel.js";
import Zone from "../models/zoneModel.js";
import { filterProgramsRankForSocket } from "../utils/filterProgramsRankForSocket.js";

export async function getAllZones() {
  const zones = await Zone.find();
  if (!zones || zones.length === 0) {
    return { success: false, message: "No zones added" };
  }
  return { success: true, data: zones };
}

export async function getProgramsByZone(zoneId) {
  const programs = await Program.find({ zone: zoneId }).populate("zone");
  if (!programs || programs.length === 0) {
    return { success: false, message: "No programs added" };
  }
  return { success: true, data: programs };
}

export async function getTeamScore() {
    const totalTeamScores = await StudentProgram.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $lookup: {
          from: "auths",
          localField: "studentData.team",
          foreignField: "_id",
          as: "teamData",
        },
      },
      {
        $unwind: "$teamData",
      },
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programData",
        },
      },
      {
        $unwind: "$programData",
      },
      {
        $match: { "programData.declare": true },
      },
      {
        $group: {
          _id: "$teamData.teamName",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          teamName: "$_id",
          totalScore: 1,
        },
      },
      {
        $sort: { totalScore: -1 },
      },
    ]);
    return {success : true , data : totalTeamScores}
  };

export const studentScoreByZone = async (zoneId) => {
  try {
    if (!zoneId) throw new Error("Zone ID is required");

    const studentScoreByZone = await StudentProgram.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentData",
        },
      },
      { $unwind: "$studentData" },
      {
        $lookup: {
          from: "zones",
          localField: "studentData.zone",
          foreignField: "_id",
          as: "zoneData",
        },
      },
      { $unwind: "$zoneData" },
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programData",
        },
      },
      { $unwind: "$programData" },
      {
        $lookup: {
          from: "auths",
          localField: "studentData.team",
          foreignField: "_id",
          as: "teamData",
        },
      },
      { $unwind: "$teamData" },
      {
        $match: {
          "zoneData._id": new mongoose.Types.ObjectId(zoneId),
          "programData.declare": true,
          "programData.type": { $ne: "Group" },
          "programData.stage": { $ne: "Sports" },
        },
      },
      {
        $group: {
          _id: "$studentData.id",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
          name: { $first: "$studentData.name" },
          team: { $first: "$teamData.teamName" },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          totalScore: 1,
          team: 1,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);

    return { success: true, data: studentScoreByZone };
  } catch (error) {
    console.error("Error in studentScoreByZone:", error);
    return { success: false, error: error.message };
  }
};

export const zoneOfStudent = async () => {
  try {
    let zones = await Zone.find();

    zones = zones.filter(
      (z) =>
        z.zone !== "GENERAL" &&
        z.zone !== "MIX ZONE" &&
        z.zone !== "CAT-A" &&
        z.zone !== "CAT-B"
    );

    return { success: true, data: zones };
  } catch (error) {
    console.error("Error in zoneOfStudent:", error);
    return { success: false, error: error.message };
  }
};

export const viewOneResult = async (programId) => {
  try {
    const program = await StudentProgram.find({ program: programId })
      .populate({
        path: "program",
        match: { declare: true },
        select: "name zone type id declaredOrder stage score",
        populate: { path: "zone", select: "zone" },
      })
      .populate({
        path: "student",
        select: "name zone id team",
        populate: [
          { path: "zone", select: "zone" },
          { path: "team", model: "Auth", select: "teamName" },
        ],
      });

      

    const ranked = await filterProgramsRankForSocket(program);    
    return { success: true, data: ranked };
  } catch (error) {
    console.error("Error in viewOneResult:", error);
    return { success: false, error: error.message };
  }
};


