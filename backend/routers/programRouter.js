import express from 'express';
import { addCodeLetter, addMarkToPrograms, addProgramsName, addScoreOfAProgram, addStudentToProgram, checkMarkForDeclare, declaredPrograms, declareResults, deletePrograms, editCodeLetter, editPrograms, getAllPrograms, getProgramForCodeLetter, getProgramForCodeLetterForEdit, getProgramsStudentWise, getProgramToDeclare, getStudentsByProgram, getStudentsPoint, getTeamScore, oneStudentProgram, programCount, showDeclaredresults, studentScoreByStage, studentScoreByZone, unDeclareResults, viewMarks, viewOneResult } from '../controllers/programController.js';
import {  authenticateJWT , authenticatedAdmin } from '../middlewares/authentication.js';

const router = express.Router();

router.post('/addprogram' , authenticateJWT , authenticatedAdmin ,addProgramsName)
router.get('/viewprogram' , authenticateJWT , getAllPrograms)
router.patch('/editprogram/:_id' , authenticateJWT , authenticatedAdmin , editPrograms)
router.delete('/deleteprogram',authenticateJWT , authenticatedAdmin ,  deletePrograms)
router.get('/studentdetail/:_id', authenticateJWT , oneStudentProgram)
router.post('/addmarktoprogram', authenticateJWT , authenticatedAdmin , addMarkToPrograms)
router.post('/addstudentstoprogram', authenticateJWT , addStudentToProgram)
router.get('/getstudentbyprogram', authenticateJWT , getStudentsByProgram)
router.get('/getprogramsstudentwise', authenticateJWT , getProgramsStudentWise)

router.get('/getprogramforcodeletter',authenticateJWT , authenticatedAdmin , getProgramForCodeLetter)
router.get('/getprogramforcodeletteforedit',authenticateJWT , authenticatedAdmin , getProgramForCodeLetterForEdit)
router.post('/addcodeletter',authenticateJWT , authenticatedAdmin , addCodeLetter)
router.patch('/editcodeletter',authenticateJWT , authenticatedAdmin , editCodeLetter)
router.post('/addscoreofprogram',authenticateJWT , authenticatedAdmin , addScoreOfAProgram)
router.post('/viewmarks',authenticateJWT , authenticatedAdmin , viewMarks)

router.post('/declare', authenticateJWT , authenticatedAdmin , declareResults)
router.post('/undeclare', authenticateJWT , authenticatedAdmin , unDeclareResults)
router.get('/getprogramtodeclare', authenticateJWT , authenticatedAdmin , getProgramToDeclare)
router.get('/checkmarkfordeclare', authenticateJWT , authenticatedAdmin , checkMarkForDeclare)

router.get('/viewdeclared', authenticateJWT  , showDeclaredresults)
router.get('/alldeclared', authenticateJWT  , declaredPrograms)
router.get('/view/:_id', authenticateJWT , viewOneResult)

router.get('/teamscore' , getTeamScore)
router.get('/studentpoints', authenticateJWT , getStudentsPoint)
router.post('/studentpointsbyzone', authenticateJWT , studentScoreByZone)
router.post('/studentpointsbystage', authenticateJWT , studentScoreByStage)


router.get('/programcount' , programCount)



export default router;