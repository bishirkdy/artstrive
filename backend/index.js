import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectDB } from './db/db.js';
import  authRouter  from './routers/authRouter.js';
import zoneRouter from './routers/zoneRouter.js';
import { errorHandler } from './middlewares/errorHandling.js';
import studentRouter from './routers/studentRouter.js';
import scannedRouter from './routers/scannedRouter.js';
import cookieParser from 'cookie-parser';
import programRouter from './routers/programRouter.js';
import customRouter from './routers/customRouter.js';
import cloudinary from './db/cloudinary.js';

const app = express();
app.set('trust proxy', 1)
const port = process.env.PORT || 5000;
const allowedOrigin = process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
app.use(cors({
    origin: allowedOrigin ,
    methods:['GET','POST','DELETE','UPDATE','PUT','PATCH'],
    credentials:true,
}));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} Origin: ${req.headers.origin}`);
  next();
});
app.options('*', (req, res) => {
  console.log("OPTIONS preflight for", req.originalUrl, "from", req.headers.origin);
  res.sendStatus(204);
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
connectDB();


process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
  });
  
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

app.use('/api/auth/',authRouter);
app.use('/api/zone' , zoneRouter)
app.use('/api/student' , studentRouter)
app.use('/api/program' , programRouter)
app.use('/api/custom' , customRouter)
app.use('/api/scanned' , scannedRouter)
app.use(errorHandler)

cloudinary.api
  .ping()
  .then((result) => console.log("Cloudinary Connected", result))
  .catch((err) => console.error("Connection failed", err));
app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});