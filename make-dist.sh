#!/bin/bash
if [ -z "$2" ]; then
    backenddist=""
else
    backenddist="$2"
fi

distver="0.0.2"

Help() {
    echo "Usage: $1 [test | cert] [backend_release_version] "
    echo "  -h help"
    echo "  test - Make a dev build, otherwise script will make prod build"
    echo "  cert - Make prod build with certificate support"
    exit 0
}

devBuild="prod"
if [ $# -eq 1 ]; then
    if  [ "$1" == "test" ]; then
        devBuild="test"
    elif  [ "$1" == "cert" ]; then
        devBuild="cert"
    elif [ "$1" == "help" ] || [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
        Help $0
    fi
fi

distfolder="$HOME/dist/$backenddist"
if [ -d "$distfolder" ] 
then
    echo "Saving tar files to $distfolder" 
else
    echo "Creating $distfolder folder."
    mkdir $distfolder
fi

echo "Tar docker containers to ./dist"
docker save -o $distfolder/range-frontend.tar bc/range_frontend:$distver
# TODO add switch here to specify which build
if [ $devBuild == "test" ]; then
    echo "copying development docker-compose file."
    cp docker-compose-test.yml $distfolder/docker-compose-frontend.yml
elif [ $devBuild == "cert" ]; then
    echo "copying production docker-compose file."
    cp docker-compose-cert.yml $distfolder/docker-compose-frontend.yml
else
    echo "copying production docker-compose file."
    cp docker-compose-prod.yml $distfolder/docker-compose-frontend.yml
fi

# echo "creating dist tar: dist_$devBuild_$distver.tgz"
# tar czf dist_$devBuild_$distver.tgz dist/
echo "finished"

