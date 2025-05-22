const amqp = require("amqplib");

const SEND_QUEUE = 'SendUniversityName';
const RECV_QUEUE = 'RecvUniversityName';

let channel;

async function connectRabbitMQ() {
  const rabbitUrl = process.env.RABBIT || 'amqp://localhost'; // env 변수 사용, 없으면 localhost 기본
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  // await channel.assertQueue(SEND_QUEUE, { durable: false });
  await channel.assertQueue(RECV_QUEUE, { durable: false });

  return channel;
}

// university_url을 전송
async function sendUniversityURL(university_url) {
  if (!channel) await connectRabbitMQ();

  channel.sendToQueue(
  SEND_QUEUE,
  Buffer.from(JSON.stringify({ university_url })),
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
    const data = JSON.parse(msg.content.toString());
    console.log(`[partner] university_name 수신: ${data.university_name}`);
    if (callback) callback(data.university_name);
  }, { noAck: true });
}

module.exports = {
  sendUniversityURL,
  receiveUniversityName,
};