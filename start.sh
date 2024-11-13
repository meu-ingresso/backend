#!/bin/bash
echo "configura o nvm"
[[ -s /home/ec2-user/.nvm/nvm.sh ]] && . /home/ec2-user/.nvm/nvm.sh

echo "seta a configuração da versão do node"
nvm use v22.0.0 || exit 11
echo "node version: $(node -v)"

yarn install
yarn build
cd build
cp ../../../../shared/conf/.env .
yarn start
