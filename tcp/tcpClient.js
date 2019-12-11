const fs = require('fs');
const net = require('net');

const socket = new net.Socket();
socket.connect(1234, '127.0.0.1', function () {
    console.log('Conectou! Enviar arquivo...');
    fs.createReadStream('./file.json').pipe(socket).on('end', () => {
        console.log("Terminou de enviar");
    });
});

process.stdin.on('data', () => { });