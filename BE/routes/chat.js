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

    socket.on("chatMessage", (data) => {
      console.log("Message received:", data);
      io.emit("chatMessage", data); // 모든 클라이언트에 메시지 브로드캐스트
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;  // io 객체를 반환
};

module.exports = router;