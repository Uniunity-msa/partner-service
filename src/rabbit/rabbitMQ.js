const amqp = require("amqplib");

const RECV_QUEUES = [
  'RecvPartnerUniversityName',
  'RecvPartnerUniversityID',
  'RecvPartnerUniversityLocation'
];

let channel;

async function connectRabbitMQ() {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || '5672';
  const rabbitUrl = `amqp://${host}:${port}`;
  const connection = await amqp.connect(rabbitUrl);
  channel = await connection.createChannel();

  // 모든 RECV 큐 선언
  for (const queue of RECV_QUEUES) {
    await channel.assertQueue(queue, { durable: false });
  }
  return channel;
}

function generateCorrelationId() {
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// university_url을 전송
async function sendUniversityURL(university_url, sendQueueName, correlationId) {
  if (!channel) await connectRabbitMQ();

  let recvQueueName;
  if(sendQueueName == 'SendUniversityName'){
    recvQueueName = 'RecvPartnerUniversityName';
  } else if(sendQueueName == 'SendUniversityID'){
    recvQueueName = 'RecvPartnerUniversityID';
  } else if(sendQueueName == 'SendUniversityLocation'){
    recvQueueName = 'RecvPartnerUniversityLocation'
  } else{
    console.log("명시되지 않은 sendQueueName 입니다.");
  }

  channel.sendToQueue(
    sendQueueName,  // 올바르게 인자로 받은 큐 이름 사용
    Buffer.from(JSON.stringify({ university_url })),
    {
      replyTo: recvQueueName,
      correlationId: correlationId,
    }
  );
}

// university data 수신
async function receiveUniversityData(queueName, correlationId) {
  if (!channel) await connectRabbitMQ();

  if (!RECV_QUEUES.includes(queueName)) {
    throw new Error(`알 수 없는 수신 큐: ${queueName}`);
  }

  let attemptCount = 0; // 시도 횟수 카운트

  return new Promise((resolve, reject) => {
    // 큐에서 메시지를 소비
    channel.consume(queueName, async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());

        // 요청 ID(correlationId)를 확인하여 응답을 매칭
        if (data.correlationId === correlationId) {
          channel.ack(msg);  // 처리 완료된 메시지에 대해 ack
          resolve(data);  // 원하는 데이터 반환
        } else {
          channel.ack(msg); // 일치하지 않으면 ack 처리
        }
      } else {
        // 메시지가 없으면 300ms 대기 후 재시도
        if (++attemptCount < 10) {
          setTimeout(() => {
            channel.consume(queueName, async (msg) => {}); // 재시도
          }, 300);
        } else {
          reject(new Error(`${queueName} 큐에서 메시지를 받지 못했습니다.`));
        }
      }
    });
  });
}

module.exports = {
  sendUniversityURL,
  receiveUniversityData,
  generateCorrelationId
};