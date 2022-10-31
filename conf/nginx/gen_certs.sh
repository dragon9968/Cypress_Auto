#!/bin/bash

mkdir -p certs
# Create RSA PKI keypair
sudo openssl req -x509 -nodes -days 366 -newkey rsa:2048 \
 -subj "/C=US/ST=NONE/L=NONE/O=BC/OU=CRO/CN=localhost" \
 -keyout certs/nginx-selfsigned.key -out certs/nginx-selfsigned.crt
sudo chown $USER:$USER certs/nginx-selfsigned.*

# Create Diffie-Hellman group for Prefect Forward Secrecy
#sudo openssl dhparam -out certs/dhparam.pem 2048
#sudo chown $USER:$USER certs/dhparam.pem