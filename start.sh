set -e

echo "💡 INICIANDO SCRIPT DE DEPLOY 💡"

echo "🛠️ CONFIGURA O NVM 🛠️"
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || { echo "Erro ao carregar o NVM"; exit 1; }

echo "🛠️ CONFIGURA O PATH PARA YARN GLOBAL 🛠️"
export PATH="$PATH:$(yarn global bin)"

echo "🆚 SETA A VERSÃO DO NODE.JS 🆚"
nvm use v22.0.0 || exit 11
echo "Node.js versão: $(node -v)"

echo "⌛⏳ Instalando dependências... ⌛⏳"
yarn install

echo "⌛⏳ Compilando aplicação... ⌛⏳"
yarn build

echo "✍🏻 COPIANDO ARQUIVO ENV ✍🏻"
cp /home/ubuntu/Projetos/shared/conf/.env /home/ubuntu/Projetos/backend/build/

echo "🚀 REINICIANDO APLICAÇÃO COM PM2 🚀"
pm2 restart meu-ingresso-api || pm2 start /home/ubuntu/Projetos/backend/build/server.js --name meu-ingresso-api

echo "🚀🚀🚀 DEPLOY FINALIZADO 🚀🚀🚀"
