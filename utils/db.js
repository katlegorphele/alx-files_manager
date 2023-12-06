import { MongoClient } from "mongodb";

const HOST = process.env.DB_HOST || "localhost";
const PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_DATABASE || "files_manager";
const URI = `mongodb://${HOST}:${PORT}`;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class DBClient {
  constructor() {
    try {
      this.client = new MongoClient(URI, OPTIONS);
      this.client.connect();
      this.db = this.client.db(DB_NAME);
    } catch (error) {
      console.log(error);
      this.db = false;
    }
  }

  isAlive() {
    return this.db !== false;
  }

  async nbUsers() {
    return this.db.collection("Users").countDocuments();
  }

  async nbFiles() {
    return this.db.collection("Files").countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
