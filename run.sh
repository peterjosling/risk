#!/bin/sh

java -cp bin:libs/* org.junit.runner.JUnitCore uk.ac.standrews.cs.cs3099.risk.tests.MainTest

echo "------------------------------------------------------------------------------"

if [[ $? -ne 0 ]];then
    echo "\nTESTS FAILED, not running Risk"
fi

java -cp bin:libs/* uk.ac.standrews.cs.cs3099.risk.game.Main $*
