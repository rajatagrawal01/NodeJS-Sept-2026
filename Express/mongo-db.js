const { MongoClient } = require("mongodb");
const {mongoose} = require("mongoose")
const username=edurajatagrawal_db_user
const password=AB5Vu3PUiYmia9K7

const uri = `mongodb+srv://${username}:${password}@cluster0.ikkthnl.mongodb.net/`;
// const client = new MongoClient(uri);

async function connectDB() {
  try {
    // await client.connect();
    mongoose.connect(uri)
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("Error while connecting to MongoDB",err);
  }
}

// connectDB()
module.exports = { connectDB };