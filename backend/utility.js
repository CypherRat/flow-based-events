const fs = require("fs");
// const handlers = require("server.js");
const loadHandlers = require("./utils/loadHandlers");
// console.log("these are handlers",handlers);

const handlers = loadHandlers();
console.log("these are handlers",handlers);
const runFlow = async (flow, starterID, data) => {
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
  const loadFlowConfig = () => {
    let flowConfig;
    try {
      console.log("entered into load flow");
      const data = fs.readFileSync("flow.json", "utf8");
      console.log("this is data",data);
      if (data) {
        flowConfig = JSON.parse(data);
      } else {
        flowConfig = [];
      }
      console.log("this is flowconfig",flowConfig);
      return flowConfig
    } catch (err) {
      console.error("Error reading flow configs:", err);
      flowConfig = [];
      return flowConfig
    }
  };


  module.exports = {loadFlowConfig,runFlow};