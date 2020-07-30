const express = require("express");
const multer = require("multer");
const path = require("path");
const { execSync, exec } = require("child_process");
const fs = require("fs");
const csv = require("csv-parse");

const videoRouter = express.Router();

const inputDir = path.join("../", "input");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, inputDir);
	},

	filename: (req, file, cb) => {
		cb(null, "video" + path.extname(file.originalname));
	},
});

let upload = multer({
	storage: storage,
});

videoRouter.post("/", upload.single("video"), (req, res, next) => {
	const shFile = path.join("~/", "Deepfake-Server", "predict.sh");

	let fake_confidence, real_confidence, fps, frame_count;

	const parser = csv({ delimiter: "," }, (err, data) => {
		fake_confidence = parseFloat(data[1][1]);
		real_confidence = 1.0 - fake_confidence;
		const majority = fake_confidence > 0.5 ? "FAKE" : "REAL";
		const confidence = majority === "REAL" ? real_confidence : fake_confidence;
		const real_percent = real_confidence;
		const fake_percent = fake_confidence;

		let response = {
			majority,
			confidence,
			fake_percent,
			real_percent,
			fps,
			frame_count,
		};

		res.json({ ...response, success: true });
	});

	exec(
		`mediainfo --Output="Video;%FrameCount%" ${inputDir}/video.mp4`,
		(err, stdout, stderr) => {
			frame_count = parseInt(stdout);
			exec(
				`mediainfo --Output="Video;%FrameRate%" ${inputDir}/video.mp4`,
				(err, stdout, stderr) => {
					fps = parseFloat(stdout);
					exec(
						`${shFile} ${inputDir} ./result.csv ${frame_count}`,
						(err, stdout, stderr) => {
							console.log(stdout);
							fs.createReadStream("./result.csv").pipe(parser);
						}
					);
				}
			);
		}
	);
});

videoRouter.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "../", "output.mp4"));
});

module.exports = videoRouter;
