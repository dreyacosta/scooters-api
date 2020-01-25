#!/bin/sh

docker build --tag scooters-api:latest .
docker run --detach --name mongo mongo:4-xenial
docker run --rm --tty --name scooters-api-test --link mongo:mongo --env-file .env --env APP_ENV=test scooters-api:latest
