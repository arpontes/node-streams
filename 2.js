const fs = require('fs');

const strmReadFile = fs.createReadStream('pqd.mp4', {highWaterMark: 50*1024*1024});

//flowing mode
/*
let totalReads = 0;
let totalBytes = 0;
strmReadFile.on('data', chunk => {
	totalReads++;
	totalBytes += chunk.length;
	console.log(`${chunk.length} bytes lidos.`);
});

strmReadFile.on('end', chunk => console.log(`Fim - ${totalReads} leituras/${totalBytes} bytes.`));

process.stdin.on("data", ()=>{});

*/

//Paused mode
/*
let totalReads = 0;
let totalBytes = 0;
strmReadFile.pause();
strmReadFile.on('data', chunk => {
	totalReads++;
	totalBytes += chunk.length;
	console.log(`${chunk.length} bytes lidos.`);
})
strmReadFile.on('end', chunk => console.log(`Fim - ${totalReads} leituras/${totalBytes} bytes.`));

process.stdin.on("data", line => {
	if (line.toString() === '\r\n') {
		strmReadFile.read();
	}
});

*/