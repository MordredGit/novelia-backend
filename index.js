// jshint esversion:6

import express from "express";
// import bodyParser from "body-parser";
import _ from "lodash";
import cors from "cors";

const data = "Working Properly!";
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));
app.use(cors());


app.get("/", (req, res) => {
    res.send(data);
});

app.get("/data", (req, res) => {
    res.send(data);
});

app.listen(9000, () => {
    console.log("Server started on port 9000");
})