import express from "express";
import { login, register, allTeams, updateTeamNameOrPassword, deleteTeam, editAdmin, logout } from "../controllers/authController.js";
import { authenticateJWT , authenticatedAdmin } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/register", authenticateJWT , authenticatedAdmin , register);
router.post("/login", login);
router.post('/logout', logout);
router.get("/allteams", authenticateJWT , allTeams);
router.patch("/updateteam/:id", authenticateJWT , authenticatedAdmin , updateTeamNameOrPassword);
router.delete("/deleteteam", authenticateJWT , authenticatedAdmin ,  deleteTeam);
router.patch("/editadmin/:id", authenticateJWT , authenticatedAdmin , editAdmin);

export default router;
