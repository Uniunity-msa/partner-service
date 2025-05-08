"use strict"

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

//에러 라우팅
const errorController = require("./src/controllers/errorController.js");
require('dotenv').config();

const bcrypt = require('bcrypt');

// 앱 셋팅
// 서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.
app.set("views", "./src/views");
// 서버가 HTML 렌더링을 할 때, EJS엔진을 사용하도록 설정합니다.
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('view options', { delimiter: '<% %>' });

// 스타일(CSS) 적용하기
//static 파일 url로 접근할 수 있도록 
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(bodyParser.json());
//URL을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결

app.use(bodyParser.urlencoded({ extended: true }));

// DB 연결
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log("DB 연결 성공");
        return connection;
    } catch (error) {
        console.error("DB 연결 실패:", error.message);
        process.exit(1); // 연결 실패 시 프로세스 종료
    }
}

connectToDatabase(); // 실행

app.use("/", require("./src/controllers/index.js")); //use -> 미들 웨어를 등록해주는 메서드

//에러처리를 위한 미들웨어 생성

app.use(errorController.logErrors);
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalEroor);

const port = 3003;
app.listen(port, ()=> {
    console.log('running')
})

module.exports = app;
