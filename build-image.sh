#!/bin/bash
CONT_VERSION="1.0.1"

docker build -t bc/range_frontend:${CONT_VERSION} .
