import express from "express";
import { authenticatedAdmin, authenticateJWT } from '../middlewares/authentication.js';
import { addDeadline, addIdCardUi, addLimits, deleteMessages, getCountForShowingResult, getIdCardUi, getMessages, getShowingCount, performanceGraph, programAddingDeadline, progressResult, recentMessage, resendResult, sendMessages,  showLimits,  stoppedDeadline,  studentAddingDeadline,  topDashboard, updateShowingCount } from "../controllers/customController.js";
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
router.get('/stopdeadline' , stoppedDeadline)
//.............................................
router.put("/addlimit" , authenticateJWT , authenticatedAdmin , addLimits)
router.get("/showlimits" , authenticateJWT , authenticatedAdmin , showLimits)
//...............................................
router.get("/getcountforshowingresult" , authenticateJWT , authenticatedAdmin , getCountForShowingResult)
router.put("/updateshowingcount" , authenticateJWT , authenticatedAdmin , updateShowingCount)
router.get("/getshowingcount" , authenticateJWT , authenticatedAdmin , getShowingCount)

export default router;