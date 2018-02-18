#!/bin/bash

if [ ! -f login.sh ]; then
    echo "ERROR: login.sh do not exists!"
    echo "Copy the request as 'cUrl' from Chrome dev console where facebook loads the page that looks like this:"
    echo "https://*1.godfather.rykaiju.com/platforms/facebook/game"
    echo "and paste it into a file called login.sh"
    exit
else
    chmod u+x login.sh
fi

if [ ! -f game.html ] || [ test `find "game.html" -mmin +120` ]
then
    echo "Logging in to The Godfather Game"
    ./login.sh > game.html 2> /dev/null

    echo "var C = {}; C.attrs = {};" > game_variables.js
    grep C.attr game.html | grep -v floor >> game_variables.js
    echo "module.exports = C;" >> game_variables.js
else
    echo "Using old session"
fi

TERM=linux node --inspect client.js
