const router = require('express').Router()

// 회원가입 페이지 보여주기
router.get('/search', async (요청, 응답) => {
    응답.sendFile(path.join(__dirname, '../../FE/build/index.html'))
})

router.get('/searchPost', async (요청, 응답)=>{
    console.log("잘 되는데요")
    let db = 요청.db
    let result = await db.collection('post').find({productName : {$regex : 요청.query.searchData} }).toArray()
    console.log(요청.query.searchData)
    응답.json(result) // 찾은 DB 보내주기
})

module.exports = router