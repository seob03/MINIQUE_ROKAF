const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';

let db

// MongoDB 연결을 한 번만 설정하고 재사용하는 방식
async function connectDB() {
  try {
    const client = await new MongoClient(url).connect();
    console.log('DB 연결 성공');
    db = client.db('forum');  // DB 객체 저장
    return db;  // DB 객체 반환
  } catch (err) {
    console.error('DB 연결 실패:', err);
    throw err;
  }
}

module.exports = connectDB;
