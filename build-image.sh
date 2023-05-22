#!/bin/bash
CONT_VERSION="1.1.2"

docker build -t bc/range_frontend:${CONT_VERSION} .
