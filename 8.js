const stream = require('stream');


/*
const myWritableStream = new stream.Writable({
    write(chunk, encoding, callback) {
        console.log(chunk.toString());
        setTimeout(() => callback(), 5000);
        //callback();
    }
});
process.stdin.pipe(myWritableStream);
*/
/*
class myWritableStream extends stream.Writable {
    _write(chunk, encoding, callback) {
        console.log(chunk.toString());
        callback();
    }
}
process.stdin.pipe(new myWritableStream());

*/


/*
var idx = 0;
const data = ["André\n", "Pontes\n", "NodeBR\n"];
const myReadableStream = new stream.Readable({
    read(size) {
        this.push(data[idx++]);
        if (idx > data.length)
            this.push(null);
    }
});
myReadableStream.pipe(process.stdout);
*/

/*
class myReadableStream extends stream.Readable {
    constructor(opts) {
        super(opts);

        this.Data = ["André\n", "Pontes\n", "NodeBR\n"];
        this.Idx = 0;
    }

    _read(size) {
        this.push(this.Data[this.Idx++]);
        if (this.Idx > this.Data.length)
            this.push(null);
    }
}
(new myReadableStream()).pipe(process.stdout);
*/



/*
const myTransformStream = new stream.Transform({
    transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
});
process.stdin.pipe(myTransformStream).pipe(process.stdout);
*/


class myTransformStream extends stream.Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}
process.stdin.pipe(new myTransformStream()).pipe(process.stdout);

