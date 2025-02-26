const express = require("express");
const router = express.Router();
const path = require('path');
const { ObjectId } = require('mongodb')

// 라우터 정의
router.get("/chat", (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// GET /chat/getChatMessages?room=<roomID>
// 특정 채팅방의 이전 채팅 메시지를 가져오는 API
router.get('/chat/getChatMessages', async (요청, 응답) => {
  try {
    const room = 요청.query.room;
    if (!room) {
      return 응답.status(400).json({ error: 'Room ID is required' });
    }
    // chatMessages 컬렉션에서 해당 room의 메시지를 가져옵니다.
    const messages = await 요청.db
      .collection('chatMessages')
      .find({ room: room })
      .sort({ timestamp: 1 }) // 오래된 메시지부터 정렬 (옵션)
      .toArray();
    return 응답.json(messages);
  } catch (error) {
    console.error('getChatMessages 에러:', error);
    return 응답.status(500).json({ error: '서버 에러' });
  }
});

// 채팅방 DB 저장하는 API
router.post('/chat/request/', async (요청, 응답) => {
  db = 요청.db
  let { sellerId, productName, productPrice, productFrontPhoto } = 요청.body;

  let sellerInfo = await db.collection('user').findOne({ _id: new ObjectId(sellerId) })
  let sellerName = sellerInfo.username
  await db.collection('chatRoom').insertOne({
    member: [요청.user.id, sellerId],
    sellerName: sellerName,
    productName: productName,
    productPrice: productPrice,
    productFrontPhoto: productFrontPhoto,
    date: new Date()
  })

  응답.json({ message: '채팅방 생성 성공' })
})

// 채팅방 리스트 보여주는 API
router.get('/chat/getChatList', async (요청, 응답) => {
  db = 요청.db
  if (요청.user) {
    let result = await db.collection('chatRoom').find({ member: 요청.user.id }).toArray()
    응답.json(result)
  }
  else
    return 응답.status(400).json({ error: '로그인부터 해주세요.' });
})

// 채팅 전송하는 유저의 정보 return API
router.get('/chat/getUserInfo', async (요청, 응답) => {
  if (요청.user)
    응답.json(요청.user)
  else
    응답.json({ message: "로그인이 안되어있는 유저입니다." })
})

// 클라이언트는 POST 요청으로 { room, user, text } 정보를 전송
router.post('/chat/saveMessage', async (요청, 응답) => {
  db = 요청.db
  try {
    const { room, user, text, image, isRead } = 요청.body;
    console.log(요청.user.username, '님이', 요청.body.text, '라고 메시지 전송')
    // console.log('요청.body:', 요청.body)
    // console.log('요청.user', 요청.user)
    if (user != 요청.user.username)
      return 응답.status(500).json({ message: '입력자와 로그인한 유저의 이름이 다름' })
    if (!room || !user || !text) {
      return 응답.status(400).json({ message: '필수 필드 누락' });
    }
    const messageDoc = { room, user, text, timestamp: new Date().toISOString(), image, isRead };
    await db.collection('chatMessages').insertOne(messageDoc);
    응답.json({ message: '메시지 저장 성공', data: messageDoc });
  } catch (error) {
    console.error("메시지 저장 에러:", error);
    응답.status(500).json({ message: '메시지 저장 실패' });
  }
});

module.exports = router;