const fs = require('fs');
const stream = require('stream');
const net = require('net');
const json = require('JSONStream');

function buildJsonStream() {
	//O pacote JSONStream converte conteúdo json para objetos utilizando stream, de modo
	//que não é necessário o conteúdo todo do json ser lido para trabalhar com o dado.
	//A configuração [true] diz que trabalharemos com um conteúdo que é um array, e o objeto
	//esperado é todo o bloco de cada índice do array. Se quiséssemos apenas a propriedade 'type',
	//por exemplo, poderíamos passar [true, 'type'], e o dado disponibilizado no evento on 'data' seria
	//apenas o conteúdo da propriedade type.
	const parseStrm = json.parse([true]);

	//Da mesma forma que a leitura, a gravação do dado será feita via stream. O pacote JSONStream também
	//dá suporte à serialização para json via stream. No caso, a regra de negócio diz para separarmos os objetos
	//recebidos de acordo com a propriedade type. Assim, teremos dois streams de escrita que gravarão em dois arquivos diferentes.
	const jsonStrm1 = json.stringify();
	const jsonStrm2 = json.stringify();
	jsonStrm1.pipe(fs.createWriteStream('./fileType1.json'));
	jsonStrm2.pipe(fs.createWriteStream('./fileType2.json'));

	parseStrm.on('data', obj => {
		//Quando entrar nesse método, significa que há um objeto completo (ou seja, um ítem do array foi desserializado)
		//Assim, temos de escolher para qual stream este objeto será serializado, a depender da propriedade 'type';
		//Nesse caso, como há uma escolha para decidir qual será o destino do dado, não utilizaremos o pipe, o que significa
		//que teremos de cuidar do backpressure, pausando a leitura (o que, por sua vez, pausará até o recebimento do dado pela rede)
		//até que o stream de escrita esteja livre para receber mais dados.
		const writeStrm = obj.type === 1 ? jsonStrm1 : jsonStrm2;
		const isFlowing = writeStrm.write(obj);
		if (!isFlowing) {
			parseStrm.pause();

			const fn = () => {
				writeStrm.off('drain', fn);
				parseStrm.resume();
			};
			writeStrm.on('drain', fn);
		}
	});
	//Quando todos os dados tiverem sido processados, fecha os streams de escrita.
	parseStrm.on('end', () => {
		jsonStrm1.end();
		jsonStrm2.end();
	});

	return parseStrm;
}

class CheckType extends stream.Transform {
	constructor(filterType, opts) {
		super({ ...opts, objectMode: true });
		this.filterType = filterType;
	}
	_transform(obj, encoding, callback) {
		if (obj.type === this.filterType)
			this.push(obj);
		callback();
	}
}
function buildJsonPipes() {
	const parseStrm = json.parse([true]);

	//Da mesma forma que a leitura, a gravação do dado será feita via stream. O pacote JSONStream também
	//dá suporte à serialização para json via stream. No caso, a regra de negócio diz para separarmos os objetos
	//recebidos de acordo com a propriedade type. Assim, teremos dois streams de escrita que gravarão em dois arquivos diferentes.
	const jsonStrm1 = json.stringify();
	const jsonStrm2 = json.stringify();
	jsonStrm1.pipe(fs.createWriteStream('./fileType1.json'));
	jsonStrm2.pipe(fs.createWriteStream('./fileType2.json'));

	parseStrm.pipe(new CheckType(1)).pipe(jsonStrm1);
	parseStrm.pipe(new CheckType(2)).pipe(jsonStrm2);

	return parseStrm;
}



//Recebe o arquivo via stream direcionando para um arquivo. Isso porque o processamento do json, que é mais pesado,
//acaba reduzindo bastante a velocidade da transmissão do arquivo pela rede. Assim, fica melhor receber da rede e gravar
//em disco, e depois processar o arquivo em disco, também por stream.
//Neste caso, o método que recebe o arquivo apenas faz um pipe para um arquivo no disco e, quando não houver mais dados,
//o servidor é encerrado e chamamos o método que vai ler o arquivo e fazer o processamento dos dados.
/*
function receiveFileAsStream() {
	const server = net.createServer(socket => {
		const fileName = './newFile.json';
		const writeStrm = fs.createWriteStream(fileName);

		//Os dados recebidos serão direcionados para o arquivo. No término dos dados, chamamos o 
		socket.pipe(writeStrm).on('close', () => {
			console.log("Terminou de receber");
			server.close();

			//O médoto buildJsonStream monta o stream que fará o processamento dos dados recebidos.
			//Lemos o arquivo via stream e fazemos um pipe para o stream que processará o json.
			var strm = buildJsonStream();
			fs.createReadStream(fileName).pipe(strm);
		});
	});
	server.listen(1234);
}
receiveFileAsStream();
*/



//Recebe o arquivo e já vai processando o conteúdo como json e escrevendo para o arquivo de destino
//conforme o dado vai sendo disponibilizado.

function receiveJsonAsStream() {
	//Cria o servidor que vai receber um socket (que, basicamente, é um stream de rede)
	const server = net.createServer(socket => {
		//O médoto buildJsonStream monta o stream que fará o processamento dos dados recebidos.
		var strm = buildJsonPipes();

		//Tudo começa neste ponto! Assim que uma conexão é feita e um socket é disponibilizado, fazemos
		//um pipe para o stream que processará o json. Quando não houver mais dados para receber, fecharemos o servidor.
		socket.pipe(strm).on('close', () => {
			console.log("Terminou de receber");
			server.close();
		});
	});
	//Iniciando servidor na porta 1234.
	server.listen(1234);
}
receiveJsonAsStream();








process.stdin.on('data', () => { });