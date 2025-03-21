const express = require("express");
const router = require('express').Router();
const path = require('path');
const { ObjectId } = require('mongodb');


// 로그인 된 유저가 작성한 게시글 받아오기
router.get('/myDetail/getPosts', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let myPosts = await db.collection('post').find({ user_id: 요청.user.id }).toArray()
    응답.json(myPosts);
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