const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
	console.log("Chamada realizada");
	console.log("Enviando arquivo!");
	res.writeHeader(200, { "Content-Type": "video/mp4" });

	fs.createReadStream("pqd.mp4").pipe(res);
});

server.listen(8080, () => console.log("OK"));