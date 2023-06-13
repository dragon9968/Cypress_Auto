#!/bin/bash
CONT_VERSION="1.2.0"

docker build -t bc/range_frontend:${CONT_VERSION} .
