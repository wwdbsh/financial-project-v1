const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// routers
const indexRouter = require("./router/index");
const stockTimeSeriesRouter = require("./router/stockTimeSeries");

// combining routers
app.use("/", indexRouter);
app.use("/stock-time-series", stockTimeSeriesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

server.listen(process.env.PORT || 4000, () => {
    console.log("Server is running.");
});

module.exports = app;