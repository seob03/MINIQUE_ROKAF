const router = require('express').Router()
// 로그인 기능
const passport = require('passport')
const path = require('path');
// 패스워드 암호화
const bcrypt = require('bcrypt');

// 로그인 API
router.post('/tryLogin', async (요청, 응답, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return 응답.status(500).json(error)
    if (!user) return 응답.status(401).json({ success: false, message: info?.message || '로그인 실패' })
    요청.logIn(user, (err) => {
      if (err) return next(err)
      return 응답.json({ success: true, message: info?.message || '로그인 성공' });;  // 로그인 성공 후 응답
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
router.post('/trySignUp', async (요청, 응답) => {
  db = 요청.db;

  // 중복 회원 및 ID 확인
  let isOverlapId = await db.collection('user').findOne({ username: 요청.body.username });
  if (isOverlapId) {
    return 응답.status(400).json({ message: '이미 있는 ID 입니다.' });  // return 추가
  }

  // ID 길이 확인
  if (요청.body.username.length < 4) {
    return 응답.status(400).json({ message: 'ID는 최소 4자 이상이어야 합니다.' });  // return 추가
  } else if (요청.body.username.length > 20) {
    return 응답.status(400).json({ message: 'ID는 20자 이하이어야 합니다.' });  // return 추가
  }

  // PW 길이 확인
  if (요청.body.password.length < 8) {
    return 응답.status(400).json({ message: '비밀번호는 최소 8자 이상이어야 합니다.' });  // return 추가
  } else if (요청.body.password.length > 20) {
    return 응답.status(400).json({ message: '비밀번호는 20자 이하이어야 합니다.' });  // return 추가
  }

  // 비밀번호와 아이디가 모두 존재하는지 확인
  if (요청.body.username && 요청.body.password) {
    const hashedPassword = await bcrypt.hash(요청.body.password, 10);  // saltRounds: 10
    console.log('hashedPassword:', hashedPassword);

    // 사용자 정보 저장
    let result = await db.collection('user').insertOne({
      username: 요청.body.username,
      password: hashedPassword,
    });

    console.log(요청.body.username, "님의 회원가입이 성공적으로 처리되었습니다.");
    return 응답.json({ message: '회원가입에 성공했습니다.' });  // return 추가
  }

  // 아이디 또는 패스워드가 없는 경우
  if (!요청.body.username) {
    return 응답.status(400).json({ message: '아이디를 입력해 주세요.' });  // return 추가
  } else if (!요청.body.password) {
    return 응답.status(400).json({ message: '패스워드를 입력해 주세요.' });  // return 추가
  }
});


// 로그인 확인 API
router.get('/checkLogin', async (요청, 응답) => {
  if (요청.user) 응답.send(true)
  else 응답.send(false)
})

module.exports = router