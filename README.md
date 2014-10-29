#Risk

This is the Risk implementation, with specific folders for different segments of the game:
 * `game` - The core game itself, relationships between pieces, cryptography, etc.
 * `tests` - Tests for the entire implementation
 * `network` - Network communication functionality
 * `ai` - Artificial intelligence implementations are here
 * `ui` - The user interface proxy classes (to communicate with the web interface)
 * `web` - The web interface itself

##Compilation

Just run `comp.sh`, compiled java source files will be placed in bin

##Usage

Simply execute `run.sh`. Tests are executed first and if they fail the main application will not run.

:warning:  ***Make sure your tests pass!***
