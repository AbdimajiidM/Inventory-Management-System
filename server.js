// import
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const AppError = require("./utils/appError");



// variables from enviroument variables
const port = process.env.PORT || 80;
const DB = process.env.DATABASE_NAME;
const url = `${process.env.MONGO_URL}/${DB}`
const user = process.env.DATABASE_USER;
const pass = process.env.DATABASE_PASSWORD;
const authSource = process.env.AUTHSOURCE;

// Check if Database Exists, if not throw error  

Admin = mongoose.mongo.Admin;
var connection = mongoose.createConnection(url);
connection.on('open', function () {
  new Admin(connection.db).listDatabases(function (err, result) {
    if (!DB) {
      throw new AppError("No conncetion Setting was found", 400)
    }
    var db = result.databases.filter((database) => database.name === DB);
    if (db.length < 1) {
      throw new AppError(`Database Connection Error, ${DB} was not found!`, 400)
    }
  });
});


// connect to mongdb instance with user and password
const options = {
  authSource,
  user,
  pass,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(url, options).then((result) => {
  console.log("DB connection successful!");
}).catch(err => {
  console.log("Database Connection Error" + err)
});

// listen the server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
