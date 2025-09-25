import { Server } from "socket.io";
import {
  getAllZones,
  getProgramsByZone,
  getTeamScore,
  studentScoreByZone,
  viewOneResult,
  zoneOfStudent,
} from "../controllers/ioController.js";

export function initSocket(server, allowedOrigin) {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Get all zones
    socket.on("getZones", async (cb) => {
      try {
        const zones = await getAllZones();
        cb({ type: "zones", data: zones });
      } catch (error) {
        cb({ error: "Failed to fetch zones" });
      }
    });

    // Get programs by zone
    socket.on("getZonePrograms", async (zoneId, cb) => {
      try {
        const programs = await getProgramsByZone(zoneId);
        cb({ type: "programs", data: programs });
      } catch (error) {
        cb({ error: "Failed to fetch programs" });
      }
    });
    //get teams score
    socket.on("getTeamScore", async (cb) => {
      try {
        const teamScore = await getTeamScore();        
        cb({ type: "team score", data: teamScore });
      } catch (error) {
        cb({ error: "Failed to fetch team scores" });
      }
    });

    socket.on("getStudentScore", async (zoneId, cb) => {
      try {
        const studentScore = await studentScoreByZone(zoneId);        
        cb({ type: "students score", data: studentScore });
      } catch (error) {
        cb({ error: "Error fetching students" });
      }
    });

    socket.on("getStudentsZones", async (cb) => {
      try {
        const zones = await zoneOfStudent();
        cb({ type: "zones", data: zones });
      } catch (error) {
        cb({ error: "Failed to fetch zones" });
      }
    });

    socket.on("getProgramResult", async (programId, cb) => {
      try {
        const result = await viewOneResult(programId);        
        cb({ type: "zones", data: result });
      } catch (error) {
        cb({ success: false, error: "Failed to fetch program result" });
      }
    });

    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
    });
  });

  return io;
}
