const express = require("express");
const { Server } = require("socket.io");
const router = express.Router();
const path = require('path');
const {ObjectId} = require('mongodb');

// 라우터 정의
router.get("/chat", (요청, 응답) => {
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// 채팅방 DB 저장하는 API
router.get('/chat/request/:writerId', async (요청, 응답)=>{
  db = 요청.db
  await db.collection('chatRoom').insertOne({
    member : [요청.user.id, 요청.params.writerId],
    date : new Date()
  })
  응답.json({message : '채팅방 생성 성공'})
})

// 채팅방 리스트 보여주는 API
router.get('/chat/getChatList', async (요청, 응답)=>{
  let db = 요청.db
  let result = await db.collection('chatRoom').find({ member : 요청.user.id }).toArray()
  응답.json(result)
})

// 채팅하려는 유저의 user 정보 전송 API
router.get('/chat/getUserInfo', async (요청, 응답)=>{
  if (요청.user)
    응답.json(요청.user)
})

// Socket.IO 설정
router.socketSetup = (server, db) => {
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
      // 현재 시간을 타임스탬프로 생성
      const timestamp = new Date().toISOString();

      await db.collection('chatMessages').insertOne({
        parentRoom : new ObjectId(data.room),
        content : data.text,
        who : data.username,
        timestamp : timestamp
      })

      io.to(data.room).emit('message-broadcast', { 
        user : data.user, 
        text: data.text, 
        room : data.room,
        timestamp 
      })
    })
  });

  return io;  // io 객체를 반환
};

module.exports = router;