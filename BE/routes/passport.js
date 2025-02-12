const router = require('express').Router()
// 로그인 기능
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
// 세션 DB에 저장하기 위한 라이브러리
const MongoStore = require('connect-mongo')
// 로그인 보안 강화 라이브러리
const bcrypt = require('bcrypt')

const connectDB = require('../database.js');  // DB 연결 함수 호출
let db;
connectDB().then((database) => {
  db = database;  // 연결된 DB 객체 할당
}).catch((err) => {
  console.log('서버 실행 실패', err);
});

router.use(session({
  secret: 'express-session-secret-key',
  resave: false,
  path: 'http://localhost:8080',
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,  // 개발 환경에서는 false로 설정
    sameSite: 'Lax', // SameSite 설정
    maxAge: 60 * 60 * 1000, // 세션 만료 시간
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'forum',
  })
}))

router.use(passport.initialize())
router.use(passport.session())

passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let userAuthInfo = await db.collection('user').findOne({ username: 입력한아이디 })
  if (!userAuthInfo) {
    return cb(null, false, { message: '존재하지 않는 ID 입니다.' })
  }
  // bcrypt.compare는 비동기 함수이므로 await 사용 필요
  const isPasswordMatch = await bcrypt.compare(입력한비번, userAuthInfo.password);
  if (isPasswordMatch) {
    console.log('비밀번호가 일치합니다. 로그인 성공.')
    return cb(null, userAuthInfo)
  } else {
    console.log('비밀번호가 일치하지 않습니다.')
    return cb(null, false, { message: '비밀번호가 일치하지 않습니다.' });
  }
}))

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username }) // 요청.user의 필드 {id , username}
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user)
  })
})

module.exports = router