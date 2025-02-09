const router = require('express').Router()
const { ObjectId } = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));
const path = require('path');

// 해당 글 작성자의 작성 글 모두 제공하는 API
router.get('/userPosts/:user_id', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let posts = await db.collection('post').find({ user_id: 요청.params.user_id }).toArray();
    응답.json(posts);
})

// 해당 글 작성자 정보를 받아오는 API
router.get('/userInfo/:id', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let userInfoData = await db.collection('user').findOne({ _id: new ObjectId(요청.params.id) })
    delete userInfoData.password; // 해당 유저의 password 제거하고 전송
    응답.json(userInfoData);
})

module.exports = router