#!/bin/bash -E

echo ">>> Create screenshots"
echo

./bin/start-playground.sh
./bin/start-selenium.sh
./bin/run-testenv.sh pytest --screenshots

echo
echo ">>> Done"