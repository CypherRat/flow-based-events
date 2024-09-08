const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const cors = require("cors");

const loadHandlers = require("./utils/loadHandlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3131",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:3131" }));
app.use(express.static("../client/out"));

let flowConfig = [];
const handlers = loadHandlers(); // Load and cache handlers at startup

const loadFlowConfig = () => {
  try {
    const data = fs.readFileSync("flow.json", "utf8");
    if (data) {
      flowConfig = JSON.parse(data);
    } else {
      flowConfig = [];
    }
  } catch (err) {
    console.error("Error reading flow config:", err);
    flowConfig = [];
  }
};

const saveFlowConfig = () => {
  try {
    fs.writeFileSync("flow.json", JSON.stringify(flowConfig, null, 2));
  } catch (err) {
    console.error("Error saving flow config:", err);
  }
};

const executeFlow = async (flow) => {
  const nodeMap = new Map(flow.map((node) => [node.id, node]));

  for (const node of flow) {
    const handler = handlers[node.handler];
    if (handler) {
      await handler(node);
    }

    if (node.next) {
      const nextNode = nodeMap.get(node.next);
      if (nextNode) {
        nextNode.input = node.output;
      }
    }
  }
  return flow;
};

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("deployFlow", async (flow) => {
    flowConfig = flow;
    saveFlowConfig();
    const executedFlow = await executeFlow(flowConfig);
    socket.emit("flowExecuted", executedFlow);
  });

  socket.on("getFlow", () => {
    loadFlowConfig();
    socket.emit("flowConfig", flowConfig);
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
