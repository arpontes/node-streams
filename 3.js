const fs = require('fs');

const strmReadFile = fs.createReadStream('pqd.mp4', {highWaterMark: 10*1024*1024});
const strmWriteFile = fs.createWriteStream('pqd2.mp4');

let totalReads = 0;
let totalBytes = 0;
strmReadFile.on('data', chunk => {
	totalReads++;
	totalBytes += chunk.length;
	console.log(`${chunk.length} bytes movidos.`);

	const result = strmWriteFile.write(chunk);
	if (!result)
		console.log("backpressure!");
});

strmReadFile.on('end', () => strmWriteFile.end());

strmWriteFile.on('close', () => console.log(`Arquivo copiado: ${totalReads} leituras/${totalBytes} bytes.`));