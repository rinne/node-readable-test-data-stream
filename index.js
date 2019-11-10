'use strict';

const Readable = require('readable-stream').Readable;

class ReadableTestDataStream extends Readable {
	constructor(data, readableStreamOptions) {
		var opts = {};
		var encoding = undefined;
		if (readableStreamOptions) {
			opts = Object.assign(opts, readableStreamOptions);
			delete opts.repeatInput;
			delete opts.inputEncoding;
		}
		super(opts);
		if (readableStreamOptions) {
			if (readableStreamOptions.hasOwnProperty('inputEncoding')) {
				if (typeof(readableStreamOptions.inputEncoding) === 'string') {
					encoding = readableStreamOptions.inputEncoding;
				} else {
					throw new Error('options.repeatInput must be a string');
				}
			}
			if (readableStreamOptions.hasOwnProperty('repeatInput')) {
				if (Number.isSafeInteger(readableStreamOptions.repeatInput) &&
					(readableStreamOptions.repeatInput >= 1)) {
					this.repeat = readableStreamOptions.repeatInput;
				} else {
					throw new Error('options.repeatInput must be a positive integer');
				}
				delete readableStreamOptions.repeatInput;
			} else {
				this.repeat = 1;
			}
		} else {
			this.repeat = 1;
		}
		this.buf = Buffer.from(data, Buffer.isBuffer(data) ? undefined : encoding);
		this.writebuf = Buffer.alloc(0);
	}
	_read(size) {
		let len, buf;
		do {
			if (this.writebuf.length < 1024) {
				while ((this.writebuf.length < 65536) && (this.repeat > 0)) {
					this.writebuf = Buffer.concat( [ this.writebuf, Buffer.from(this.buf) ] );
					this.repeat--;
				}
			}
			len = Math.ceil(this.writebuf.length / 2);
			if (Number.isSafeInteger(size) && (size > 0)) {
				len = Math.min(len, size);
			}
			buf = this.writebuf.slice(0, len);
			this.writebuf = this.writebuf.slice(len);
		} while ((len > 0) && this.push(buf));
		if ((this.writebuf.length == 0) && (this.repeat < 1)) {
			this.push(null);
		}
	}
}

module.exports = ReadableTestDataStream;
