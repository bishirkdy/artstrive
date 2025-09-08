import express from 'express';
import { addStudent, deleteStudentById, deleteStudentOneProgram, editStudentById, getAllStudent } from '../controllers/studentController.js';
import { authenticateJWT } from '../middlewares/authentication.js';
import upload from '../middlewares/imageUpload.js';

const router = express.Router();

router.post('/addstudent' ,upload.single("profile") , authenticateJWT,  addStudent)
router.get('/allstudents' , authenticateJWT , getAllStudent)
router.patch('/editstudent/:_id' , upload.single("profile"), authenticateJWT , editStudentById)
router.delete('/deletestudent' , authenticateJWT , deleteStudentById)
router.delete('/deletestudentoneprogram' , authenticateJWT , deleteStudentOneProgram)

export default router;