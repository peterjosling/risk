#!/bin/sh

function listtests() {
    ls fullsrc/tests/* | sed 's/fullsrc\/tests\//uk\.ac\.standrews\.cs\.cs3099\.risk\.tests\./g' | sed 's/Test.*\.java/Test/g'
}

java -cp bin:lib/* org.junit.runner.JUnitCore `listtests`


if [[ $? -ne 0 ]];then
	echo "------------------------------------------------------------------------------"
    echo "TESTS FAILED, not running Risk"
else
	echo "------------------------------------------------------------------------------"
	java -cp bin:lib/* uk.ac.standrews.cs.cs3099.risk.ui.WebInterface $*
fi
