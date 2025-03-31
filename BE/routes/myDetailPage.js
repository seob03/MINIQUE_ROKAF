const router = require('express').Router()
const path = require('path');
const { ObjectId } = require('mongodb');

// 내 프로필 사진 변경하기
router.post('/myDetail/setProfileImg', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    if (요청.user) {
        await db.collection('user').updateOne({ username: 요청.user.username }, { $set: { profileImg: 요청.body.profileImg } })
        응답.json({ messages: '프로필 변경 성공' });
    } else
        응답.status(500).json({ messages: '프로필 변경 실패' })
})

// 기본 프로필로 변경하기
router.post('/myDetail/setProfileImgToBasic', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    if (요청.user) {
        await db.collection('user').updateOne({ username: 요청.user.username }, { $set: { profileImg: null } })
        응답.json({ messages: '프로필 변경 성공' });
    } else
        응답.status(500).json({ messages: '프로필 변경 실패' })
})

// 내 프로필 사진 받아오기
router.get('/myDetail/getProfileImg', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    if (요청.user) {
        let myInfo = await db.collection('user').findOne({ username: 요청.user.username })
        let myProfileImg = myInfo.profileImg
        응답.json(myProfileImg);
    } else
        응답.status(500).json({ messages: '프로필 응답 실패' })
})

// 내가 판매중인 게시글 받아오기
router.get('/myDetail/getSellingPosts', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let mySellingPosts = await db.collection('post').find({ user_id: 요청.user.id, isSell: { $ne: true } }).toArray()
    응답.json(mySellingPosts);
})

// 내가 판매한 게시글 받아오기
router.get('/myDetail/getSoldPosts', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let mySoldPosts = await db.collection('post').find({ user_id: 요청.user.id, isSell: { $ne: false } }).toArray()
    응답.json(mySoldPosts);
})

// 로그인 된 유저가 찜한 게시글 가져오기
router.get('/myDetail/getFavoritePosts', async (요청, 응답) => {
    const db = 요청.db;
    // 유저가 찜 누른 정보 받아오기 (username과 like 누른 게시글의 id)
    let favoritePostsId = await db.collection('likedPosts').find({ username: 요청.user.username }).toArray()
    // likedPostId를 ObjectId로 변환하여 배열로 저장
    const likedPostIdArray = favoritePostsId.map(post => new ObjectId(post.likedPostId));
    // 해당 ObjectId를 기반으로 해당 게시글들의 정보를 모두 받아온다.
    const favoritePosts = await db.collection('post').find({ _id: { $in: likedPostIdArray } }).toArray();
    // 유저가 좋아요 누른 게시글의 모든 배열을 반환
    응답.json(favoritePosts);
})


module.exports = router