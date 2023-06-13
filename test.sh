#!/bin/bash
appdir=/opt/keromatsu
composefile=$appdir/docker-compose-frontend.yml
jenkinsArchive=$appdir/jenkins/frontend
mkdir -p $jenkinsArchive

#default build type
targetCompose="docker-compose-prod.yml"

#copy docker-compose file to target if doesn't exist
[ ! -f $composefile ] && cp ./$targetCompose $composefile
destFile="$appdir/docker-compose-frontend.yml"
destBackup="$jenkinsArchive/docker-compose-frontend.yml.bak"
if [ ! -f $composefile ]; then
    echo "docker-compose file does not exist, copying new file to $destFile."
    cp ./$targetCompose $composefile
else
    #compare the two files to see if they are the same
    if cmp -s "$destFile" "./$targetCompose"; then
        echo "docker-compose file is same, skip update."
    else
        echo "new docker-compose file detected, backing up old docker-compose.yml"
        cp "$destFile" "$destBackup"
        echo "updating target compose file"
        cp "./$targetCompose" "$destFile"
    fi
fi
