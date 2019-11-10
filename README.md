In a Nutshell
=============

A dead simple readable stream class that can be used in emitting test
data to some module that consumes data from readable stream or acts as
a writable stream to which the output from this module can be directed
using pipe. The output is not written in optimal chunks but instead it
is chinked in more arbitrary way so that the receiving end must really
read the stream properly in order to get a correct result.


Reference
=========

Create file testfile1 with content "0123456789" repeating 1000 times.

```
'use strict';

const fs = require('fs');
const ReadableTestDataStream = require('readable-test-data-stream');

var s = new ReadableTestDataStream('0123456789', { repeatInput: 1000 });
var d = fs.createWriteStream('testfile1');
s.pipe(d);
```

Create file testfile2 with binary content from hexadecimal buffer
"0123456789abcdefedcba9876543210" repeating 100 times.

```
'use strict';

const fs = require('fs');
const ReadableTestDataStream = require('readable-test-data-stream');

var s = new ReadableTestDataStream('0123456789abcdefedcba987654321',
                                   { inputEncoding: 'hex',
                                     repeatInput: 100 });
var d = fs.createWriteStream('testfile2');
s.pipe(d);
```

Create readable stream of random data.

```
'use strict';

const crypto = require('crypto');
const ReadableTestDataStream = require('readable-test-data-stream');

var s = new ReadableTestDataStream(crypto.randomBytes(0x10000))
s.on('data', function(data) {
  // Do something with data chunk
});
s.on('end', function(data) {
  // All received
});
```

Create readable stream of random data but receive the data from buffer
in BASE64.

```
'use strict';

const crypto = require('crypto');
const ReadableTestDataStream = require('readable-test-data-stream');

var s = new ReadableTestDataStream(crypto.randomBytes(0x10000),
                                   { encoding: 'base64' });
s.on('data', function(data) {
  console.log(data);
});
s.on('end', function(data) {
  process.exit(0);
});
```

Options are standard readable stream options with two
additions. Option inputEncoding can be used to set the encoding of the
input in case it is a string. If the input is a buffer, inputEncoding
is ignored. Option repeatInput can be set to a positive integer value
in order to repeat the input to the stream multiple times.


Disclaimer
==========

This is mainly a test tool. This is by no means an efficient and fast,
because the data is chunked much more than necessary.


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

GPL-2.0
