import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// API Routes
app.use("/api/code", codeRoutes);
app.use("/api/auth", authRoutes);

// ========================================================
// 🟦 Code Execution Route (Docker-Based Compiler)
// ========================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/execute", (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required" });
  }

  const fileId = Date.now();
  let filename, dockerImage, runCmd;

  switch (language) {
    case "python":
      filename = `${fileId}.py`;
      dockerImage = "python:3.10";
      runCmd = `python ${filename}`;
      break;

    case "javascript":
      filename = `${fileId}.js`;
      dockerImage = "node:18";
      runCmd = `node ${filename}`;
      break;

    case "cpp":
      filename = `${fileId}.cpp`;
      dockerImage = "gcc:latest";
      runCmd = `bash -c "g++ ${filename} -o ${fileId} && ./${fileId}"`;
      break;

    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, code);

  exec(
    `docker run --rm -v ${__dirname}:/usr/src/app -w /usr/src/app ${dockerImage} ${runCmd}`,
    (err, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (err) {
        return res.json({ error: stderr || err.message });
      }
      res.json({ output: stdout || stderr });
    }
  );
});



// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("codeChange", (data) => {
    console.log("Code changed:", data);
    // broadcast to all other users
    socket.broadcast.emit("codeUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
