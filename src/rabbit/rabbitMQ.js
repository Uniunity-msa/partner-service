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
async function sendUniversityURL(university_url, sendQueueName) {
  if (!channel) await connectRabbitMQ();
  let recvQueueName;
  if(sendQueueName == 'SendUniversityName'){
    recvQueueName = 'RecvUniversityName';
  } else if(sendQueueName == 'SendUniversityID'){
    recvQueueName = 'RecvUniversityID';
  } else if(sendQueueName == 'SendUniversityLocation'){
    recvQueueName = 'RecvUniversityLocation'
  } else{
    console.log("명시되지 않은 sendQueueName 입니다.");
  }

  channel.sendToQueue(
    sendQueueName,  // 올바르게 인자로 받은 큐 이름 사용
    Buffer.from(JSON.stringify({ university_url })),
    {
      replyTo: recvQueueName,
    }
  );
  console.log(`[partner] university_url 전송: ${university_url} → ${sendQueueName}`);
}

// university data 수신
async function receiveUniversityData(queueName) {
  if (!channel) await connectRabbitMQ();

  if (!RECV_QUEUES.includes(queueName)) {
    throw new Error(`알 수 없는 수신 큐: ${queueName}`);
  }

  return new Promise((resolve, reject) => {
    channel.consume(queueName, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(`[partner] ${queueName} 수신:`, data);
        channel.ack(msg);  // 메시지 확인(ack)해서 큐에서 제거
        resolve(data);
      } else {
        reject(new Error('메시지를 받지 못했습니다.'));
      }
    }, { noAck: false });  // noAck: false 로 ack를 직접 호출하게 함
  });
}
module.exports = {
  sendUniversityURL,
  receiveUniversityData
};