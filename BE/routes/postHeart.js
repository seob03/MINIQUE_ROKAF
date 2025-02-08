const router = require('express').Router()
const { ObjectId } = require('mongodb')
const path = require('path');

// 좋아요 추가 DB 반영 API
router.put('/like/:id', async (요청, 응답) => {
  db = 요청.db;
  let result = await db.collection('post').updateOne({ _id: new ObjectId(요청.params.id) }, { $inc: { like: 1 } })
  await db.collection('likedPosts').insertOne({ username: 요청.user.username, likedPostId: 요청.params.id })
  // 응답이 있어야 fetch의 아래로 내려갈 수 있음
  응답.json({ message: '하트 누르기 성공' });  // 로그인 성공 후 응답
})

// 좋아요 삭제 DB 반영 API
router.put('/unlike/:id', async (요청, 응답) => {
  db = 요청.db;
  await db.collection('post').updateOne({ _id: new ObjectId(요청.params.id) }, { $inc: { like: -1 } })
  await db.collection('likedPosts').deleteOne({ username: 요청.user.username, likedPostId: 요청.params.id }) // 찜 눌렀던 게시글 지움
  // 응답이 있어야 fetch의 아래로 내려갈 수 있음
  응답.json({ message: '하트 떼기 성공' });  // 로그인 성공 후 응답
})

// 해당 게시글을 유저가 좋아요를 누른 적이 있는 지 판단하는 API
router.get('/isLikedPost/:PostId', async (요청, 응답) => {
  db = 요청.db
  if (!요청.user) 응답.send(false)
  let isLiked = await db.collection('likedPosts').findOne({ username: 요청.user.username, likedPostId: 요청.params.PostId })
  if (isLiked) 응답.send(true)
  else 응답.send(false)
})


module.exports = router