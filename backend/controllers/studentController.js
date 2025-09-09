import cloudinary from "../db/cloudinary.js";
import Student from "../models/studentModel.js";
import StudentProgram from "../models/studentProgramModel.js";
import { CustomError } from "../utils/errorUtils.js";
import QRCode from "qrcode";
import streamifier from "streamifier";
// import { storage } from "../db/FireBase.js";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const addStudent = async (req, res, next) => {
  try {
    const { id, name, team, zone } = req.body;
    let profileUrl = null;

    if ((!name, !team, !zone)) {
      return next(new CustomError("All fields are required"));
    }

    const existingStudent = await Student.findOne({ id });
    if (existingStudent) {
      return next(new CustomError("Id already exists"));
    }

    //firebase storage
    // const storageRef = ref(
    //   storage,
    //   `students/${Date.now()}_${file.originalname}`
    // );
    //for firebase
    // const snapshot = await uploadBytes(storageRef, file.buffer);
    // const downloadURL = await getDownloadURL(snapshot.ref);

    if (req.file) {
      const uploadToCloud = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "student-profile" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await uploadToCloud();
      profileUrl = result.public_id;
    }

    const student = new Student({ id, name, team, zone, profile: profileUrl });
    await student.save();

    const slug = `${student.name.replace(/\s+/g, "-").toLowerCase()}-${
      student.id
    }`;
    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.CLIENT_URL_PROD}/s/${slug}`
    );

    student.qrCode = qrDataUrl;
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

export const getAllStudent = async (req, res, next) => {
  try {
    const students = await Student.find()
      .populate("team", "teamName")
      .populate("zone", "zone");

    if (students) {
      const sorted = students.sort((a, b) => {
        if (!a.id || !b.id) return 0;
        return a.id.localeCompare(b.id);
      });
    }
    res.json(students);
  } catch (error) {
    next(error);
  }
};
export const editStudentById = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { team, zone, name, id } = req.body;
    let profileUrl = null;
    const student = await Student.findById(_id);
    const studentInProgram = await StudentProgram.findOne({ student: _id });
    if(studentInProgram) {
      return next(new CustomError("Program was added to this student , you can't edit , first delete program of this student then edit", 400))
    }
    if (!student) {
      return next(new CustomError("Student is not fount"));
    }
    if (req.file) {
      const oldImgPublicId = student.profile;
      if (oldImgPublicId) {
        await cloudinary.uploader.destroy(oldImgPublicId);
      }

      const uploadToCloud = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "student-profile" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await uploadToCloud();
      profileUrl = result.public_id;
    }
    if (team) student.team = team;
    if (zone) student.zone = zone;
    if (name) student.name = name;
    if (id) student.id = id;
    if (profileUrl) student.profile = profileUrl;
    const newStudent = await student.save();
    res.json(newStudent);
  } catch (error) {
    next(error);
  }
};

export const deleteStudentById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const student = await Student.findById(_id);

    if (!student) {
      return next(new CustomError("Student is not fount"));
    }

    const declaredProgram = await StudentProgram.findOne({student : _id}).populate({
      path : "program",
      match : { declare : true}
    });
     if (declaredProgram && declaredProgram.program) {
      return next(
        new CustomError("Cannot delete student because program is declared")
      );
    }
    
    if (student.profile) {
      await cloudinary.uploader.destroy(student.profile);
    }

    await StudentProgram.deleteMany({ student: _id });

    await Student.findByIdAndDelete(_id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteStudentOneProgram = async (req, res, next) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return next(new CustomError("Program ID is required", 400));
    }
    
    const studentProgram = await StudentProgram.findOne({
      program: _id,
    }).populate("program");
    if (!studentProgram) {
      return next(new CustomError("Program is not found to student", 400));
    }
    if (studentProgram.program?.declare === true) {
      return next(
        new CustomError("Program declared, You can't delete this program", 400)
      );
    }
    await StudentProgram.findOneAndDelete({ program: _id });
    res
      .status(200)
      .json({ message: "Program removed successfully from student." });
  } catch (error) {
    next(error);
  }
};
