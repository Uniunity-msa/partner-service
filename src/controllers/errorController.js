const httpStatus =require("http-status-codes");
const path = require('path');

//에러 스택 로깅
exports.logErrors=(error,req,res,next)=>{
    console.error(error.stack);
    next(error);
};

//페이지 부재시 404상태 코드로 응답
exports.respondNoResourceFound=(req,res)=>{
    let errorCode =httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.sendFile(path.resolve(__dirname, `../views/${errorCode}.html`));
};

//요청 처리를 중단시킨 내부 에러에 대한 로깅과 응답(라우트에 매칭되지 않은 모든 요청들을 처리)
exports.respondInternalError=(error,req,res,next)=>{
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.status(errorCode);
    res.send(`${errorCode} | 잘못된 경로로 접근하셨습니다.ÜniÜnity홈으로 재접속해주세요!`);
};
