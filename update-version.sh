#!/bin/bash

# Version numbers for this branch
distver=$(git describe --tag | awk -F- '{print $1}' | sed 's/v//')

for i in *.yml; do
    echo "updating $i"
    sed -i "s/range_frontend:.*$/range_frontend:$distver/" $i
done

FILE=make-dist.sh
echo "updating $FILE"
sed -i "s/distver=\".*\"/distver=\"$distver\"/" $FILE

FILE=build-image.sh
echo "updating $FILE"
sed -i "s/CONT_VERSION=\".*\"/CONT_VERSION=\"$distver\"/" $FILE

FILE=package.json
echo "updating $FILE"
sed -i "s/\"version\": \".*\",/\"version\": \"$distver\",/" $FILE