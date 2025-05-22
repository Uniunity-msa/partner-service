const amqp = require("amqplib");

const RECV_QUEUES = [
  'RecvUniversityName',
  'RecvUniversityID',
  'RecvUniversityLocation'
];
const SEND_QUEUES = [
  'SendUniversityName',
  'SendUniversityID',
  'SendUniversityLocation'
];

let channel;

async function connectRabbitMQ() {
  const rabbitUrl = process.env.RABBIT || 'amqp://localhost'; // env 변수 사용, 없으면 localhost 기본
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  // 모든 RECV 큐 선언
  for (const queue of RECV_QUEUES) {
    await channel.assertQueue(queue, { durable: false });
  }

  return channel;
}

// university_url을 전송
async function sendUniversityURL(university_url) {
  if (!channel) await connectRabbitMQ();

  const recvQueue = getRecvQueueFromSend(queueName);
  if (!recvQueue) {
    throw new Error(`recvQueue를 찾을 수 없습니다: ${queueName}`);
  }

  channel.sendToQueue(
    queueName,
    Buffer.from(JSON.stringify({ university_url })),
    { replyTo: recvQueue }
  );

  console.log(`[partner] university_url 전송: ${university_url} → ${queueName}`);
}

// university_name 수신
async function receiveUniversityData(queueName, callback) {
  if (!channel) await connectRabbitMQ();

  if (!RECV_QUEUES.includes(queueName)) {
    throw new Error(`알 수 없는 수신 큐: ${queueName}`);
  }

  channel.consume(queueName, (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log(`[partner] ${queueName} 수신:`, data);
    if (callback) callback(data);
  }, { noAck: true });
}

// Send 큐 이름을 기반으로 Recv 큐 이름 추출
function getRecvQueueFromSend(sendQueue) {
  const index = SEND_QUEUES.indexOf(sendQueue);
  return index !== -1 ? RECV_QUEUES[index] : null;
}


module.exports = {
  sendUniversityURL,
  receiveUniversityData,
  connectRabbitMQ
};