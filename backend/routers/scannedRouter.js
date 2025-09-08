import express from 'express';
import { getProfileById, getProgramByScannedId, getResultByScannedId } from '../controllers/scannedController.js';

const router = express.Router();

router.get("/getscannedstudent/:id" , getProfileById)
router.get("/getscannedstudentprograms/:id" , getProgramByScannedId)
router.get("/getscannedstudentresults/:id" , getResultByScannedId)

export default router;