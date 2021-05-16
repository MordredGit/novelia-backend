// jshint esversion:6

import express from "express";
import _ from "lodash";
import cors from "cors";
import mongoose from "mongoose";
import moment from "moment";

const data = "Working Properly!";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

mongoose.connect("mongodb://localhost/noveliaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  UserID: Number,
  FirstName: String,
  LastName: String,
  DateOfBirth: Date,
  DateOfJoining: Date,
});

const BookFeedbackSchema = new Schema({
  BookID: Number,
  Rating: Number,
  Comments: [{ Commenter: String, Comment: String }],
  Moderator: Number,
});

const LanguageSchema = new Schema({
  LanguageID: Number,
  Name: String,
  Mode: Number,
});

const AdminSchema = new Schema({
  AdminID: Number,
  FullName: String,
  Role: Number,
  DateOfBirth: Date,
});

const GenreSchema = new Schema({
  GenreID: Number,
  Name: String,
  Popularity: Number,
});

const BookInfoSchema = new Schema({
  BookID: Number,
  Name: String,
  Author: String,
  Cover: { data: Buffer, contentType: String },
  DateOfCreation: Date,
  NoOfChapter: Number,
  WrittenLang: Number,
  Genre: Number,
  Popularity: Number,
  LastUpdated: Date,
});

const BookSchema = new Schema({
  BookID: Number,
  InBook: [{ Chapter: String, Content: String }],
});

const User = mongoose.model("User", UserSchema);
const BookFeedback = mongoose.model("BookFeedback", BookFeedbackSchema);
const Language = mongoose.model("Language", LanguageSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Genre = mongoose.model("Genre", GenreSchema);
const BookInfo = mongoose.model("BookInfo", BookInfoSchema);
const Book = mongoose.model("Book", BookSchema);

let book1 = new BookInfo({
  BookID: 12345,
  Name: "The King of Drugs",
  Author: "Nora Barrett",
  DateOfCreation: moment("20140202", "YYYYMMDD"),
  NoOfChapter: 50,
});

let chaptername = "Old Man";

let content =
  "An old man lived in the village. He was one of the most unfortunate people in the world. The whole village was tired of him; he was always gloomy, he constantly complained and was always in a bad mood. The longer he lived, the more bile he was becoming and the more poisonous were his words. People avoided him, because his misfortune became contagious. It was even unnatural and insulting to be happy next to him. He created the feeling of unhappiness in others. But one day, when he turned eighty years old, an incredible thing happened.";

let book1content = new Book({
  BookID: 12345,
  InBook: [
    { Chapter: chaptername, Content: content },
    { Chapter: chaptername, Content: content },
  ],
});

book1.save((err) => {
  if (err) console.log(err);
});

book1content.save((err) => {
  if (err) console.log(err);
});

app.get("/", (req, res) => {
  res.send(data);
});

app.get("/data", (req, res) => {
  BookInfo.findOne({ Name: "The King of Drugs" }, (err, book) => {
    if (err) console.log(err);
    else res.send(book);
  });
});

app.get("/content", (_, res) => {
  Book.findOne({ BookID: 12345 }, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      res.send(book);
    }
  });
});

app.get("/user", (req, res) => {
  User.findOne({UserID: req.body.userid}, (err, userdetails) => {
    if(err) console.log(err);
    else res.send(userdetails);
  });
});


app.listen(9000, () => {
  console.log("Server started on port 9000");
});
