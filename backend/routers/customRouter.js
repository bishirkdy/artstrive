import express from "express";
import { authenticatedAdmin, authenticateJWT } from '../middlewares/authentication.js';
import { addDeadline, addIdCardUi, deleteMessages, getIdCardUi, getMessages, performanceGraph, programAddingDeadline, progressResult, recentMessage, resendResult, sendMessages,  studentAddingDeadline,  topDashboard } from "../controllers/customController.js";
import upload from "../middlewares/imageUpload.js";

const router = express.Router();

router.get('/topdashboard', topDashboard);
router.get('/performance', performanceGraph);
router.get('/resendresult', resendResult);
router.get('/progressresult', progressResult);
// router.put('/addlimits', addLimits);
// router.put('/stagecount'   , stageCount)
// router.get('/showlimits' , showLimits)
// router.get('/showstagecount' , showStageCount)
//................................................................
router.post('/sendmessage', sendMessages);
router.get('/recentmessage', recentMessage);
router.get('/getmessage', getMessages);
router.delete('/deletemessage' , authenticateJWT , authenticatedAdmin , deleteMessages)
//.................................................................
router.put('/idcardui'  ,upload.single("cardBg"), addIdCardUi);
router.get('/getidcard'  , getIdCardUi);

// ................................................................
router.post('/adddeadline' , authenticateJWT ,authenticatedAdmin , addDeadline)
router.get('/studentaddingdeadline' , authenticateJWT  , studentAddingDeadline)
router.get('/programaddingdeadline' , authenticateJWT  , programAddingDeadline)

export default router;