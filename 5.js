const fs = require('fs');
const gzip = require('zlib').createGzip(); //duplex

const strmReadFile = fs.createReadStream('pqd.mp4');
const strmWriteFile = fs.createWriteStream('pqdx.mp4.zip');

strmReadFile.pipe(gzip).pipe(strmWriteFile);

strmWriteFile.on('close', () => console.log(`Arquivo compactado.`));