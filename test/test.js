"use strict";

const assert = require('assert');
const ReadableTestDataStream = require('../index.js');

// Read a stream to the end; strings if it has an encoding, else a Buffer.
function collect(s, cb) {
	var chunks = [];
	s.on('data', function(data) {
		chunks.push(data);
	});
	s.on('end', function() {
		cb((typeof(chunks[0]) === 'string') ? chunks.join('') : Buffer.concat(chunks));
	});
}

var tests = [
	function(next) {
		var s = new ReadableTestDataStream('a', { repeatInput: 10000, encoding: "hex" });
		collect(s, function(d) {
			assert(/^(61){10000}$/.test(d), 'Unexpected output stream data');
			next();
		});
	},
	function(next) {
		// No options: the data once.
		collect(new ReadableTestDataStream('abc'), function(d) {
			assert.strictEqual(d.toString('latin1'), 'abc');
			next();
		});
	},
	function(next) {
		// Buffer input.
		var s = new ReadableTestDataStream(Buffer.from([ 0, 255 ]), { repeatInput: 3 });
		collect(s, function(d) {
			assert.strictEqual(d.toString('hex'), '00ff00ff00ff');
			next();
		});
	},
	function(next) {
		// String input in a given encoding.
		var s = new ReadableTestDataStream('00ff', { repeatInput: 2, inputEncoding: 'hex' });
		collect(s, function(d) {
			assert.strictEqual(d.toString('hex'), '00ff00ff');
			next();
		});
	},
	function(next) {
		// More than the 64 KiB internal buffer.
		var s = new ReadableTestDataStream('xyz', { repeatInput: 100000 });
		collect(s, function(d) {
			assert.strictEqual(d.length, 300000);
			assert.strictEqual(d.toString('latin1'), 'xyz'.repeat(100000));
			next();
		});
	},
	function(next) {
		// The options object is not changed and can be used again.
		var opts = { repeatInput: 5 };
		collect(new ReadableTestDataStream('q', opts), function(d1) {
			collect(new ReadableTestDataStream('q', opts), function(d2) {
				assert.strictEqual(d1.toString('latin1'), 'qqqqq');
				assert.strictEqual(d2.toString('latin1'), 'qqqqq');
				assert.deepStrictEqual(opts, { repeatInput: 5 });
				next();
			});
		});
	},
	function(next) {
		// Bad options are refused.
		[ 0, -1, 1.5, '3', null ].forEach(function(r) {
			assert.throws(function() {
				new ReadableTestDataStream('a', { repeatInput: r });
			}, /options\.repeatInput must be a positive integer/);
		});
		assert.throws(function() {
			new ReadableTestDataStream('a', { inputEncoding: 5 });
		}, /options\.inputEncoding must be a string/);
		next();
	}
];

(function run(i) {
	if (i >= tests.length) {
		console.log('OK');
		process.exit(0);
	}
	try {
		tests[i](function() { run(i + 1); });
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})(0);
