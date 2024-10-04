import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import Service from "./Service.js";
import { router } from "./router.js";
configDotenv(".env");

const PORT = 5000;
const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "*",
  })
);

app.use("/", router);

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
 
    socket.join(room);
    socket.emit("message", {
      data: {
        user: {
          name: "Admin",
          message: `Hello  ${name}`,
        },
      },
    });

    socket.on("sendMessage",  async ({ message, params }) => {

     const newMessage = Service.SaveRoomNewMessage(Number(params.room),params.name, message)
      io.to(params.room).emit("message", {
        data: {
          user: {
            name: params.name,
            message,
          },
        },
      });
    });
  });

  socket.on("leftRoom", ({ params }) => {
    io.to(params.room).emit("message", {
      data: {
        user: {
          name: "Admin",
          message: `${params.name} has left chat`,
        },
      },
    });
  });
});

async function startApp() {
  try {
    await mongoose.connect(process.env.URL);
    server.listen(PORT);
  } catch (e) {
    console.log(e);
  }
}

//npm run dev
startApp().catch(console.dir);
