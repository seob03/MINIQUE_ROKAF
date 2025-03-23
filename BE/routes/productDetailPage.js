const router = require('express').Router()
const { ObjectId } = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));
const path = require('path');


// 디테일 페이지 API
router.get('/productDetail/getPageInfo/:id', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let detailPage = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) })
    응답.json(detailPage);
})

// 현재 유저 정보 보내주는 API
router.get('/productDetail/getUserInfo', async (요청, 응답) => {
    if (요청.user)
        응답.json(요청.user);
})

// 글 삭제 API
router.delete('/productDetail/delete/:id', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    if (!db) {
        return 응답.status(500).send('DB 연결 실패');
    }
    let AuthorPostInfo = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) }) // 해당 글의 Obejct 가져오기
    if (요청.user && 요청.user.id === AuthorPostInfo.user_id) { // 글의 작성자가 회원이면서 본인이 맞는 경우에만 삭제하고 true 반환
        await db.collection('post').deleteOne({ _id: new ObjectId(요청.params.id) })
        응답.send(true)
    }
    else {
        응답.send(false)
    }
})

// 판매 완료 처리
router.get('/sold/:id', async (요청, 응답) => {
    const db = 요청.db;
    try {
        await db.collection('post').updateOne(
            { _id: new ObjectId(요청.params.id) },
            { $set: { isSell: true } }
        );
        응답.json({ success: true, message: '판매 완료' });
    } catch (error) {
        console.error("판매 완료 처리 오류:", error);
        응답.status(500).json({ success: false, message: '서버 오류 발생' });
    }
})


module.exports = router