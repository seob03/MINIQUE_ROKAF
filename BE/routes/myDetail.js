const express = require("express");
const router = require('express').Router();
const path = require('path');
const {ObjectId} = require('mongodb');


// 로그인 된 유저가 작성한 게시글 받아오기
router.get('/myDetail/getPosts', async (요청, 응답) => {
    const db = 요청.db;  // 요청 객체에서 db 가져오기
    let myPosts = await db.collection('post').find({user_id : 요청.user.id}).toArray()
    응답.json(myPosts);
})


module.exports = router