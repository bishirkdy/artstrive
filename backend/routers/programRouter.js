import express from 'express';
import { addCodeLetter, addMarkToPrograms, addProgramsName, addScoreOfAProgram, addStudentToProgram, declaredPrograms, declareResults, deletePrograms, editPrograms, getAllPrograms, getProgramForCodeLetter, getProgramsStudentWise, getProgramToDeclare, getStudentsByProgram, getStudentsPoint, getTeamScore, oneStudentProgram, showDeclaredresults, studentScoreByZone, unDeclareResults, viewMarks, viewOneResult } from '../controllers/programController.js';
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
router.post('/addcodeletter',authenticateJWT , authenticatedAdmin , addCodeLetter)
router.post('/addscoreofprogram',authenticateJWT , authenticatedAdmin , addScoreOfAProgram)
router.post('/viewmarks',authenticateJWT , authenticatedAdmin , viewMarks)

router.post('/declare', authenticateJWT , authenticatedAdmin , declareResults)
router.post('/undeclare', authenticateJWT , authenticatedAdmin , unDeclareResults)
router.get('/getprogramtodeclare', authenticateJWT , authenticatedAdmin , getProgramToDeclare)

router.get('/viewdeclared', authenticateJWT , authenticatedAdmin , showDeclaredresults)
router.get('/alldeclared', authenticateJWT  , declaredPrograms)
router.get('/view/:_id', authenticateJWT , viewOneResult)

router.get('/teamscore', authenticateJWT , getTeamScore)
router.get('/studentpoints', authenticateJWT , getStudentsPoint)
router.post('/studentpointsbyzone', authenticateJWT , studentScoreByZone)



export default router;