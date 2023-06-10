require("dotenv").config();
const mongo = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

client.connect((err) => {
  throw err;
});

const db = client.db("QUIZ_APP");
module.exports = db;
