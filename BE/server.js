// express 사용
const express = require('express')
const app = express()

// 웹 서버가 public 서빙 제대로 하도록
app.use(express.static('public'));

// 요청.body 지원
app.use(express.json({ limit: '10mb' })); // JSON 요청 크기 제한을 10MB로 설정
app.use(express.urlencoded({ limit: '10mb', extended: true })); // URL-encoded 요청 크기 제한

// react 연동
const path = require('path')
app.use(express.static(path.join(__dirname, '../FE/build')))

// socket.io 
const { createServer } = require('http')
const { Server } = require("socket.io")
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})
// io 인자로 전달
require("./routes/io.js")(io)

// 클라이언트-서버 포트 요청 열기
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const connectDB = require('./database.js');
let db;
connectDB().then((database) => {
  db = database;  // 연결된 DB 객체 할당
  server.listen(8081, () => {
    console.log('http://localhost:8081 에서 서버 실행중'); // 서버 포트 바꾸면 io에서 연결하는 숫자도 바꿔야함.
  });
}).catch((err) => {
  console.log('서버 실행 실패', err);
});
// DB 연결 후에 미들웨어를 설정합니다.
app.use((요청, 응답, next) => {
  요청.db = db;  // 요청 객체에 db를 추가
  next();  // 다음 미들웨어로 이동
});

// passport 먼저 불러오기 (요청.user 값 할당부터)
app.use('/', require('./routes/passport.js'))
// 라우터로 분리한 파일 불러오기 (요청.user 사용 가능해짐)
app.use('/', require('./routes/post.js'))
app.use('/', require('./routes/category.js'))
app.use('/', require('./routes/edit.js'))
app.use('/', require('./routes/productDetailPage.js'))
app.use('/', require('./routes/search.js'))
app.use('/', require('./routes/auth.js'))
app.use('/', require('./routes/postHeart.js'))
app.use('/', require('./routes/yourDetailPage.js'))
app.use('/', require('./routes/myDetailPage.js'))
app.use('/', require('./routes/chat.js'))
app.use('/', require('./routes/location.js'))

app.get('*', (요청, 응답) => {
  응답.sendFile(path.join(__dirname, '../FE/build/index.html'));
});