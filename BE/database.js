const { MongoClient } = require('mongodb')
const url = 'mongodb://127.0.0.1:27017'
let connectDB = new MongoClient(url).connect()

module.exports = connectDB