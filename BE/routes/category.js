const router = require('express').Router()

// 상위 카테고리 상품 불러오기
router.get('/category/getHigherPosts/', async (요청, 응답) => {
    const db = 요청.db
    const higherCategory = (요청.query.higherCategory).toUpperCase();
    let higherCategoryPosts = await db.collection('post').find({ higherCategory: higherCategory }).toArray()
    응답.json(higherCategoryPosts)
})

// 하위까지 같은 카테고리 상품 불러오기
router.get('/category/getLowerPosts/', async (요청, 응답) => {
    const db = 요청.db
    const higherCategory = (요청.query.higherCategory).toUpperCase();
    const lowerCategory = 요청.query.lowerCategory;
    let lowerCategoryPosts = await db.collection('post').find({ higherCategory: higherCategory, lowerCategory: lowerCategory }).toArray()
    응답.json(lowerCategoryPosts)
})

module.exports = router