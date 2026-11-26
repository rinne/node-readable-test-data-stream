Changelog
=========

Unreleased
----------

- The constructor deleted `repeatInput` from the caller's options
  object, so a second stream made with the same object repeated its
  data only once. The options object is no longer changed.
- A non-string `inputEncoding` threw "options.repeatInput must be a
  string"; the message now names `inputEncoding`.
- More tests: Buffer input, `inputEncoding`, the default repeat,
  output larger than the internal buffer, and bad options.

0.2.0
-----

Published 2020-08-21. Earlier versions are not covered here; see the git
history.
