// jshint esversion:6

import express from "express";
// import bodyParser from "body-parser";
import _ from "lodash";
import cors from "cors";
import mongoose from "mongoose";
import moment from "moment";

const data = "Working Properly!";
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));
app.use(cors());

mongoose.connect("mongodb://localhost/noveliaDB", {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error: "));

// db.once("open", () => {

// });

const Schema = mongoose.Schema;

const BookInfoSchema = new Schema({
    BookID: Number,
    Name: String,
    Author: String,
    DateOfCreation: Date,
    NoOfChapter: Number
});

const BookInfo = mongoose.model("BookInfo", BookInfoSchema);

let book1 = new BookInfo({
    BookID: "12345",
    Name: "The King of Drugs",
    Author: "Nora Barrett",
    DateOfCreation: moment("20140202", "YYYYMMDD"),
    NoOfChapter: 50
});

book1.save(err => {
    if (err) console.log(err);
})

app.get("/", (req, res) => {
    res.send(data);
});

app.get("/data", (req, res) => {
    BookInfo.findOne({Name: "The King of Drugs"}, (err, book) => {
        if(err) console.log(err);
        else res.send(book);
    });
});

app.listen(9000, () => {
    console.log("Server started on port 9000");
})