const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes/index");

require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", indexRouter);

const mongoURI = process.env.DB_ADDRESS;
const port = process.env.PORT || 5000;
mongoose
    .connect(mongoURI)
    .then(() => console.log(`mongoose connect on ${mongoURI}`))
    .catch((error) => console.log("DB connection fail", error.message));

app.listen(port, () => {
    console.log(`server on ${port}`);
});
