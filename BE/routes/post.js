const router = require('express').Router()
const {ObjectId} = require('mongodb')

// 글 삭제하는 API
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

module.exports = router