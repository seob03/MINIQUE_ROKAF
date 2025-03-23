const router = require('express').Router()
const { ObjectId } = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
router.use(bodyParser.json({ limit: '10mb' }));


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

// 글 삭제 (및 개설된 채팅방 모두 삭제) API
router.delete('/productDetail/delete/:id', async (요청, 응답) => {
    try {
        const db = 요청.db;
        // 글 정보 조회
        let AuthorPostInfo = await db.collection('post').findOne({ _id: new ObjectId(요청.params.id) });
        if (!AuthorPostInfo) {
            return 응답.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
        }
        // 채팅방 정보 조회
        let exitChatRoom = await db.collection('chatRoom').findOne({ productID: 요청.params.id });

        // 글 작성자가 본인인지 확인
        if (요청.user && 요청.user.id === AuthorPostInfo.user_id) {
            await db.collection('post').deleteOne({ _id: new ObjectId(요청.params.id) });
            // 채팅방이 존재하면 삭제
            if (exitChatRoom) {
                await db.collection('chatRoom').deleteOne({ _id: exitChatRoom._id });
            }
            응답.json({ success: true, message: "게시글이 삭제되었습니다." });
        } else {
            응답.status(403).json({ success: false, message: "삭제 권한이 없습니다." });
        }
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
        응답.status(500).json({ success: false, message: "서버 오류가 발생했습니다." });
    }
});


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