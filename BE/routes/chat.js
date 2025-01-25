const express = require("express");
const { Server } = require("socket.io");
const router = express.Router();
const path = require('path');

// 라우터 정의
router.get("/chat", (요청, 응답) => {
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// Socket.IO 설정
router.socketSetup = (server) => {
  const io = new Server(server);

  // 클라이언트 연결 시 처리
  io.on("connection", (socket) => {
    console.log("A user connected");
    // 언마운트 -> 연결 해제시 로그 출력
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
    
    // 특정 room에 join 요청오면 해당 room에 시켜주기
    socket.on('ask-join', async (data) => {
      console.log(data , "join 완료")
      socket.join(data)
    })
  
    // 유저가 보낸 메세지를 해당 room에 제공하기
    socket.on('message-send', async (data) => {
      console.log(data , "message-send, socket.on 실행")
      io.to(data.room).emit('message-broadcast', { user : data.user, text: data.text, room : data.room})
    })
  });

  return io;  // io 객체를 반환
};

module.exports = router;