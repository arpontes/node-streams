const fs = require('fs');
const http = require('http');

const filePath = "pqd.mp4";
const fileSize = fs.statSync(filePath).size;

const server = http.createServer((req, res) => {
	console.log("Chamada realizada");

	let start = 0
	let end = 0;

	const range = req.headers.range;
	if (range) {
		let [startRng, endRng] = range.replace(/bytes=/, "").split("-");
		start = parseInt(startRng, 10);
		end = endRng ? parseInt(endRng, 10) : fileSize - 1;
	}

	res.writeHeader(206, {
		"Content-Type": "video/mp4", "Accept-Ranges": "bytes",
		"Content-Length": (end - start) + 1,
		"Content-Range": `bytes ${start}-${end}/${fileSize}`
	});

	if (range)
		fs.createReadStream(filePath, { start, end }).pipe(res);
	else
		res.end();
});

server.listen(8080, () => console.log("OK"));