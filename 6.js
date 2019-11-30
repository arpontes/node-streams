const fs = require('fs');

process.stdin.pipe(fs.createWriteStream('file.txt'));