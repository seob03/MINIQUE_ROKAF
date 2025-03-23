const router = require('express').Router()
const { ObjectId } = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));
const path = require('path');

// 판매중인 게시글만 불러오기
router.get('/getPostLists', async (요청, 응답) => {
  db = 요청.db;
  try {
    let result = await db.collection('post').find({ isSell: { $ne: true } }).toArray();
    응답.json(result);  // 필터링된 JSON 데이터 응답
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
  const db = 요청.db;  // 요청 객체에서 db 가져오기
  await db.collection('post').insertOne({
    user_id: 요청.user.id, // DB의 유저 고유 key_id
    username: 요청.user.username, // 유저가 회원 가입할 때 사용한 아이디
    productName: 요청.body.productName,
    productDetailContent: 요청.body.productDetailContent,
    productPhoto: 요청.body.productPhoto,
    childAge: 요청.body.childAge,
    productQuality: 요청.body.productQuality,
    higherCategory: 요청.body.higherCategory,
    lowerCategory: 요청.body.lowerCategory,
    productPrice: 요청.body.productPrice,
    like: 0, // 찜 개수는 0개가 기본 값
    isSell: false
  })
  // 응답이 있어야 fetch의 아래로 내려갈 수 있음
  응답.json({ message: '게시글 작성' });  // 로그인 성공 후 응답
})

module.exports = router