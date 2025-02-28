const router = require('express').Router()

// 상위 카테고리 상품 불러오기
router.get('/category/getPosts/:higherCategory', async (요청, 응답) => {
    const db = 요청.db
    let higherCategoryPosts = await db.collection('post').find({ higherCategory: 요청.params.higherCategory }).toArray()
    응답.json(higherCategoryPosts)
})

// 하위 카테고리 상품 불러오기
router.get('/category/getPosts/:nowHigherCategory/:lowerCategory', async (요청, 응답) => {
    const db = 요청.db
    let lowerCategoryPosts = await db.collection('post').find({ higherCategory: 요청.params.nowHigherCategory, lowerCategory: 요청.params.lowerCategory }).toArray()
    응답.json(lowerCategoryPosts)
})

module.exports = router