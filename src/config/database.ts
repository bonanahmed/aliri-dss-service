import mongoose from "mongoose";

const connection = async () =>{
  mongoose.connect(
    `mongodb://${process.env.MONGODB_URI}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`
  ), () =>{
    console.log('Database Connection Success');
  }

  let db = mongoose.connection;
  db.on("error", console.error.bind(console, "Database Connection Error"));
  db.once("open", async () => {
    console.log("Database is connected");
  });
}

export default connection;