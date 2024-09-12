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


const { consumeMessages } = require('../services/kafka-consumer');

const kafkaNodeHandler = async (node) => {
  try {
    const { topic, consumerId } = node.data.inputs;

    // console.log(topic, groupId, "abc");
    const messages = await consumeMessages(topic, consumerId );

    node.output = messages;
  } catch (error) {
    console.error('Error in kafkaNode:', error);
    node.output = 'Failed to consume messages';
  }

  return node;
};

module.exports = kafkaNodeHandler;
