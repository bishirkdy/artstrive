import cloudinary from "../db/cloudinary.js";
import Auth from "../models/authModel.js";
// import Custom from "../models/customModel.js";
import Graph from "../models/graphModel.js";
import IdCardUi from "../models/IdCardUiModel.js";
import Message from "../models/MessageModel.js";
import Program from "../models/programModel.js";
import Student from "../models/studentModel.js";
import { CustomError } from "../utils/errorUtils.js";
import streamifier from "streamifier";

export const topDashboard = async (req, res, next) => {
  try {
    const students = await Student.countDocuments();
    const program = await Program.countDocuments();
    const team = await Auth.countDocuments({
      isAdmin: false,
    });
    if (students === null || program === null || team === null) {
      students = 0;
      program = 0;
      team = 0;
    }
    res.status(200).json({
      students: students,
      program: program,
      team: team,
    });
  } catch (error) {
    next(error);
  }
};
export const performanceGraph = async (req, res, next) => {
  try {
    const graph = await Graph.find().sort({ xLabelPercentage: 1 });

    if (!graph || graph.length === 0) {
      return res.status(200).json({});
    }
    const teamScores = {};

    graph.forEach((entry) => {
      if (!entry.teams || !Array.isArray(entry.teams)) return;

      entry.teams.forEach((team) => {
        const { teamName, totalScore } = team;
        if (!teamName) return;

        if (!teamScores[teamName]) {
          teamScores[teamName] = [0];
        }
        teamScores[teamName].push(totalScore);
      });
    });

    return res.status(200).json(teamScores);
  } catch (error) {
    next(error);
  }
};

export const resendResult = async (req, res, next) => {
  try {
    const resendResult = await Program.find({ declare: true })
      .select("-score")
      .populate("zone", "zone")
      .sort({ declaredOrder: -1 })
      .limit(5);
    res.json(resendResult);
  } catch (error) {
    next(error);
  }
};
export const progressResult = async (req, res, next) => {
  try {
    const [totalProgram, declaredProgram] = await Promise.all([
      Program.countDocuments(),
      Program.countDocuments({ declare: true }),
    ]);

    const declaredPercentage =
      totalProgram === 0
        ? 0
        : ((declaredProgram / totalProgram) * 100).toFixed(2);
    res.json({ totalProgram, declaredProgram, declaredPercentage });
  } catch (error) {
    next(error);
  }
};

// export const addLimits = async (req, res, next) => {
//   try {
//     const { individualLimit, teamLimit, groupLimitForTeam } = req.body;

//     if (
//       (individualLimit !== undefined && individualLimit <= 0) ||
//       (teamLimit !== undefined && teamLimit <= 0) ||
//       (groupLimitForTeam !== undefined && groupLimitForTeam <= 0)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Limits must be positive numbers",
//       });
//     }

//     const updatePayload = {};

//     if (individualLimit !== undefined) {
//       updatePayload.programLimitToEachStudent = individualLimit || 1;
//     }
//     if (teamLimit !== undefined) {
//       updatePayload.studentFromATeamLimit = teamLimit || 1;
//     }
//     if (groupLimitForTeam !== undefined) {
//       updatePayload.groupLimitForTeam = groupLimitForTeam || 1;
//     }
//     if (Object.keys(updatePayload).length === 0) {
//       return res.status(400).json({ message: "No fields provided for update" });
//     }
//     const limit = await Custom.findOneAndUpdate(
//       {},
//       { $set: updatePayload },
//       {
//         new: true,
//         upsert: true,
//         setDefaultsOnInsert: true,
//       }
//     );
//     res.status(200).json({
//       success: true,
//       data: limit,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const stageCount = async (req, res, next) => {
//   try {
//     const { stageCount } = req.body;
//     if (!stageCount)
//       return next(new CustomError("Please provide stage count", 400));

//     const updatedStageCount = await Custom.findOneAndUpdate(
//       {},
//       { stageCount },
//       { new: true, upsert: true }
//     );
//     res.status(200).json({ success: true, data: updatedStageCount });
//   } catch (error) {
//     next(error);
//   }
// };
// export const showLimits = async (req, res, next) => {
//   try {
//     const data = await Custom.findOne();
//     if (!data) return next(new CustomError("No data found", 404));
//     res.status(200).json({
//       success: true,
//       data,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// export const showStageCount = async (req, res, next) => {
//   try {
//     const data = await Custom.findOne();
//     const stageCount = data?.stageCount || 0;

//     if (stageCount === undefined || stageCount === null)
//       return next(new CustomError("No stage count found", 404));
//     res.status(200).json({data: stageCount , success: true , message: "Stage count fetched successfully"});
//   } catch (error) {
//     next(error);
//   }
// };
//................................................................................................

export const sendMessages = async (req, res, next) => {
  try {
    const { message, messageTo, notificationTitle } = req.body;

    if (!message || !messageTo || !notificationTitle)
      return next(new CustomError("Please provide message and recipient", 400));
    const notification = new Message({
      notification: message,
      notificationDate: new Date(),
      notificationOfTo: messageTo,
      notificationTitle,
    });
    if (!notification)
      return next(new CustomError("Failed to send message", 500));
    await notification.save();
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const recentMessage = async (req, res, next) => {
  try {
    const messages = await Message.find()
      .sort({ notificationDate: -1 })
      .limit(4);
    if (!messages) return next(new CustomError("No messages found", 404));
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ notificationDate: -1 });
    if (!messages) return next(new CustomError("No messages found", 404));
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const addIdCardUi = async (req, res, next) => {
  try {
    const cardUi = JSON.parse(req.body.settings);
    let cardImg = null;
    if (req.file) {
      const uploadToCloud = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "id-bg" },
            (err, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(err);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await uploadToCloud();
      cardImg = result.secure_url;
    }
    const updatedCard = await IdCardUi.findOneAndUpdate(
      {},
      { ...cardUi, cardImg },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

export const getIdCardUi = async (req, res, next) => {
  try {
    const idUi = await IdCardUi.findOne();
    res.status(200).json(idUi);
  } catch (error) {
    next(error);
  }
};
