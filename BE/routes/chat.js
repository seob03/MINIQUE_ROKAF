const express = require("express");
const { Server } = require("socket.io");
const router = express.Router();
const path = require('path');
const {ObjectId} = require('mongodb')

// 라우터 정의
router.get("/chat", (요청, 응답) => {
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// 채팅방 DB 저장하는 API
router.get('/chat/request/:writerId', async (요청, 응답)=>{
  await db.collection('chatRoom').insertOne({
    member : [요청.user.id, 요청.params.writerId],
    date : new Date()
  })
  응답.json({message : '채팅방 생성 성공'})
})

// 채팅방 리스트 보여주는 API
router.get('/chat/getChatList', async (요청, 응답)=>{
  let result = await db.collection('chatRoom').find({ member : 요청.user.id }).toArray()
  응답.json(result)
})

// 채팅 전송하는 유저의 정보 return API
router.get('/chat/getUserInfo', async (요청, 응답)=>{
  if (요청.user)
    응답.json(요청.user)
  else
    응답.json({message : "로그인이 안되어있는 유저입니다."})
})

// 클라이언트는 POST 요청으로 { room, user, text } 정보를 전송
router.post('/chat/saveMessage', async (요청, 응답) => {
  try {
    const { room, user, text } = 요청.body;
    if (!room || !user || !text) {
      return 응답.status(400).json({ message: '필수 필드 누락' });
    }
    const messageDoc = { room, user, text, timestamp: new Date().toISOString() };
    await db.collection('chatMessages').insertOne(messageDoc);
    응답.json({ message: '메시지 저장 성공', data: messageDoc });
  } catch (error) {
    console.error("메시지 저장 에러:", error);
    응답.status(500).json({ message: '메시지 저장 실패' });
  }
});

// Socket.IO 설정
router.socketSetup = (server) => {
  const io = require('socket.io')(server, {
    transports: ['websocket', 'polling'], // 두 가지 전송 방식을 모두 지원
    cors: {
      origin: "http://localhost:3000",  // React 앱이 실행 중인 주소
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  
  io.setMaxListeners(0);  // 소켓 리스너 개수 제한을 무제한으로 설정
  // 클라이언트 연결 시 처리
  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`)
    // 연결 해제 시 로그 출력
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
    
    // 특정 room에 join 요청오면 해당 room에 시켜주기
    socket.on('ask-join', async (data) => {
      try {
        console.log(`Socket ${socket.id} 요청: join room ${data}`);
        socket.join(data);
        console.log("join 완료");
      } catch (error) {
        console.error("join 처리 중 에러:", error);
      }
    })
  
    // 유저가 보낸 메세지를 해당 room에 제공하기
    socket.on('message-send', async (data) => {
       try {
        console.log("message-send 이벤트 받음:", data);
        const timestamp = new Date().toISOString();
        // data.room에 해당하는 방에 메시지 브로드캐스트
        io.to(data.room).emit('message-broadcast', { 
          user: data.user, 
          text: data.text, 
          room: data.room,
          timestamp: timestamp
        });
      } catch (error) {
        console.error("message-send 처리 중 에러:", error);
      }
    });
  });

  return io;  // io 객체를 반환
};

module.exports = router;