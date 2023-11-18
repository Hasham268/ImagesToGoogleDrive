const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

mongoose.connect(
  "mongodb+srv://:@cluster0.54c6x8k.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
