#!/bin/bash

mkdir -p certkeys

cd certkeys

openssl genrsa 2024 > cert_server.key
openssl req -new -key cert_server.key > cert_server.csr
openssl x509 -req -days 365 -signkey cert_server.key < cert_server.csr > cert_server.crt