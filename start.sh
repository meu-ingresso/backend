#!/bin/bash
set -e

echo "💡 INICIANDO SCRIPT DE DEPLOY 💡"

# Verifica o ambiente
if [ -z "$ENVIRONMENT" ]; then
  echo "❌ ENVIRONMENT não definido. Saindo."
  exit 1
fi

echo "🔍 Ambiente detectado: $ENVIRONMENT"

# Define caminhos com base no ambiente
if [ "$ENVIRONMENT" == "prod" ]; then
  DEPLOY_DIR="/home/ubuntu/Projetos/backend-prod"
  ENV_FILE="/home/ubuntu/Projetos/shared/conf/prod/.env"
  PM2_NAME="meu-ingresso-api-prod"
elif [ "$ENVIRONMENT" == "staging" ]; then
  DEPLOY_DIR="/home/ubuntu/Projetos/backend-staging"
  ENV_FILE="/home/ubuntu/Projetos/shared/conf/staging/.env"
  PM2_NAME="meu-ingresso-api-staging"
else
  echo "❌ Ambiente $ENVIRONMENT não configurado. Saindo."
  exit 1
fi

echo "🛠️ CONFIGURA O NVM 🛠️"
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || { echo "Erro ao carregar o NVM"; exit 1; }

echo "🛠️ CONFIGURA O PATH PARA YARN GLOBAL 🛠️"
export PATH="$PATH:$(yarn global bin)"

echo "🆚 SETA A VERSÃO DO NODE.JS 🆚"
nvm use v22.0.0 || exit 11
echo "Node.js versão: $(node -v)"

echo "📂 Navegando até o diretório: $DEPLOY_DIR"
cd $DEPLOY_DIR

echo "⌛⏳ INSTALANDO DEPENDÊNCIAS... ⌛⏳"
yarn install

echo "⌛⏳ COMPILANDO APLICAÇÃO... ⌛⏳"
yarn build

echo "✍🏻 COPIANDO ARQUIVO ENV ✍🏻"
cp $ENV_FILE $DEPLOY_DIR/build/ || { echo "Erro ao copiar arquivo .env"; exit 1; }

echo "🚀 REINICIANDO APLICAÇÃO COM PM2 🚀"
pm2 restart $PM2_NAME || pm2 start $DEPLOY_DIR/build/server.js --name $PM2_NAME

echo "🚀🚀🚀 DEPLOY FINALIZADO PARA O AMBIENTE $ENVIRONMENT 🚀🚀🚀"
