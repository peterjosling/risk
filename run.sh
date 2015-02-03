#!/bin/sh

function listtests() {
    ls fullsrc/tests/* | sed 's/fullsrc\/tests\//uk\.ac\.standrews\.cs\.cs3099\.risk\.tests\./g' | sed 's/Test.*\.java/Test/g'
}

java -cp bin:lib/* org.junit.runner.JUnitCore `listtests`

echo "------------------------------------------------------------------------------"

if [[ $? -ne 0 ]];then
    echo "\nTESTS FAILED, not running Risk"
fi

java -cp bin:lib/* uk.ac.standrews.cs.cs3099.risk.game.Main $*
