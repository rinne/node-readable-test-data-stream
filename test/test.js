"use strict";

const ReadableTestDataStream = require('../index.js');

(function() {
	var s = new ReadableTestDataStream('a', null, { repeatInput: 10000, encoding: "hex" });
	var d = '';
	s.on('data', function(data) {
		d += data;
	});
	s.on('end', function() {
		if (! d.match(/^(61){10000}$/)) {
			console.error('Unexpected output stream data');
			process.exit(1);
		}
		console.log('OK');
		process.exit(0);
	});
})();
