const amqp = require("amqplib");
const { v4: uuidv4 } = require('uuid');

const SEND_QUEUE = 'SendUniversityName';
const RECV_QUEUE = 'RecvUniversityName';

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();

  await channel.assertQueue(SEND_QUEUE, { durable: false });
  await channel.assertQueue(RECV_QUEUE, { durable: false });

  return channel;
}

// university_url을 전송
async function sendUniversityURL(universityUrl) {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(SEND_QUEUE, Buffer.from(universityUrl));
  console.log(`[partner] university_url 전송: ${universityUrl}`);
}

// university_name 수신
async function receiveUniversityName(callback) {
  if (!channel) await connectRabbitMQ();

  channel.consume(RECV_QUEUE, (msg) => {
    const universityName = msg.content.toString();
    console.log(`[partner] university_name 수신: ${universityName}`);
    if (callback) callback(universityName);
  }, { noAck: true });
}

module.exports = {
  sendUniversityURL,
  receiveUniversityName,
};