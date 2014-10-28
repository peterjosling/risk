#!/bin/sh

printf "Compiling risk..."

bindir=$PWD/bin

cd src
javac -Xlint:unchecked -cp .:../libs/* -d "$bindir" `find . -type f -name *.java`
# javac -Xlint:unchecked -cp .:../libs/* -d "$bindir" `ls | grep .java`
ret=$?

if [[ $ret -eq 0 ]]; then
    echo " done!"
else
    echo " ERROR COMPILING!"
fi

exit $ret
