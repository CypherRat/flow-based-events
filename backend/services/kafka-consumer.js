const { Kafka } = require('kafkajs');
const fs = require('fs');
// const socketIo = require("socket.io");
const { getSocket } = require('../utils/socketManager')
const kafka = new Kafka({
    clientId: 'client',
    brokers: ['localhost:9096', 'localhost:9098'],
});
// const socket = getSocket();
// console.log(socket,"socket-data");
let flowConfig = []
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
const consumeMessages = async (topic, consumerId) => {
    //   const consumer = kafka.consumer(groupId);
    let messages = [];
    loadFlowConfig();
    // console.log(socket,"consumer-socket");
    try {

        const consumer = kafka.consumer({ groupId: consumerId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                console.log(`Consumer: Received message from ${topic} with key ${message.key} and value ${message.value}`);
                // console.log({ key: message.key, value: message.value },"1234567");
                // console.log(flowConfig, "emit-error");
                const socket = getSocket();

                if (socket) {
                    console.log(socket,"sock")
                    // Emit the flowConfig to the connected clients
                    socket.emit("kafka", flowConfig);
                } else {
                    console.error('Socket is not initialized.');
                }


                messages.push({ key: message.key, value: message.value.toString() });
            },
        });

        return new Promise((resolve) => {
            setTimeout(async () => {
                // await consumer.disconnect();
                resolve(messages);
            }, 5000);
        });
        // console.log(messages,"abcd");
        // return messages;
    } catch (error) {
        console.error('Error consuming messages:', error);
        throw error;
    }
};

module.exports = { kafka, consumeMessages };
