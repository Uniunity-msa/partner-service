const express = require('express');
const app = express();
const port = 3000;

// MySQL 연결
const db = require('./models/db');

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});