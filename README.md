#Risk

[![Build Status](https://magnum.travis-ci.com/peterjosling/risk.svg?token=nEtiwcz9kpeowqnZRHXC&branch=peterjosling/travis)](https://magnum.travis-ci.com/peterjosling/risk)

This is the Risk implementation, with specific folders for different segments of the game:
 * `game` - The core game itself, relationships between pieces, cryptography, etc.
 * `tests` - Tests for the entire implementation
 * `network` - Network communication functionality
 * `ai` - Artificial intelligence implementations are here
 * `ui` - The user interface proxy classes (to communicate with the web interface)
 * `www` - The web interface itself

##Compilation

Just run `ant`, compiled java source files will be placed in bin and a jar created

##Tests

Run `ant test`. Additionally, `run.sh` will automatically execute tests and refuse to execute the main application should the tests fail

##Usage

Simply execute `run.sh`. See note above regarding tests.

:warning:  ***Make sure your tests pass!***
