#/bin/bash
appdir=/opt/keromatsu
composefile=$appdir/docker-compose-frontend.yml

#default build type
targetCompose="docker-compose-prod.yml"

if  [ "$1" == "test" ]; then
    targetCompose="docker-compose-test.yml"
elif  [ "$1" == "cert" ]; then
    targetCompose="docker-compose-cert.yml"
fi

echo "bring down old containers"
echo
[ -f $composefile ] && docker-compose -f $composefile down

echo "build new containers"
echo
./build-image.sh
./docker-cleanup.sh

echo "restart containers"
echo
#copy docker-compose file to target if doesn't exist
[ ! -f $composefile ] && cp ./$targetCompose $composefile
docker-compose -f $composefile up -d

