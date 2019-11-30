const fs = require('fs');
const gzip = require('zlib').createGzip(); //duplex

const strmReadFile = fs.createReadStream('pqd.mp4');
const strmWriteFile = fs.createWriteStream('pqdx.mp4.zip');

let totalReads = 0;
let totalWrites = 0;

//Backpressure

strmReadFile.on('data', chunk => {
	console.log(`${totalReads++} - ${chunk.length} bytes lidos.`);
	gzip.write(chunk);
});
gzip.on('data', chunk => {
	console.log(`${totalWrites++} - ${chunk.length} bytes gravados.`);
	strmWriteFile.write(chunk);
});



//Paused mode
/*
strmReadFile.on('data', chunk => {
	console.log(`${totalReads++} - ${chunk.length} bytes lidos.`);

	const result = gzip.write(chunk);
	if (!result) strmReadFile.pause();
});
gzip.on('drain', () => strmReadFile.resume());

gzip.on('data', chunk => {
	console.log(`${totalWrites++} - ${chunk.length} bytes gravados.`);

	const result = strmWriteFile.write(chunk);
	if (!result) gzip.pause();
});
strmWriteFile.on('drain', () => gzip.resume());
*/

strmReadFile.on('end', () => gzip.end());
gzip.on('close', () => strmWriteFile.end());
strmWriteFile.on('close', () => console.log(`Arquivo compactado.`));