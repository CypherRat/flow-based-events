const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const cors = require("cors");
const { setSocket, getSocket } = require("./utils/socketManager");
const loadHandlers = require("./utils/loadHandlers");
const { run } = require("node:test");
const { json } = require("stream/consumers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3131",
    methods: ["GET", "POST"],
  },
});

// app.use(express.json());
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
    console.error("Error reading flow configs:", err);
    flowConfig = [];
  }
};

const saveFlowConfig = () => {
  try {
    fs.writeFileSync("flow.json", JSON.stringify(flowConfig, null, 2));
  } catch (err) {
    console.error("Error saving flow configs:", err);
  }
};

// app.get("/data", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://jsonplaceholder.typicode.com/users/1"
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching data:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).send("Error fetching data");
//   }
// });

const executeFlow = async (flow) => {
  const nodeMap = new Map(flow.map((node) => [node.id, node]));
  flow = [flow[0]]; // need to be checked later
  for (const node of flow) {
    const handler = handlers[node.data.handler];

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
const runFlow = async ({starterID, data}) => {
  let flow=JSON.parse(JSON.stringify(flowConfig));
  const nodeMap = new Map(flow.map((node) => [node.id, node]));
  let firstNode = (nodeMap.get(starterID));
  console.log("this is firstNode",firstNode);
  let secondNode = (nodeMap.get(firstNode?.next))
  console.log("this is secondNode",secondNode);
  secondNode.input = data;
  flow.unshift(secondNode);
  
  let next = secondNode.id;
  while (next) {
    let node = nodeMap.get(next);
    const handler = handlers[node.data.handler];

    if (handler) {
      await handler(node);
    }
    next = node.next;
    if (next) {
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
  setSocket(socket);
  // getSocket()
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  // socket.on("kafka", runFlow);
socket.on("runFlow", async (info)=>{
 let executedFlow = await runFlow(info)
 console.log("executedFlow",executedFlow);
 socket.emit("flowExecuted",executedFlow)
}
  // (info)=>{
  // console.log("this is the info we got",info);
)

  socket.on("deployFlow", async (flow) => {
    console.log("deployflow")
    try {
      flowConfig = flow;
      saveFlowConfig();
      const executedFlow = await executeFlow(flowConfig);
      console.log(executedFlow);
      if (Array.isArray(executedFlow) && executedFlow.length) {
        socket.emit("deployStatus", {
          success: true,
          message: "Flow deployed and executed successfully!",
        });
        socket.emit("flowExecuted", executedFlow);
      } else {
        socket.emit("deployStatus", {
          success: false,
          message: "Flow cannot be deployed as it has no nodes!",
        });
      }
    } catch (error) {
      console.error("Error deploying flow:", error);
      socket.emit("deployStatus", {
        success: false,
        message: "Failed to deploy and execute flow.",
      });
    }
  });

  socket.on("getFlow", async () => {
    loadFlowConfig();
    socket.emit("flowConfig", flowConfig);
 
    if (flowConfig.length > 0) {
      try {
        const executedFlow = await executeFlow(flowConfig);
        // console.log(executedFlow);
        if (Array.isArray(executedFlow) && executedFlow.length) {
          console.log("okokok");
 
          socket.emit("deployStatus", {
            success: true,
            message: "Flow deployed and executed successfully!",
          });
          socket.emit("flowExecuted", executedFlow);
        } else {
          socket.emit("deployStatus", {
            success: false,
            message: "Flow cannot be deployed as it has no nodes!",
          });
        }
      } catch (error) {
        console.error("Error executing flow:", error);
        socket.emit("deployStatus", {
          success: false,
          message: "Failed to execute flow.",
        });
      }
    }
  });
});
// module.exports = handlers;
server.listen(4000, () => console.log("Server running on port 4000"));
