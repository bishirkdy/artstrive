import express from "express";
// import { authenticateJWT } from '../middlewares/authentication.js';
import { addIdCardUi, getIdCardUi, getMessages, performanceGraph, progressResult, recentMessage, resendResult, sendMessages,  topDashboard } from "../controllers/customController.js";
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
//.................................................................
router.put('/idcardui'  ,upload.single("cardBg"), addIdCardUi);
router.get('/getidcard'  , getIdCardUi);

export default router;