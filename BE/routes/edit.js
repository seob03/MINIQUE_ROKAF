const router = require('express').Router()
const { ObjectId } = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));
const path = require('path');


// 글 수정 페이지 API
router.get('/edit', async (요청, 응답) => {
    if (요청.user)
        응답.sendFile(path.join(__dirname, '../../FE/build/index.html'))
})

// 수정 버튼 클릭 시에 기존 글 데이터 받아오는 API
router.get('/edit/:id', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let detailPageInfo = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) })
    응답.json(detailPageInfo);
})

// 페이지 DB 수정 API
router.put('/editPost/:id', async (요청, 응답) => {
    db = 요청.db;
    await db.collection('post').updateOne({ _id: new ObjectId(요청.params.id) },
        {
            $set:
            {
                user_id: 요청.user.id, // DB의 유저 고유 key_id
                username: 요청.user.username, // 유저가 회원 가입할 때 사용한 아이디
                productName: 요청.body.productName,
                productDetailContent: 요청.body.productDetailContent,
                productPhoto: 요청.body.productPhoto,
                brand: 요청.body.brand,
                childAge: 요청.body.childAge,
                productQuality: 요청.body.productQuality,
                higherCategory: 요청.body.higherCategory,
                lowerCategory: 요청.body.lowerCategory,
                region: 요청.body.region,
                productPrice: 요청.body.productPrice,
                like: 요청.body.like,
                isSell: 요청.body.isSell
            }
        })
    // 응답이 있어야 fetch의 아래로 내려갈 수 있음
    응답.json({ message: '게시글 수정 성공' });  // 로그인 성공 후 응답
})



module.exports = router