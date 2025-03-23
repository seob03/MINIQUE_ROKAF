const router = require('express').Router()
const passport = require('passport')
const path = require('path');
const bcrypt = require('bcrypt');

// 로그인 API
router.post('/tryLogin', async (요청, 응답, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error)
    if (!user) return 응답.status(401).json({ success: false, message: info?.message || '로그인 실패' })
    요청.logIn(user, (err) => {
      if (err) return next(err)
      return 응답.json({ success: true, message: info?.message || '로그인 성공' });
    })
  })(요청, 응답, next)
})

// 로그아웃 API
router.post('/logOut', async (요청, 응답) => {
  요청.session.destroy((err) => {
    if (err) {
      return 응답.status(500).send('세션 종료 실패');
    }
    응답.clearCookie('connect.sid');
    응답.send('로그아웃 성공');
  });
})

// 회원가입 페이지 보여주기
router.get('/signUp', async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

// 회원가입 API
router.post('/trySignUp', async (요청, 응답, next) => {
  try {
    const db = 요청.db;
    // 아이디와 비밀번호가 입력되었는지 확인
    if (!요청.body.username)
      return 응답.status(400).json({ message: '아이디를 입력해 주세요.' });
    if (!요청.body.password)
      return 응답.status(400).json({ message: '비밀번호를 입력해 주세요.' });

    // 중복 회원 및 ID 확인
    let isOverlapId = await db.collection('user').findOne({ username: 요청.body.username });
    if (isOverlapId) { return 응답.status(400).json({ message: '이미 있는 ID 입니다.' }); }

    // ID, PW 길이 확인
    if (요청.body.username.length < 4 || 요청.body.username.length > 20)
      return 응답.status(400).json({ message: 'ID는 4~20자여야 합니다.' });
    if (요청.body.password.length < 8 || 요청.body.password.length > 20)
      return 응답.status(400).json({ message: '비밀번호는 8~20자여야 합니다.' });

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(요청.body.password, 10);

    // 사용자 정보 DB 저장
    let result = await db.collection('user').insertOne({ username: 요청.body.username, password: hashedPassword });
    console.log(요청.body.username, "님의 회원가입이 성공적으로 처리되었습니다.");

    // 자동 로그인 처리
    passport.authenticate('local', (error, user, info) => {
      if (error) return 응답.status(500).json(error)
      if (!user) return 응답.status(401).json({ success: false, message: info?.message || '로그인 실패' })
      요청.logIn(user, (err) => {
        if (err) return next(err)
        return 응답.json({ success: true, message: info?.message || '로그인 성공' });
      })
    })(요청, 응답, next)


  } catch (error) {
    console.error('회원가입 오류:', error);
    응답.status(500).json({ message: '서버 오류 발생' });
  }
});


// 로그인 확인 API
router.get('/checkLogin', async (요청, 응답) => {
  if (요청.user) 응답.send(true)
  else 응답.send(false)
})

module.exports = router