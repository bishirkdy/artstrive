import Auth from "../models/authModel.js";
import Student from "../models/studentModel.js";
import generateToken from "../utils/createUser.js";
import { CustomError } from "../utils/errorUtils.js";


export const register = async (req, res , next) => {
  try {
    const { teamName, password, isAdmin } = req.body;

    if (!password || !teamName) {
      return next(new CustomError("All fields must be provided" , 400))
    }

    const existingUser = await Auth.findOne({ teamName });
    if (existingUser) {
      return next(new CustomError("Already exist" , 400))
    }
    const newUser = new Auth({ teamName, password, isAdmin });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res , next) => {
  try {
    const { teamName, password } = req.body;

    if (!password || !teamName) {
      return next(new CustomError("All fields are required" , 400));
    }
    const user = await Auth.findOne({ teamName }).select("+password");

    if (!user) {
      return next(new CustomError("User not fount" , 400))
    }
    const isMatch = user.password === password;
    if (!isMatch) {
      return next(new CustomError("Invalid credential" , 400))
    }
    if (isMatch) {
      const token = generateToken(res , user._id , user.isAdmin);
      res.status(200).json({
        user: {
          token,
          _id: user._id,
          teamName: user.teamName,
          isAdmin: user.isAdmin,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
      res.clearCookie("jwt", {
      httpOnly: true, 
      secure: true, 
      sameSite: "none", 
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const allTeams = async (req, res , next) => {
  try {
    const team = await Auth.find();
    const teamName = team.filter(team => team.isAdmin === false)
    res.status(200).json({
      message: "All teams found",
      teamName,
    });
  } catch (error) {
   next(error)
  }
};

export const updateTeamNameOrPassword = async (req, res , next) => {
    try {
      const {id} = req.params;
      const team = await Auth.findById(id)
      if (!team) {
        return next(new CustomError("Team not fount" , 400))
      }
      const { teamName, password } = req.body;
      if (teamName) team.teamName = teamName;
      if (password) team.password = password;
      await team.save();
      res.status(200).json({ message: "Team Updated successfully" , team });
    } catch (error) {
      next(error);
      }
}

export const deleteTeam = async (req, res , next)=>{
  try {
    const {id} = req.body;
    const team = await Auth.findById(id);
    if(!team) return next(new CustomError("There is no team" , 400))

    const studentInTeam = await Student.findOne({ team: id });
    if (studentInTeam) {
      return next(new CustomError("Students are still in this team , you can't delete", 400));
    }
    await Auth.findByIdAndDelete(id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
   next(error);
  }
}


export const editAdmin = async (req, res , next) => {
  try {
    const {id} = req.params;
    const user = await Auth.findById(id)
    if (!user) {
      return next(new CustomError("Admin not fount" , 400))
    }
    const { teamName, password } = req.body;
    if (teamName) user.teamName = teamName;
    if (password) user.password = password;
    await user.save();
    res.status(200).json({ message: "Team Updated successfully" , user });
  } catch (error) {
    next(error);
    }
}