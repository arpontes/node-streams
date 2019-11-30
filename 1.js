//Alterando a leitura para string
//process.stdin.setEncoding('utf8');

//Readable Stream, processa a cada LFCR
process.stdin.on("data", line => console.log(line));