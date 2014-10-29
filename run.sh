#!/bin/sh

java -cp bin:lib/* org.junit.runner.JUnitCore uk.ac.standrews.cs.cs3099.risk.tests.MainTest

echo "------------------------------------------------------------------------------"

if [[ $? -ne 0 ]];then
    echo "\nTESTS FAILED, not running Risk"
fi

java -cp bin:lib/* uk.ac.standrews.cs.cs3099.risk.game.Main $*
