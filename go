#!/usr/bin/env bash
set -e -o pipefail

##DOC setup: Sets up the project after first checkout
goal_setup() {
    cd contracts4components.web
    npm install
    cd -
    cd contracts4components.server
    ./gradlew clean install
    cd -
}

##DOC run: Starts the server and runs the test suite once to populate the database
goal_run() {
    cd contracts4components.server
    ./gradlew build
    docker build -t mkainer/contracts4components.server .
    docker run -d -p 8097:8097 --name=contracts4components mkainer/contracts4components.server
    cd -
    cd contracts4components.web
    npm run test:use-case:consumer
    npm run test:use-case:provider
}

TARGET=${1:-}
if type -t "goal_$TARGET" &>/dev/null; then
    "goal_$TARGET" "${@:2}"
else
    echo "usage: $0 <goal>"
    grep -e "^##DOC" < "$(basename "$0")" | sed "s/^##DOC \(.*\)/  \1/" | sort
    exit 1
fi