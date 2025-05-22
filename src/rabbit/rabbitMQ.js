const amqp = require("amqplib");

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
async function sendUniversityURL(university_url) {
  if (!channel) await connectRabbitMQ();
  channel.sendToQueue(
  SEND_QUEUE,
  Buffer.from(university_url),
  {
    replyTo: RECV_QUEUE, // 응답 받을 큐를 명시
  }
);
  console.log(`[partner] university_url 전송: ${university_url}`);
}

// university_name 수신
async function receiveUniversityName(callback) {
  if (!channel) await connectRabbitMQ();

  channel.consume(RECV_QUEUE, (msg) => {
    const universityName = msg.content.toString();
    console.log(`[partner] university_name 수신: ${university_name}`);
    if (callback) callback(university_name);
  }, { noAck: true });
}

module.exports = {
  sendUniversityURL,
  receiveUniversityName,
};