#!/bin/bash
CONT_VERSION="0.0.2"

docker build -t bc/range_frontend:${CONT_VERSION} .
