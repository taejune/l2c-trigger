#!/bin/bash

docker build --tag azssi/l2c-trigger:v0.0.1 .
docker push azssi/l2c-trigger:v0.0.1
