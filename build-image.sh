#!/bin/bash
CONT_VERSION="1.1.0"

docker build -t bc/range_frontend:${CONT_VERSION} .
