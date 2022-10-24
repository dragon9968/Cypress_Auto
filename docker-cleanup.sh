#!/usr/bin/env bash

if [[ $(docker images -f "dangling=true" -q) ]]; then
    docker rmi $(docker images -f "dangling=true" -q)
fi
