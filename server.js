/* eslint-disable no-param-reassign */
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

const DATA_FILE = path.join(__dirname, "gameData.json");
const GAME_STAT = path.join(__dirname, "gameStat.json");

app.set("port", process.env.PORT || 3000);

app.use("/", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
	res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");
	next();
});

app.get("/api/timers", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		res.setHeader("Cache-Control", "no-cache");
		res.json(JSON.parse(data));
	});
});

// API GET WORDS
app.get("/api/words", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		res.setHeader("Cache-Control", "no-cache");
		res.json(JSON.parse(data));
	});
});

app.get("/api/game", (req, res) => {
	fs.readFile(GAME_STAT, (err, data) => {
		res.setHeader("Cache-Control", "no-cache");
		res.json(JSON.parse(data));
	});
});

app.post("/api/timers", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		const timers = JSON.parse(data);
		const newTimer = {
			title: req.body.title,
			project: req.body.project,
			id: req.body.id,
			elapsed: 0,
			runningSince: null
		};
		timers.push(newTimer);
		fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
			res.setHeader("Cache-Control", "no-cache");
			res.json(timers);
		});
	});
});

app.post("/api/words", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		const definitions = JSON.parse(data);
		const newWord = {
			word: req.body.word,
			definition: req.body.definition,
			player: req.body.player,
			id: req.body.id
		};
		definitions.push(newWord);
		fs.writeFile(DATA_FILE, JSON.stringify(definitions, null, 4), () => {
			res.setHeader("Cache-Control", "no-cache");
			res.json(definitions);
		});
	});
});

app.post("/api/game", (req, res) => {
	fs.readFile(GAME_STAT, (err, data) => {
		const currentStat = JSON.parse(data);
		const newStat = { directorSelected: req.body.directorSelected };
		currentStat.push(newStat);
		fs.writeFile(GAME_STAT, JSON.stringify(currentStat, null, 4), () => {
			res.setHeader("Cache-Control", "no-cache");
			res.json(currentStat);
		});
	});
});

app.post("/api/timers/start", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		const timers = JSON.parse(data);
		timers.forEach(timer => {
			if (timer.id === req.body.id) {
				timer.runningSince = req.body.start;
			}
		});
		fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
			res.json({});
		});
	});
});

app.post("/api/timers/stop", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		const timers = JSON.parse(data);
		timers.forEach(timer => {
			if (timer.id === req.body.id) {
				const delta = req.body.stop - timer.runningSince;
				timer.elapsed += delta;
				timer.runningSince = null;
			}
		});
		fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
			res.json({});
		});
	});
});

app.put("/api/timers", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		const timers = JSON.parse(data);
		timers.forEach(timer => {
			if (timer.id === req.body.id) {
				timer.title = req.body.title;
				timer.project = req.body.project;
			}
		});
		fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
			res.json({});
		});
	});
});

app.put("/api/game", (req, res) => {
	fs.readFile(GAME_STAT, (err, data) => {
		const stat = JSON.parse(data);
		stat[0].directorSelected = req.body.directorSelected;
		fs.writeFile(GAME_STAT, JSON.stringify(stat, null, 4), () => {
			res.json({});
		});
	});
});

app.delete("/api/timers", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		let timers = JSON.parse(data);
		timers = timers.reduce((memo, timer) => {
			if (timer.id === req.body.id) {
				return memo;
			} else {
				return memo.concat(timer);
			}
		}, []);
		fs.writeFile(DATA_FILE, JSON.stringify(timers, null, 4), () => {
			res.json({});
		});
	});
});

app.delete("/api/words", (req, res) => {
	fs.readFile(DATA_FILE, (err, data) => {
		let definitions = JSON.parse(data);
		definitions = definitions.reduce((memo, definition) => {
			if (definition.id !== 0) {
				return memo;
			} else {
				return memo.concat(definition);
			}
		}, []);
		fs.writeFile(DATA_FILE, JSON.stringify(definitions, null, 4), () => {
			res.json({});
		});
	});
});

app.delete("/api/game", (req, res) => {
	fs.readFile(GAME_STAT, (err, data) => {
		let currentStat = JSON.parse(data);
		currentStat = currentStat.reduce((memo, stat) => {
			if (stat.directorSelected === true) {
				return memo;
			} else {
				return memo.concat(stat);
			}
		}, []);
		fs.writeFile(GAME_STAT, JSON.stringify(currentStat, null, 4), () => {
			res.json({});
		});
	});
});

app.get("/molasses", (_, res) => {
	setTimeout(() => {
		res.end();
	}, 5000);
});

app.listen(app.get("port"), () => {
	console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
