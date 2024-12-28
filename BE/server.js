// express 사용
const express = require('express')
const app = express()
// ejs 사용
app.set('view engine', 'ejs') 
// 웹 서버가 public 서빙 제대로 하도록
app.use(express.static('public')); 
// 요청.body 지원
app.use(express.json({ limit: '10mb' })); // JSON 요청 크기 제한을 10MB로 설정
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL-encoded 요청 크기 제한
// react 연동
const path = require('path')
app.use(express.static(path.join(__dirname,'../FE/build')))
// 클라이언트-서버 포트 요청 열기
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // React 프론트엔드 주소
  credentials: true,  // 쿠키 전달 허용
}));;
// URL 파라미터에서 ObjectId 사용
const {ObjectId} = require('mongodb')
// BASE64로 사진 DB에 저장
const bodyParser = require('body-parser');
// 큰 이미지 데이터를 처리하기 위해 제한 증가
app.use(bodyParser.json({ limit: '10mb' })); 
// 로그인 기능
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
// 세션 DB에 저장하기 위한 라이브러리
const MongoStore = require('connect-mongo')
// 로그인 보안 강화 라이브러리
const bcrypt = require('bcrypt')


app.use(session({
  secret: 'express-session-secret-key',
  resave : false,
  path: 'http://localhost:8080',
  saveUninitialized : false,
  cookie: { 
    httpOnly: true,
    secure: false,  // 개발 환경에서는 false로 설정
    sameSite: 'Lax', // SameSite 설정
    maxAge: 60 * 60 * 1000, // 세션 만료 시간
  },
  store: MongoStore.create({
    mongoUrl : 'mongodb://127.0.0.1:27017',
    dbName: 'forum',
  })
}))
app.use(passport.initialize())
app.use(passport.session())



let connectDB = require('./database.js') //database.js 파일 경로
let db
connectDB.then((client)=>{
  console.log('DB 연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log('서버 실행 실패', err)
})

passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  console.log("회원 검증 시작: ", 입력한아이디, 입력한비번)
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  console.log(result)
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  if (result.password == 입력한비번) {
    console.log("비번 일치했습니다.")
    return cb(null, result)
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done) => {
  // console.log("serialize 실행")
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  })
})

passport.deserializeUser((user, done) => {
  // console.log("deserialize 실행")
  process.nextTick(() => {
    return done(null, user)
  })
})


// 데이터베이스에서 데이터를 가져오는 API
app.get('/getDatabase', async (요청, 응답) => {
  try {
    let result = await db.collection('post').find().toArray();
    응답.json(result);  // 프론트엔드로 JSON 데이터 응답
  } catch (error) {
    응답.status(500).send('Database error');
  }
});


app.get('/detail/:id', async (요청, 응답) => {
    let detailPage = await db.collection('post').findOne({_id : new ObjectId(요청.params.id)})
    응답.json(detailPage);
})

// 
app.delete('/delete/:id', async (요청, 응답) => {
  let result = await db.collection('post').deleteOne( { _id : new ObjectId(요청.params.id) } )
  응답.json({message : '삭제완료'})
})

// 현재 로그인된 유저 정보 보내주는 API (NewsWrite.js 에서 사용)
app.get('/getUserInfo', async (요청, 응답) => {
    응답.json(요청.user);
})

app.get('/login', async (요청, 응답) => {
  console.log("로그인 페이지", 요청.user)
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.get('/',  async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.get('/write',  async (요청, 응답) => {
  if (요청.user)
    응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.get('/checkLogin',  async (요청, 응답) => {
  if (요청.user) 응답.send(true);
  else 응답.send(false)
})

// 글쓸 때 받는 API (NewsWrite.js에서 사용)
app.post('/add', async (요청, 응답) => {
  console.log('요청.body 값: ', 요청.body)
  console.log('요청.user 값: ', 요청.user)
  let result = await db.collection('post').insertOne({ 
      user_id: 요청.user.id, // DB의 유저 고유 key_id
      username: 요청.user.username, // 유저가 회원 가입할 때 사용한 아이디
      productName : 요청.body.productName, 
      productDetailContent : 요청.body.productDetailContent,
      productPhoto : 요청.body.productPhoto,
      childAge: 요청.body.childAge,
      productQuality: 요청.body.productQuality,
      productPrice: 요청.body.productPrice
    })

  // 응답이 있어야 fetch의 아래로 내려갈 수 있음
  응답.json({ message: '게시글 작성' });  // 로그인 성공 후 응답
})

app.get('/signUp', async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

// 회원가입 API
app.post('/signUp-POST', async (요청, 응답) => {
  let result = await db.collection('user').insertOne({ 
    nickname : 요청.body.nickname,
    username : 요청.body.username, 
    password : 요청.body.password,
  })
  console.log(요청.body);
})

// 로그인 API
app.post('/login-POST', async (요청, 응답, next) => {
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
app.post('/logOut', async (요청, 응답) => {
  // 세션을 파괴하여 로그아웃 처리
  요청.session.destroy((err) => {
    if (err) {
      return 응답.status(500).send('세션 종료 실패');
    }
    응답.clearCookie('connect.sid'); // 세션 쿠키 삭제
    응답.send('로그아웃 성공');
  });
})