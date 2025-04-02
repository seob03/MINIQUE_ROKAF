const express = require("express");
const router = express.Router();
const path = require('path');
const { ObjectId } = require('mongodb')

// 라우터 연결
router.get("/chat", (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../../FE/build/index.html'));
});

// 특정 채팅방의 이전 채팅 메시지를 가져오는 API || GET /chat/getChatMessages?room=<roomID>
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
  let { sellerId, productName, productPrice, productFrontPhoto, productID } = 요청.body;
  let sellerInfo = await db.collection('user').findOne({ _id: new ObjectId(sellerId) })
  let sellerName = sellerInfo.username
  let buyerInfo = 요청.user
  let buyerName = buyerInfo.username
  let sellerProfileImg = sellerInfo.profileImg
  let buyerPofileImg = buyerInfo.profileImg
  console.log('buyerInfo:', buyerInfo)
  // 기존 채팅방 확인
  const existingChatRoom = await db.collection('chatRoom').findOne({
    sellerName: sellerName,
    buyerName: buyerName,
    productID: productID
  });

  if (existingChatRoom) {
    return 응답.status(400).json({ message: '이미 존재하는 채팅방입니다.' });
  }

  await db.collection('chatRoom').insertOne({
    member: [요청.user.id, sellerId],
    sellerName: sellerName,
    sellerProfileImg: sellerProfileImg,
    buyerProfileImg: buyerPofileImg,
    buyerName: 요청.user.username,
    productName: productName,
    productPrice: productPrice,
    productFrontPhoto: productFrontPhoto,
    productID: productID,
    date: new Date()
  })

  응답.json({ message: '채팅방 생성 성공' })
})

// 채팅방 리스트 보여주는 API
router.get('/chat/getChatList/', async (요청, 응답) => {
  db = 요청.db
  if (요청.user) {
    let result = await db.collection('chatRoom').find({ member: 요청.user.id }).toArray()
    응답.json(result)
  }
  else
    return 응답.status(400).json({ error: '로그인부터 해주세요.' });
})

// 현재 로그인된 유저의 이름 정보를 받아온다. (chatList (부모)컴포넌트에서 사용할 유저 정보)
router.get('/chat/getUserName', async (요청, 응답) => {
  if (요청.user)
    응답.json(요청.user.username)
  else
    응답.json({ message: "로그인이 안되어있는 유저입니다." })
})

// 채팅 전송하는 유저의 정보 return API (chatRoom (자식)컴포넌트에서 사용할 유저 정보)
router.get('/chat/getUserInfo', async (요청, 응답) => {
  if (요청.user)
    응답.json(요청.user)
  else
    응답.json({ message: "로그인이 안되어있는 유저입니다." })
})

// 채탱방 나가기
router.get('/chat/exitChatRoom/:chatRoomId', async (요청, 응답) => {
  console.log('chatRoomId:', 요청.params.chatRoomId)
  try {
    const db = 요청.db;
    const result = await db.collection('chatRoom').deleteOne({ _id: new ObjectId(요청.params.chatRoomId) });
    if (result.deletedCount === 0) {
      return 응답.status(404).json({ success: false, message: '채팅방을 찾을 수 없습니다.' });
    }
    응답.json({ success: true, message: '채팅방이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('채팅방 삭제 중 오류 발생:', error);
    응답.status(500).json({ success: true, message: '서버 오류가 발생했습니다.' });
  }
});

// 해당 유저의 프로필 사진 가져오기
router.get('/getChatUserProfileImg/:username', async (요청, 응답) => {
  const db = 요청.db;
  try {
    let userProfile = await db.collection('user').findOne({ username: new ObjectId(요청.params.username) })
    let userProfileImg = userProfile.profileImg
    응답.json(userProfileImg);
  }
  catch (error) {
    응답.status(500).send('Database error');
  }
})

module.exports = router;