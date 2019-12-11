const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	console.log("Chamada realizada");
	fs.readFile("pqd.mp4", (err, content) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log("Enviando arquivo!");
		res.writeHeader(200, { "Content-Type": "video/mp4" });
		res.end(content);
	});
});

server.listen(8080, () => console.log("OK"));