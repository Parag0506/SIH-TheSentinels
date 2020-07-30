const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const bodyParser = require("body-parser");
const videoRouter = require("./routes/videoRouter");

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res, next) => {
	res.json({ success: true, body: "Welcome to DeepfakeVM Node.js App" });
});

app.use("/video", videoRouter);

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
