#!/bin/bash

# usage:
# debug.sh down - stop containers
if [ -z "$1" ]
then
    docker-compose -f docker-compose-test.yml up -d
else
    docker-compose -f docker-compose-test.yml $1
fi
