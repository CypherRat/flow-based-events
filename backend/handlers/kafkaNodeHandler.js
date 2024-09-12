// const { Kafka } = require('kafkajs');
// const axios = require('axios');


// const kafka = new Kafka({
//   clientId: 'my-consumer',
//   brokers: ['localhost:9096'],
// });

// const consumeMessages = async (topic, groupId) => {
//   const consumer = kafka.consumer({ groupId });
//   let messages = [];

//   try {
//     await consumer.connect();
//     await consumer.subscribe({ topic, fromBeginning: true });

//     await consumer.run({
//       eachMessage: async ({ message }) => {
//         messages.push({ key: message.key.toString(), value: message.value.toString() });
//       },
//     });

//     return new Promise((resolve) => {
//       setTimeout(async () => {
//         await consumer.disconnect();
//         resolve(messages);
//       }, 5000); 
//     });
//   } catch (error) {
//     console.error('Error consuming messages:', error);
//     throw error;
//   }
// // };
// const { consumeMessages } = require('../services/kafka-consumer');

// const kafkaNodeHandler = async (node) => {
//   try {
//     // console.log(node);
    
//     const { topic, consumerId: groupId} = node.data.inputs;

//     console.log(topic,groupId, "abc");
//     const messages = await consumeMessages(topic, groupId);
   

//     node.output = messages;
//   } catch (error) {
//     console.error('Error in kafkaNode:', error);
//     node.output = 'Failed to consume messages';
//   }

//   return node;
// };

// module.exports = kafkaNodeHandler;

const { Kafka } = require('kafkajs');
const fs = require('fs');
// const socketIo = require("socket.io");
const { getSocket } = require('../utils/socketManager')
const kafka = new Kafka({
    clientId: 'client',
    brokers: ['localhost:9096', 'localhost:9098'],
});

// const { runFlow, loadFlowConfig } = require('../utility.js');
const { get } = require('https');

const kafkaNodeHandler = async (node) => {
  try {
    const { topic, consumerId} = node.data.inputs;
    
    // console.log(topic, groupId, "abc");
    const messages = await consumeMessages(topic, consumerId, node.id);
    
    node.output = messages;
  } catch (error) {
    console.error('Error in kafkaNode:', error);
    node.output = 'Failed to consume messages';
  }

  return node;
};



// const socket = getSocket();
// console.log(socket,"socket-data");
// let flowConfig = []
// const loadFlowConfig = () => {
//     try {
//         const data = fs.readFileSync("flow.json", "utf8");
//         if (data) {
//             flowConfig = JSON.parse(data);
//         } else {
//             flowConfig = [];
//         }
//     } catch (err) {
//         console.error("Error reading flow configs:", err);
//         flowConfig = [];
//     }
// };

const consumeMessages = async (topic, consumerId,nodeID) => {
    //   const consumer = kafka.consumer(groupId);
    // let messages = [];
    // loadFlowConfig();
    // console.log(socket,"consumer-socket");
    try {

        const consumer = kafka.consumer({ groupId: consumerId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        // let flow=loadFlowConfig();
        // console.log("this is flow",flow);
        let socket= getSocket();
        // console.log("this is the socket we got",socket);
        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                console.log(`Consumer: Received message from ${topic} with key ${message.key} and value ${message.value}`);
                // console.log({ key: message.key, value: message.value },"1234567");
                // console.log(flowConfig, "emit-error");
                // const socket = getSocket();

                if (socket) {
                    // console.log(socket,"sock")
                    // Emit the flowConfig to the connected clients
                    console.log("emitting kafka data");
                    // socket.emit("kafka",{starterID:nodeID,data:{key:message.key?.toString(),value:message.value.toString()}});
                    socket.emit("kafkaOutput",JSON.stringify({starterID:nodeID,data:{key:message.key?.toString(),value:message.value.toString()}}));
                } else {
                    console.error('Socket is not initialized.');
                }
              // runFlow(flow,nodeID,message.value)
              
                // messages.push({ key: message.key, value: message.value.toString() });
            },
        });

        // return new Promise((resolve) => {
        //     setTimeout(async () => {
        //         // await consumer.disconnect();
        //         resolve(messages);
        //     }, 5000);
        // });
        // console.log(messages,"abcd");
        // return messages;
    } catch (error) {
        console.error('Error consuming messages:', error);
        throw error;
    }
};

//module.exports = { kafka, consumeMessages };

module.exports = kafkaNodeHandler;
