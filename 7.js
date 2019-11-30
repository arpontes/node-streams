const stream = require('stream');
const fs = require('fs');
const gzip = require('zlib').createGzip(); //duplex

const strmReadFile = fs.createReadStream('pqd.mp4');
const strmWriteFile = fs.createWriteStream('pqdx.mp4.zip');

let zippedBytes = 0;
const register = new stream.PassThrough();
register.on('data', chunk => zippedBytes += chunk.length);

strmReadFile.pipe(gzip).pipe(register).pipe(strmWriteFile);

strmWriteFile.on('close', () => console.log(`Arquivo compactado. Resultado: ${zippedBytes} bytes`));