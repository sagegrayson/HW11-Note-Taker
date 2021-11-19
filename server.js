// DEPENDENCIES ================================================
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROUTES ======================================================
// HTML
app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
	res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API
app.get("/api/notes", function (req, res) {
	fs.readFile(__dirname + "/db/db.json", "utf8", function (err, readNotes) {
		if (err) {
			throw err;
		} else {
			res.json(JSON.parse(readNotes));
		}
	});
});

app.post("/api/notes", function (req, res) {
	fs.readFile(__dirname + "/db/db.json", "utf8", function (err, readNotes) {
		if (err) {
			throw err;
		} else {
			readNotes = JSON.parse(readNotes);
			let noteID = readNotes.length;
			let addNote = {
				id: noteID,
				title: req.body.title,
				text: req.body.text,
			};
			let concatNote = readNotes.concat(addNote);
			fs.writeFile(
				__dirname + "/db/db.json",
				JSON.stringify(concatNote),
				function (err, data) {
					if (err) throw err;
					res.json(concatNote);
				}
			);
		}
	});
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
