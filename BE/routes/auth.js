const router = require('express').Router()
// 로그인 기능
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')

// 로그인 API
router.post('/login-POST', async (요청, 응답, next) => {
    passport.authenticate('local', (error, user, info) => {
      if (error) return 응답.status(500).json(error)
      if (!user) return 응답.status(401).json(info.message)
      요청.logIn(user, (err) => {
        if (err) return next(err)
        console.log('로그인 후 세션:', 요청.session);
  
        // 이거 아래 없으면 진짜 큰일난다 이거 5시간 박았음 이거 없으면 쿠키 안생김 왜지?>?
        응답.json({ message: '로그인 성공' });  // 로그인 성공 후 응답
      })
  })(요청, 응답, next)
  })
  
  
  // 로그아웃 API
router.post('/logOut', async (요청, 응답) => {
    // 세션을 파괴하여 로그아웃 처리
    요청.session.destroy((err) => {
      if (err) {
        return 응답.status(500).send('세션 종료 실패');
      }
      응답.clearCookie('connect.sid'); // 세션 쿠키 삭제
      응답.send('로그아웃 성공');
    });
  })

// 회원가입 페이지 보여주기
router.get('/signUp', async (요청, 응답) => {
    응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})
  
// 회원가입 API
router.post('/signUp-POST', async (요청, 응답) => {
    db = 요청.db;
    let result = await db.collection('user').insertOne({ 
        nickname : 요청.body.nickname,
        username : 요청.body.username, 
        password : 요청.body.password,
    })
    console.log(요청.body);
})

// 로그인 확인 API (Header.js랑 NewsWrite.js에서 사용)
router.get('/checkLogin',  async (요청, 응답) => {
  if (요청.user) 응답.send(true)
  else 응답.send(false)
})

module.exports = router