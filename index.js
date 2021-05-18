// jshint esversion:6

import express from "express";
import _ from "lodash";
import cors from "cors";
import mongoose from "mongoose";
import moment from "moment";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
// import multer from "multer";

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// var upload = multer({ storage: storage });

const data = "Working Properly!";
// Express Initiation
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Passport session initiation
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Mongoose initiation
mongoose.connect("mongodb://localhost/noveliaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));

// Mongoose Schema
const Schema = mongoose.Schema;

const UserConSchema = new Schema({
  username: String,
  email: String,
});

UserConSchema.plugin(passportLocalMongoose);

const UserSchema = new Schema({
  UserID: Number,
  FirstName: String,
  LastName: String,
  DateOfBirth: Date,
  DateOfJoining: Date,
});

const BookFeedbackSchema = new Schema({
  BookID: String,
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
  // BookID: Number,
  Name: String,
  Author: String,
  // Cover: { data: Buffer, contentType: String },
  DateOfCreation: Date,
  NoOfChapter: Number,
  WrittenLang: Number,
  Genre: Number,
  Popularity: Number,
  LastUpdated: Date,
});

const BookSchema = new Schema({
  BookID: String,
  InBook: [{ Chapter: String, Content: String }],
});

// Mongoose models
const UserCon = mongoose.model("UserCon", UserConSchema);
const User = mongoose.model("User", UserSchema);
const BookFeedback = mongoose.model("BookFeedback", BookFeedbackSchema);
const Language = mongoose.model("Language", LanguageSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Genre = mongoose.model("Genre", GenreSchema);
const BookInfo = mongoose.model("BookInfo", BookInfoSchema);
const Book = mongoose.model("Book", BookSchema);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// const LocalStrategy = passportLocalMongoose.Strategy;
passport.use(UserCon.createStrategy());

// let book1 = new BookInfo({
//   // BookID: 12345,
//   Name: "The King of Drugs",
//   Author: "Nora Barrett",
//   DateOfCreation: moment("20140202", "YYYYMMDD"),
//   NoOfChapter: 50,
// });

// let chaptername = "Old Man";
// let content =
//   "An old man lived in the village. He was one of the most unfortunate people in the world. The whole village was tired of him; he was always gloomy, he constantly complained and was always in a bad mood. The longer he lived, the more bile he was becoming and the more poisonous were his words. People avoided him, because his misfortune became contagious. It was even unnatural and insulting to be happy next to him. He created the feeling of unhappiness in others. But one day, when he turned eighty years old, an incredible thing happened.";

// let book1content = new Book({
//   BookID: book1._id,
//   InBook: [
//     { Chapter: chaptername, Content: content },
//     { Chapter: chaptername, Content: content },
//   ],
// });

// book1.save((err) => {
//   if (err) console.log(err);
// });

// book1content.save((err) => {
//   if (err) console.log(err);
// });

app.get("/", (_, res) => {
  res.send(data);
});

app.get("/data", (req, res) => {
  BookInfo.findOne({ Name: "The King of Drugs" }, (err, book) => {
    if (err) console.log(err);
    else res.send(book);
  });
});

// app.post("/content", (req, res) => {
//   console.log(req.body.name);
//   BookInfo.findOne({ Name: req.body.name }, (err, book) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(book);
//       // res.send(book);
//       Book.findOne({BookID: book._id}, (err, content) => {
//         if (err) console.log(err);
//         else {
//           console.log(content);
//           res.send(content);
//         }
//       })
//     }
//   });
// });

app.get("/content/:name", (req, res) => {
  BookInfo.findOne({ Name: req.params.name }, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      // res.send(book);
      if (book) {
        Book.findOne({ BookID: book._id }, (err, content) => {
          if (err) console.log(err);
          else {
            res.send(content);
          }
        });
      } else {
        res.send("No book found");
      }
    }
  });
});

app.get("/user", (req, res) => {
  User.findOne({ UserID: req.body.userid }, (err, userdetails) => {
    if (err) console.log(err);
    else res.send(userdetails);
  });
});

app.post("/createBook", (req, res) => {
  console.log(req.body);
  let newBook = new BookInfo({
    // BookID: 11223 + x,
    cover: req.body.file,
    Name: req.body.name,
    Author: req.body.author,
    DateOfCreation: moment(req.body.date, "YYYYMMDD"),
    NoOfChapter: 0,
  });
  newBook.save((err) => {
    if (err) console.log(err);
  });
  res.send("success");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  console.log(email, username, password);

  // let newUser = new UserCon({
  //   Username: req.body.username,
  //   Email: req.body.email
  // });
  UserCon.register({email: email, username: username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Your account could not be saved. Error: ",
        err,
      });
    } else {
      console.log(user);
      passport.authenticate("local")(req, res, () => {
        // res.send("Successfully registered.");
        res.json({ success: true, message: "Your account has been saved" });
      });
    }
  });
});

app.post("/login", (req, res) => {
  const user = new UserCon({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Your account could not be saved. Error: ",
        err,
      });
    } else {
      passport.authenticate("local")(req, res, function(){
        res.json({ success: true, message: "Your account has been saved" });
      });
    }
  });
})

app.post("/addChapter", (req, res) => {
  BookInfo.findOne(
    { Name: req.body.name, Author: req.body.author },
    (err, book) => {
      if (err) {
        console.log(err);
      } else {
        // res.send(book);
        if (book) {
          // Book.updateOne({BookID: book._id}, {
          //   $push: {
          //     InBook: { Chapter: req.body.chapterName, Content: req.body.chapterContent }
          //   }
          // })
          Book.findOne({ BookID: book._id }, (err, content) => {
            if (err) console.log(err);
            else {
              content.InBook.push({
                Chapter: req.body.chapterName,
                Content: req.body.chapterContent,
              });
              console.log({
                Chapter: req.body.chapterName,
                Content: req.body.chapterContent,
              });
              // console.log(content.InBook);
              content.save((err) => {
                if (err) console.log(err);
              });
              res.send("success");
            }
          });
        } else {
          res.send("No book found");
        }
      }
    }
  );
});

app.listen(9000, () => {
  console.log("Server started on port 9000");
});
