const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var morgan = require('morgan');
var fs = require('fs')

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

var accessLogStream = fs.createWriteStream(path.join('./', 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

mongoose.connect("mongodb+srv://kiki:" + process.env.MONGO_ATLAS_PW + "@cluster0.69i9g.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Connection failed')
  })

/* app.use((req, res, next) => {
  console.log("first")
  next()
}); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images"))) // any requests targeting /images will be granted

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*") // no matter which domain the app is running on -> it is allowed to acces the resources -> send response
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  )   // restrict to domains sending the request with a certain header (request doesnt have to have those headers but it may)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"     // OPTIONS is usually implictly sent as default
  )   // restrict HTTP words that may be used
  next()
  //console.log("lalla",req)
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app



// MONGODB
// USER: kiki
// PASS: IA0wxhBXLE7typ9i
