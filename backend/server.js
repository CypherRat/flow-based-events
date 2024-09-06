const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const axios = require("axios");
const cors = require("cors");

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
    if (node.type === "httpRequest") {
      try {
        const response = await axios.get(node.url);
        node.output = response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        node.output = "Failed to fetch data";
      }
    } else if (node.type === "compileJson") {
      node.output = JSON.stringify(node.input, null, 2);
    } else if (node.type === "logAndSave") {
      console.log("Compiled JSON:", node.input);
      fs.writeFileSync("output.txt", node.input);
      node.output = "Saved to output.txt";
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
