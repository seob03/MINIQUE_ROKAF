const router = require('express').Router()
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));
const path = require('path');

// 판매중인 게시글만 불러오기
router.get('/getPostLists', async (요청, 응답) => {
  const db = 요청.db;
  try {
    let result = await db.collection('post').find({ isSell: { $ne: true } }).toArray();
    응답.json(result);
  }
  catch (error) {
    응답.status(500).send('Database error');
  }
});

// 글쓰기 페이지 API
router.get('/write', async (요청, 응답) => {
  if (요청.user)
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'))
})

// 글 작성 API
router.post('/add', async (요청, 응답) => {
  const db = 요청.db;
  await db.collection('post').insertOne({
    user_id: 요청.user.id,
    username: 요청.user.username,
    productName: 요청.body.productName,
    productDetailContent: 요청.body.productDetailContent,
    productPhoto: 요청.body.productPhoto,
    childAge: 요청.body.childAge,
    productQuality: 요청.body.productQuality,
    higherCategory: 요청.body.higherCategory,
    lowerCategory: 요청.body.lowerCategory,
    region: 요청.body.region,
    productPrice: 요청.body.productPrice,
    like: 0,
    isSell: false
  })
  응답.json({ message: '게시글 작성' });  // 로그인 성공 후 응답
})

module.exports = router