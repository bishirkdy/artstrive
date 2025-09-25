import Program from "../models/programModel.js";
import { CustomError } from "../utils/errorUtils.js";
import StudentProgram from "../models/studentProgramModel.js";
import Student from "../models/studentModel.js";
import mongoose from "mongoose";
import Graph from "../models/graphModel.js";
import Message from "../models/MessageModel.js";
import filterProgramsRank from "../utils/resultFunction.js";
import GroupLimit from "../models/groupLimit.js";
import ShowingCount from "../models/ShowingResult.js";

export const addProgramsName = async (req, res, next) => {
  try {
    const { id, name, zone, type, stage } = req.body;

    if (!id || !name || !zone || !type || !stage)
      return next(new CustomError("All fields are required"));
    let score = type === "Group" ? 10 : 5;

    const existingId = await Program.findOne({ id });
    if (existingId) return next(new CustomError("Program id already exists"));

    const program = new Program({ id, name, zone, type, score, stage });

    await program.save();
    res.status(201).json(program);
  } catch (error) {
    next(error);
  }
};
export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().populate("zone");
    res.json(programs);
  } catch (error) {
    next(error);
  }
};
export const editPrograms = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { id, name, zone, type, stage } = req.body;

    const existingProgram = await Program.findById(_id);
    if (!existingProgram) {
      return res.status(404).json({ message: "Program not found" });
    }

    const StudentInProgram = await StudentProgram.findOne({ program: _id });
    if (StudentInProgram) {
      return next(
        new CustomError(
          "Cannot edit program because students are enrolled in it",
          400
        )
      );
    }

    const program = await Program.findByIdAndUpdate(
      _id,
      { id, name, zone, type, stage },
      { new: true, runValidators: true }
    );
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const deletePrograms = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const program = await Program.findById(_id);
    if (!program) {
      return next(new CustomError("Program is not fount"));
    }
    await StudentProgram.deleteMany({ program: _id });
    await Program.deleteOne({ _id });
    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const oneStudentProgram = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const programsOfStudent = await StudentProgram.find({
      student: _id,
    }).populate({
      path: "program",
      select: "id name type declare",
      populate: {
        path: "zone",
        select: "zone",
      },
    });
    res.status(200).json(programsOfStudent);
  } catch (error) {
    next(error);
  }
};

export const addMarkToPrograms = async (req, res, next) => {
  try {
    const { program, zone, mark } = req.body;
    if (!program || !zone)
      return next(new CustomError("All fields are required"));

    const programs = await Program.findOneAndUpdate(
      { _id: program, zone },
      { score: mark },
      { new: true }
    );
    if (!programs) return next(new CustomError("program not found"));
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};

export const addStudentToProgram = async (req, res, next) => {
  try {
    const { studentId, programId } = req.body;

    if (!studentId || !programId)
      return next(new CustomError("All fields are required"));

    const [program, student] = await Promise.all([
      Program.findById(programId).populate({ path: "zone", select: "zone" }),
      Student.findById(studentId).populate({ path: "zone", select: "zone" }),
    ]);
    if (!program) return next(new CustomError("Program not found"));
    if (!student) return next(new CustomError("Student not found"));

    if (
      program.zone &&
      !["MIX ZONE", "CAT-A", "CAT-B"].includes(program.zone.zone) &&
      program.zone._id.toString() !== student.zone._id.toString()
    ) {
      return next(
        new CustomError("Program zone and student Zone do not match")
      );
    }
    const individualLimits = {
      Stage: { "HIGH ZONE": 3, "MID ZONE": 4, "LOW ZONE": 4 },
      "Non-stage": { "HIGH ZONE": 6, "MID ZONE": 6, "LOW ZONE": 5 },
      Sports: { "HIGH ZONE": 5, "MID ZONE": 5, "LOW ZONE": 5 },
    };

    if (
      program.type === "Individual" &&
      !["CAT-A", "CAT-B", "MIX ZONE"].includes(program.zone.zone)
    ) {
      const stage = program.stage;
      const zoneName = program.zone?.zone;

      if (!zoneName || !individualLimits[stage]?.[zoneName]) {
        return next(
          new CustomError("Zone not found or invalid for this stage")
        );
      }

      const programIds = await Program.find({
        type: "Individual",
        stage,
        zone: program.zone._id,
      }).distinct("_id");

      const studentProgramCount = await StudentProgram.countDocuments({
        student: studentId,
        program: { $in: programIds },
      });

      if (studentProgramCount >= individualLimits[stage][zoneName]) {
        return next(
          new CustomError(
            `Student has reached the limit for ${stage} programs in ${zoneName}`
          )
        );
      }
    }

    // ......................................................................
    let teamLimit;

    if (program.type === "Individual") {
      teamLimit = 3;
    } else if (program.type === "Group") {
      const groupLimit = await GroupLimit.findOne({ program: programId });
      teamLimit = groupLimit?.groupLimit ?? 5;
    } else {
      teamLimit = 0;
    }

    const teamStudents = await Student.find({ team: student.team }).distinct(
      "_id"
    );

    const studentsFromTeamCount = await StudentProgram.countDocuments({
      program: programId,
      student: { $in: teamStudents },
    });

    if (studentsFromTeamCount >= teamLimit) {
      return next(
        new CustomError("Student's team has reached the participation limit")
      );
    }

    const isAlreadyEnrolled = await StudentProgram.exists({
      student: studentId,
      program: programId,
    });

    if (isAlreadyEnrolled)
      return next(new CustomError("You are already in the program"));

    const newEnrollment = new StudentProgram({
      student: studentId,
      program: programId,
    });

    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (error) {
    next(error);
  }
};

export const getStudentsByProgram = async (req, res, next) => {
  try {
    const programs = await StudentProgram.find()
      .populate({
        path: "program",
        select: "name zone id declare type stage declaredOrder",
        populate: {
          path: "zone",
          select: "zone",
        },
      })
      .populate({
        path: "student",
        select: "name zone team id",
        populate: [
          {
            path: "zone",
            select: "zone",
          },
          {
            path: "team",
            select: "teamName",
          },
        ],
      });

    const sortedProgram = programs.sort((a, b) => {
      const idA = a.program?.id;
      const idB = b.program?.id;

      return idA.localeCompare(idB);
    });

    res.json(sortedProgram);
  } catch (error) {
    next(error);
  }
};

export const getProgramsStudentWise = async (req, res, next) => {
  try {
    const programs = await StudentProgram.find()
      .populate({
        path: "program",
        select: "name zone id declare type stage declaredOrder",
        populate: {
          path: "zone",
          select: "zone",
        },
      })
      .populate({
        path: "student",
        select: "name zone team id",
        populate: [
          {
            path: "zone",
            select: "zone",
          },
          {
            path: "team",
            select: "teamName",
          },
        ],
      });

    const sortedProgram = programs.sort((a, b) => {
      const idA = a.student?.id || "";
      const idB = b.student?.id || "";
      return idA.localeCompare(idB);
    });

    res.json(sortedProgram);
  } catch (error) {
    next(error);
  }
};

export const getProgramForCodeLetter = async (req, res, next) => {
  try {
    const programs = await StudentProgram.aggregate([
      {
        $group: {
          _id: "$program",
          hasCodeLetter: {
            $sum: { $cond: [{ $ifNull: ["$codeLetter", false] }, 1, 0] },
          },
          docs: { $push: "$$ROOT" },
        },
      },
      {
        $match: { hasCodeLetter: 0 },
      },
      {
        $unwind: "$docs",
      },
      {
        $replaceRoot: { newRoot: "$docs" },
      },
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "program",
        },
      },
      { $unwind: "$program" },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
    ]);
    res.json(programs);
  } catch (error) {
    next(error);
  }
};

export const getProgramForCodeLetterForEdit = async (req, res, next) => {
  try {
    const programs = await StudentProgram.find({})
      .populate("program", "name zone id declare type declaredOrder")
      .populate("student", "name zone team id");
    res.json(programs);
  } catch (error) {
    next(error);
  }
};

export const addCodeLetter = async (req, res, next) => {
  try {
    const { programId, codeLetters } = req.body;
    if (!programId || !codeLetters) {
      return next(new CustomError("All fields are required"));
    }

    const program = await Program.findOne({ id: programId });
    if (!program) {
      return next(new CustomError("Program not found"));
    }

    const existingCodeLetters = await StudentProgram.find({
      program: program._id,
    })
      .select("codeLetter")
      .lean();
    const existingLettersSet = new Set(
      existingCodeLetters.map((p) => p.codeLetter)
    );

    const newLettersSet = new Set();
    for (const letter of Object.values(codeLetters)) {
      if (letter) {
        if (existingLettersSet.has(letter)) {
          return next(
            new CustomError(
              `Code Letter "${letter}" is already assigned in this program`
            )
          );
        }
        if (newLettersSet.has(letter)) {
          return next(
            new CustomError(`Duplicate Code Letter "${letter}" in request`)
          );
        }
        newLettersSet.add(letter);
      }
    }

    const updatePromises = Object.entries(codeLetters).map(
      async ([studentId, letter]) => {
        return StudentProgram.findOneAndUpdate(
          { student: studentId, program: program._id },
          { codeLetter: letter || null },
          { new: true, upsert: false }
        );
      }
    );

    const updatedRecords = await Promise.all(updatePromises);

    res.status(200).json(updatedRecords);
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }

    if (error.code === 11000) {
      return next(
        new CustomError(
          "Duplicate Code Letter, Each code letter must be unique"
        )
      );
    }

    next(error);
  }
};

export const editCodeLetter = async (req, res, next) => {
  try {
    const { programId, codeLetters } = req.body;
    if (!programId || !codeLetters) {
      return next(new CustomError("All fields are required"));
    }

    const program = await Program.findOne({ id: programId });
    if (!program) {
      return next(new CustomError("Program not found"));
    }

    const existingCodeLetters = await StudentProgram.find({
      program: program._id,
    })
      .select("student codeLetter")
      .lean();

    const globalLetters = new Set(
      existingCodeLetters
        .filter((p) => !Object.keys(codeLetters).includes(String(p.student)))
        .map((p) => p.codeLetter)
        .filter((letter) => letter)
    );

    const newLettersSet = new Set();

    for (const [studentId, letter] of Object.entries(codeLetters)) {
      if (letter) {
        if (globalLetters.has(letter)) {
          return next(
            new CustomError(
              `Code Letter "${letter}" is already assigned in this program`
            )
          );
        }
        if (newLettersSet.has(letter)) {
          return next(
            new CustomError(`Duplicate Code Letter "${letter}" in request`)
          );
        }
        newLettersSet.add(letter);
      }
    }

    const updatePromises = Object.entries(codeLetters).map(
      async ([studentId, letter]) => {
        return StudentProgram.findOneAndUpdate(
          { student: studentId, program: program._id },
          { codeLetter: letter || null },
          { new: true }
        );
      }
    );

    const updatedRecords = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Code letters updated successfully",
      updatedRecords,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    next(error);
  }
};

export const addScoreOfAProgram = async (req, res, next) => {
  try {
    const { programId, mark } = req.body;

    if (!programId || !mark)
      return next(new CustomError("All fields are required"));

    const program = await Program.findOne({ _id: programId });
    if (!program) throw new CustomError("Program not found");

    const programScore = program.score;

    let marks = Object.entries(mark).map(([studentId, studentScore]) => ({
      studentId,
      studentScore,
    }));

    if (
      marks.some(({ studentScore }) => studentScore > 100 || studentScore < 0)
    ) {
      return next(new CustomError("Invalid score value"));
    }

    if (marks.length === 0) {
      return next(
        new CustomError("No valid marks found in the given range (0-100)")
      );
    }

    let topStudents = [];
    let first, second, third;
    if (programScore === 5) {
      [first, second, third] = [5, 3, 1];
    } else if (programScore === 10) {
      [first, second, third] = [10, 7, 3];
    } else if (programScore === 15) {
      [first, second, third] = [15, 10, 5];
    } else if (programScore === 20) {
      [first, second, third] = [20, 15, 10];
    } else if (programScore === 30) {
      [first, second, third] = [30, 20, 10];
    } else {
      return next(new CustomError("Invalid program score value"));
    }
    const rankScores = [first, second, third];
    const sortedMarks = [...marks].sort(
      (a, b) => b.studentScore - a.studentScore
    );
    const uniqueScores = [...new Set(sortedMarks.map((s) => s.studentScore))];
    for (let i = 0; i < uniqueScores.length; i++) {
      if (i < 3) {
        topStudents.push(
          ...sortedMarks
            .filter((s) => s.studentScore === uniqueScores[i])
            .map((s) => ({ ...s, score: rankScores[i] }))
        );
      } else {
        topStudents.push(
          ...sortedMarks
            .filter((s) => s.studentScore === uniqueScores[i])
            .map((s) => ({ ...s }))
        );
      }
    }

    const updatedMarks = await Promise.all(
      topStudents.map(async ({ studentId, studentScore, score }) => {
        let grade, gradeScore;

        if (studentScore <= 39) {
          grade = "";
          gradeScore = 0;
        } else if (studentScore <= 50) {
          grade = "C";
          gradeScore = 1;
        } else if (studentScore <= 60) {
          grade = "B";
          gradeScore = 3;
        } else if (studentScore <= 90) {
          grade = "A";
          gradeScore = 4;
        } else {
          grade = "A+";
          gradeScore = 5;
        }
        const totalScore = Math.round(
          (Number(score) || 0) + (Number(gradeScore) || 0)
        );
        const finalTotalScore = totalScore > 0 ? totalScore : null;

        return StudentProgram.findOneAndUpdate(
          { student: studentId, program: programId },
          { $set: { score, grade, totalScore: finalTotalScore } },
          { new: true, upsert: true }
        );
      })
    );
    if (updatedMarks.length === 0) {
      throw new CustomError("No students found");
    }

    res.status(200).json(updatedMarks);
  } catch (error) {
    next(error);
  }
};

export const viewMarks = async (req, res, next) => {
  try {
    const { programId } = req.body;
    if (!programId) return next(new CustomError("Program ID is required"));
    const program = await StudentProgram.find({
      program: programId,
      totalScore: { $ne: null, $gt: 0 },
    })
      .select("-student")
      .populate("program", "name");
    res.json(program);
  } catch (error) {
    next(error);
  }
};

export const getProgramToDeclare = async (req, res, next) => {
  try {
    const program = await StudentProgram.aggregate([
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
        $lookup: {
          from: "zones",
          localField: "programData.zone",
          foreignField: "_id",
          as: "zoneData",
        },
      },
      {
        $unwind: "$zoneData",
      },
      {
        $match: {
          "programData.declare": false,
          totalScore: { $exists: true, $nin: [null, 0] },
        },
      },
      {
        $group: { _id: "$programData", zone: { $first: "$zoneData.zone" } },
      },
      {
        $project: {
          _id: 0,
          program_Id: "$_id._id",
          programName: "$_id.name",
          programZone: "$zone",
          programType: "$_id.type",
          programStage: "$_id.stage",
          programId: "$_id.id",
        },
      },
    ]);
    if (!program) return next(new CustomError("Couldn't find programs"));
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};
export const declareResults = async (req, res, next) => {
  try {
    const { isDeclaredID } = req.body;
    if (!isDeclaredID) return next(new CustomError("Invalid declaration"));

    const program = await Program.findOne({ _id: isDeclaredID }).populate(
      "zone"
    );
    if (!program) return next(new CustomError("Program not found"));

    const declaredCount = await Program.countDocuments({ declare: true });
    const declareCount = declaredCount + 1;
    program.declare = true;
    program.declaredOrder = declareCount;
    await program.save();

    //...........................................................
    const totalProgram = await Program.countDocuments();

    const notificationTitle = `Result ${declareCount} Published`;
    const notification = `Result: ${declareCount} of ${totalProgram} id ${
      program.id
    } ${program.zone.zone.toLowerCase()} ${program.name} has been published`;
    const notificationDate = Date.now();
    const notificationOfTo = "all";
    const newNotification = new Message({
      notificationTitle,
      notification,
      notificationDate,
      notificationOfTo,
    });
    await newNotification.save();
    //................................................................
    const totalTeamScores = await StudentProgram.aggregate([
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
          from: "auths",
          localField: "studentData.team",
          foreignField: "_id",
          as: "teamData",
        },
      },
      { $unwind: "$teamData" },
      {
        $lookup: {
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programData",
        },
      },
      { $unwind: "$programData" },
      { $match: { "programData.declare": true } },
      {
        $group: {
          _id: "$teamData.teamName",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
          id: {
            $first: "$programData.id",
          },
        },
      },
      {
        $group: {
          _id: null,
          teams: {
            $push: {
              teamName: "$_id",
              totalScore: "$totalScore",
            },
          },
          id: { $first: "$id" },
        },
      },
      {
        $project: {
          _id: 0,
          teams: 1,
          id: 1,
        },
      },
    ]);

    const xLabelPercentage = Math.round((declareCount / totalProgram) * 100);

    if (!totalTeamScores.length) {
      return res.status(400).json({ error: "No team score data available" });
    }

    const graphData = await Graph.find({});
    const filtered = graphData.map((gd) => gd.xLabelPercentage);

    let newProgress;
    if (totalProgram >= 10) {
      let exists = false;

      for (const value of filtered) {
        if (
          (value >= 10 &&
            value < 25 &&
            xLabelPercentage >= 10 &&
            xLabelPercentage < 25) ||
          (value >= 25 &&
            value < 35 &&
            xLabelPercentage >= 25 &&
            xLabelPercentage < 35) ||
          (value >= 40 &&
            value < 55 &&
            xLabelPercentage >= 40 &&
            xLabelPercentage < 55) ||
          (value >= 55 &&
            value < 65 &&
            xLabelPercentage >= 55 &&
            xLabelPercentage < 65) ||
          (value >= 65 &&
            value < 80 &&
            xLabelPercentage >= 65 &&
            xLabelPercentage < 80) ||
          (value >= 80 &&
            value < 98 &&
            xLabelPercentage >= 80 &&
            xLabelPercentage < 98)
        ) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        if (
          (xLabelPercentage >= 10 && xLabelPercentage < 25) ||
          (xLabelPercentage >= 25 && xLabelPercentage < 35) ||
          (xLabelPercentage >= 40 && xLabelPercentage < 55) ||
          (xLabelPercentage >= 55 && xLabelPercentage < 65) ||
          (xLabelPercentage >= 65 && xLabelPercentage < 80) ||
          (xLabelPercentage >= 80 && xLabelPercentage < 98) ||
          declareCount === totalProgram
        ) {
          newProgress = new Graph({
            teams: totalTeamScores[0].teams,
            id: program.id,
            xLabelPercentage: xLabelPercentage,
            declareCount,
          });

          if (newProgress) {
            await newProgress.save();
          }
        }
      }
    }

    res.status(200).json({ message: "Results declared successfully" });
  } catch (error) {
    next(error);
  }
};

export const unDeclareResults = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) return next(new CustomError("Invalid declaration"));

    const program = await Program.findOne({ _id }).populate("zone");
    if (!program) return next(new CustomError("Program not found"));

    //.............notifications
    const notificationTitle = `Result ${program.declaredOrder} Cancelled`;
    const notification = `The result${program.declaredOrder} id: ${program.id} ${program.zone.zone} ${program.name} has been canceled`;
    const notificationDate = Date.now();
    const notificationOfTo = "all";
    const newMessage = new Message({
      notificationTitle,
      notification,
      notificationDate,
      notificationOfTo,
    });
    await newMessage.save();

    program.declare = false;
    program.declaredOrder = null;

    await program.save();
    await Graph.findOneAndDelete({ id: program.id });

    const declaredPrograms = await Program.find({ declare: true }).sort(
      "declaredOrder"
    );

    await Promise.all(
      declaredPrograms.map((program, index) => {
        program.declaredOrder = index + 1;
        return program.save();
      })
    );

    res.status(200).json({
      message: "Results undeclared successfully, and order adjusted",
    });
  } catch (error) {
    next(error);
  }
};

export const showDeclaredresults = async (req, res, next) => {
  try {
    const program = await StudentProgram.find()
      .populate({
        path: "program",
        match: { declare: true },
        select: "name zone type id declaredOrder stage score",
        populate: {
          path: "zone",
          select: "zone",
        },
      })
      .populate({
        path: "student",
        select: "name zone id team",
        populate: [
          {
            path: "zone",
            select: "zone",
          },
          {
            path: "team",
            model: "Auth",
            select: "teamName",
          },
        ],
      });

    filterProgramsRank(program, res, next);
  } catch (error) {
    next(error);
  }
};
export const declaredPrograms = async (req, res, next) => {
  try {
    const program = await Program.find({ declare: true }).populate({
      path: "zone",
      select: "zone",
    });
    if (!program)
      return next(new CustomError("Program not found or not declared"));
    res.status(200).json(program);
  } catch (error) {
    next(error);
  }
};
export const viewOneResult = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const program = await StudentProgram.find({ program: _id })
      .populate({
        path: "program",
        match: { declare: true },
        select: "name zone type id declaredOrder stage score",
        populate: {
          path: "zone",
          select: "zone",
        },
      })
      .populate({
        path: "student",
        select: "name zone id team",
        populate: [
          {
            path: "zone",
            select: "zone",
          },
          {
            path: "team",
            model: "Auth",
            select: "teamName",
          },
        ],
      });
    filterProgramsRank(program, res, next);
  } catch (error) {
    next(error);
  }
};

export const getTeamScore = async (req, res, next) => {
  try {
    const publishingCount = await ShowingCount.findOne().select("-_id");
    const showingCount = Number(publishingCount?.showingCount) || 0;

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
        $match: {
          "programData.declare": true,
          "programData.declaredOrder": { $gte: 1, $lte: showingCount },
        },
      },
      {
        $group: {
          _id: "$teamData.teamName",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
        },
      },
      {
        $project: {
          _id: 1,
          teamName: "$_id",
          totalScore: 1,
        },
      },
      {
        $sort: { totalScore: -1 },
      },
    ]);
    res.status(200).json({ showingCount, totalTeamScores });
  } catch (error) {
    next(error);
  }
};

export const getStudentsPoint = async (req, res, next) => {
  try {
    const publishingCount = await ShowingCount.findOne().select("-_id");
    const showingCount = Number(publishingCount?.showingCount) || 0;
    const studentPoints = await StudentProgram.aggregate([
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
          from: "programs",
          localField: "program",
          foreignField: "_id",
          as: "programData",
        },
      },
      { $unwind: "$programData" },
      {
        $match: {
          "programData.type": { $ne: "Group" },
          "programData.stage": { $ne: "Sports" },
          "programData.declare": true,
          "programData.declaredOrder": { $gte: 1, $lte: showingCount },
        },
      },
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
          from: "auths",
          localField: "studentData.team",
          foreignField: "_id",
          as: "teamData",
        },
      },
      { $unwind: "$teamData" },
      {
        $group: {
          _id: "$studentData._id",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
          name: { $first: "$studentData.name" },
          zone: { $first: "$zoneData.zone" },
          team: { $first: "$teamData.teamName" },
          id: { $first: "$studentData.id" },
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          name: 1,
          totalScore: 1,
          zone: 1,
          team: 1,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);

    res.status(200).json({ studentPoints, showingCount });
  } catch (error) {
    next(error);
  }
};

export const studentScoreByZone = async (req, res, next) => {
  try {
    const { zoneId } = req.body;
    if (!zoneId) return next(new CustomError("Zone ID is required"));
    const publishingCount = await ShowingCount.findOne().select("-_id");
    const showingCount = Number(publishingCount?.showingCount) || 0;
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
          "programData.declaredOrder": { $gte: 1, $lte: showingCount },
          "programData.type": { $ne: "Group" },
          "programData.stage": { $ne: "Sports" },
        },
      },
      {
        $group: {
          _id: "$studentData._id",
          totalScore: { $sum: { $ifNull: ["$totalScore", 0] } },
          name: { $first: "$studentData.name" },
          team: { $first: "$teamData.teamName" },
          id: { $first: "$studentData.id" },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          totalScore: 1,
          team: 1,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);

    res.status(200).json({ studentScoreByZone, showingCount });
  } catch (error) {
    next(error);
  }
};

export const programCount = async (req, res, next) => {
  try {
    const count = await Program.countDocuments();
    res.status(200).json({ programCount: count });
  } catch (error) {
    next(error);
  }
};
