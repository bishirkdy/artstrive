import express from 'express';
import { addZone, deleteZone, getZones } from '../controllers/zoneController.js';
import { authenticateJWT ,  authenticatedAdmin } from "../middlewares/authentication.js";

const router = express.Router();

router.post("/addzone", authenticateJWT , authenticatedAdmin , addZone);
router.get("/allzone", authenticateJWT ,  getZones);
router.delete("/deletezone", authenticateJWT , authenticatedAdmin, deleteZone);

export default router;
