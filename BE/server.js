// express 사용
const express = require('express')
const app = express()
// ejs 사용
app.set('view engine', 'ejs') 
// 웹 서버가 public 서빙 제대로 하도록
app.use(express.static('public')); 
// 요청.body 지원
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// react 연동
const path = require('path')
app.use(express.static(path.join(__dirname,'../FE/build')))
// 클라이언트-서버 포트 요청 열기
const cors = require('cors');
app.use(cors());
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


app.use(session({
  secret: 'MINIQUE_PROJECT_PASSWORD_WITH_MS_HJ',
  resave : false,
  saveUninitialized : false,
  cookie : { maxAge : 60 * 60 * 1000 }, // ms 단위 (1시간으로 설정)
  store: MongoStore.create({
    mongoUrl : 'mongodb://127.0.0.1:27017',
    dbName: 'forum',
  })
}))
app.use(passport.initialize())
app.use(passport.session())

// 회원인지 검증하는 라이브러리 코드
passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  if (result.password == 입력한비번) {
    return cb(null, result)    // 둘째 파라미터 result가 user 값이 됨
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))




let connectDB = require('./database.js') //database.js 파일 경로
let db
connectDB.then((client)=>{
  console.log('DB 연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})

// 데이터베이스에서 데이터를 가져오는 API
app.get('/getDatabase', async (요청, 응답) => {
  try {
    let result = await db.collection('post').find().toArray();
    console.log(result);
    응답.json(result);  // 프론트엔드로 JSON 데이터 응답
  } catch (error) {
    응답.status(500).send('Database error');
  }
});



app.get('/detail/:id', async (요청, 응답) => {
  let detailPage = await db.collection('post').findOne({_id : new ObjectId(요청.params.id)})
  응답.json(detailPage);
})

app.get('/login', async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.get('/',  async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.get('/write',  async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

app.post('/add', async (요청, 응답) => {
  console.log(요청.body)
  let result = await db.collection('post').insertOne({ 
      title : 요청.body.title, 
      content : 요청.body.content,
      photo : 요청.body.photo
    })
})
app.get('/signUp', async (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'))
})

// 회원가입 API
app.post('/signUp-POST', async (요청, 응답) => {
  let result = await db.collection('user').insertOne({ 
    username : 요청.body.username, 
    password : 요청.body.password,
  })
  console.log(요청.body);
})

// 로그인 API
app.post('/login-POST', async (요청, 응답, next) => {
    console.log("로그인 API 호출 성공")
    passport.authenticate('local', (error, user, info) => {
      if (error) return 응답.status(500).json(error)
      if (!user) return 응답.status(401).json(info.message)
      요청.logIn(user, (err) => {
        // 로그인 실패시 에러 메세지가 화면에 뜬다
        if (err) {
          console.log('로그인 실패');
          return next(err)
        }
        // 성공했을 때는 여기에 작성하는 코드를 작동시킨다.
        console.log('로그인 성공');
      })
    })(요청, 응답, next)
})

// 로그인 성공하면 세션 생성 + 제공
passport.serializeUser((user, done) => { // 여기 있는 user는 DB에서 가져온 유저 정보
  console.log("serializeUser 호출 성공")
  console.log(user)
  process.nextTick(() => {
    // 유저가 회원가입한 정보를 가져와서 세션에 데이터 넣는 과정 (유저의 document _id와 username만 저장)
    done(null, { id: user._id, username: user.username })
  })
})
console.log('deserializeUser 호출됨:', user);
// 쿠키 뜯어서 확인
  passport.deserializeUser(async (user, done) => {// user에는 세션에 serializeUser()으로 넣은 데이터가 들어있다.
    console.log('deserializeUser 호출됨:', user);
    try {
        let result = await db.collection('user').findOne({ _id: new ObjectId(user.id) });
        console.log('DB 조회 결과:', result);
        if (!result) {
            return done(new Error('사용자 정보를 찾을 수 없음'));
        }
        done(null, result);
    } catch (error) {
        console.error('deserializeUser 오류:', error);
        done(error);
    }
});
