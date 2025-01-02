const router = require('express').Router()
const {ObjectId} = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' })); 
const path = require('path');

// 글 작성 API
router.post('/add', async (요청, 응답) => {
  const db = 요청.db;  // 요청 객체에서 db 가져오기
  let result = await db.collection('post').insertOne({ 
      user_id: 요청.user.id, // DB의 유저 고유 key_id
      username: 요청.user.username, // 유저가 회원 가입할 때 사용한 아이디
      productName : 요청.body.productName, 
      productDetailContent : 요청.body.productDetailContent,
      productPhoto : 요청.body.productPhoto,
      childAge: 요청.body.childAge,
      productQuality: 요청.body.productQuality,
      productPrice: 요청.body.productPrice,
      like: 0 // 찜 개수는 0개가 기본 값
    })
  // 응답이 있어야 fetch의 아래로 내려갈 수 있음
  응답.json({ message: '게시글 작성' });  // 로그인 성공 후 응답
})

// 글 삭제 API
router.delete('/delete/:id', async (요청, 응답) => {
  const db = 요청.db;  // 요청 객체에서 db 가져오기
  console.log('디비 테스트:', db)
  if (!db) {
    return 응답.status(500).send('DB 연결 실패');
  }
  let AuthorPostInfo = await db.collection('post').findOne( { _id : new ObjectId(요청.params.id) } ) // 해당 글의 Obejct 가져오기
  if(요청.user && 요청.user.id === AuthorPostInfo.user_id) { // 글의 작성자가 회원이면서 본인이 맞는 경우에만 삭제하고 true 반환
    await db.collection('post').deleteOne( { _id : new ObjectId(요청.params.id) } )
    응답.send(true)
  }
  else {
    응답.send(false)
  }
})

// 디테일 페이지 API
router.get('/detail/:id', async (요청, 응답) => {
  const db = 요청.db;  // 요청 객체에서 db 가져오기
  let detailPage = await db.collection('post').findOne({_id : new ObjectId(요청.params.id)})
  응답.json(detailPage);
})

// 글쓰기 페이지 API
router.get('/write',  async (요청, 응답) => {
  if (요청.user)
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'))
})

// 현재 유저 정보 보내주는 API (NewsWrite.js 에서 사용)
router.get('/getUserInfo', async (요청, 응답) => {
  응답.json(요청.user);
})

// DB 전송 API (NewsList에서 사용)
router.get('/getDatabase', async (요청, 응답) => {
  db = 요청.db;
  try {
    let result = await db.collection('post').find().toArray();
    응답.json(result);  // 프론트엔드로 JSON 데이터 응답
  } 
  catch (error) {
    응답.status(500).send('Database error');
  }
});

module.exports = router