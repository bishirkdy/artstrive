import Student from "../models/studentModel.js";
import StudentProgram from "../models/studentProgramModel.js";
import { CustomError } from "../utils/errorUtils.js";
import filterProgramsRank from "../utils/resultFunction.js";

export const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ id })
      .populate("team")
      .populate("zone");

    if (!student) {
      return next(new CustomError("Student not found", 404));
    }
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};
export const getProgramByScannedId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filteredPrograms = await StudentProgram.find()
      .populate({
        path: "student",
        match: { id },
        select: "id",
      })
      .populate({
        path: "program",
        select: "id name zone type declare",
        populate: {
          path: "zone",
          select: "id zone",
        },
      });
    if (!filteredPrograms) {
      return next(new CustomError("Student not found", 404));
    }
    const filtered = filteredPrograms.filter((prm) => prm.student !== null);
    res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
};
export const getResultByScannedId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const programs = await StudentProgram.find()
      .populate({
        path: "student",
        match: { id },
        select: "id team",
      })
      .populate({
        path: "program",
        select: "id name zone type declare declaredOrder score",
        match: { declare: true },
        populate: {
          path: "zone",
          select: "id zone",
        },
      });
    if (!programs) {
      return next(new CustomError("Program not found", 404));
    }
    let program = programs.filter(
      (prm) => prm.student !== null && prm.program !== null
    );

       program = await Promise.all(
      program.map(async (prm) => {
        // Handle group program case
        if (prm.program.type === "Group" && (!prm.totalScore || prm.totalScore === 0)) {
          const teamMate = await StudentProgram.findOne({
            program: prm.program._id,
            student: { $ne: prm.student._id }, // skip same student
          }).populate({
            path: "student",
            match: { team: prm.student.team },
          });

          if (teamMate && teamMate.totalScore) {
            // convert prm safely
            const base = prm.toObject ? prm.toObject() : prm;
            return {
              ...base,
              totalScore: teamMate.totalScore,
              score: teamMate.score,
              grade: teamMate.grade,
              codeLetter: teamMate.codeLetter,
            };
          }
        }

        // normal case
        return prm.toObject ? prm.toObject() : prm;
      })
    );
    
   filterProgramsRank(program, res, next);
    

    // const programsWithScore10 = program
    //   .filter((p) => p.program && p.program.score === 10)
    //   .map((p) => {
    //     let rank = null;
    //     if ([10].includes(p.score)) rank = "first";
    //     else if ([7].includes(p.score)) rank = "second";
    //     else if ([3].includes(p.score)) rank = "third";

    //     return {
    //       ...p.toObject(),
    //       rank,
    //     };
    //   });

    // const programsWithScore5 = program
    //   .filter((p) => p.program && p.program.score === 5)
    //   .map((p) => {
    //     let rank = null;
    //     if ([5].includes(p.score)) rank = "first";
    //     else if ([3].includes(p.score)) rank = "second";
    //     else if ([1].includes(p.score)) rank = "third";

    //     return {
    //       ...p.toObject(),
    //       rank,
    //     };
    //   });

    // const programsWithScore15 = program
    //   .filter((p) => p.program && p.program.score === 15)
    //   .map((p) => {
    //     let rank = null;
    //     if ([15].includes(p.score)) rank = "first";
    //     else if ([10].includes(p.score)) rank = "second";
    //     else if ([5].includes(p.score)) rank = "third";

    //     return {
    //       ...p.toObject(),
    //       rank,
    //     };
    //   });

    // const programsWithScore20 = program
    //   .filter((p) => p.program && p.program.score === 20)
    //   .map((p) => {
    //     let rank = null;
    //     if ([20].includes(p.score)) rank = "first";
    //     else if ([15].includes(p.score)) rank = "second";
    //     else if ([10].includes(p.score)) rank = "third";

    //     return {
    //       ...p.toObject(),
    //       rank,
    //     };
    //   });
    // const programsWithScore30 = program
    //   .filter((p) => p.program && p.program.score === 30)
    //   .map((p) => {
    //     let rank = null;
    //     if ([30].includes(p.score)) rank = "first";
    //     else if ([20].includes(p.score)) rank = "second";
    //     else if ([10].includes(p.score)) rank = "third";

    //     return {
    //       ...p.toObject(),
    //       rank,
    //     };
    //   });

    // updatedProgram = [
    //   ...programsWithScore10,
    //   ...programsWithScore5,
    //   ...programsWithScore15,
    //   ...programsWithScore20,
    //   ...programsWithScore30,
    // ].sort((a, b) => b.program.score - a.program.score);
    // res.status(200).json(updatedProgram);
  } catch (error) {
    next(error);
  }
};
