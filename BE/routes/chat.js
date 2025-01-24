const express = require("express");
const { Server } = require("socket.io");
const router = express.Router();

const path = require('path');

// 라우터 정의
router.get("/chat", (req, res) => {
    res.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// Socket.IO 설정
router.socketSetup = (server) => {
  const io = new Server(server);

  // 클라이언트 연결 시 처리
  io.on("connection", (socket) => {
    console.log("A user connected");

    // 유저가 데이터 보내면 아래 코드에서 수령
    socket.on("chatMessage", (data) => {
      console.log("Message received:", data);
    });
    // 서버가 다른 클라이언트들에게 'chatMessage'라는 이름으로 메시지 전송
    io.emit('chatMessage', data); 

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;  // io 객체를 반환
};

module.exports = router;
