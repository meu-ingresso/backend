set -e

echo "Configura o NVM"
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Seta a configuração da versão do Node.js"
nvm use v22.0.0 || exit 11
echo "Node.js versão: $(node -v)"

echo "Instalando dependências..."
yarn install

echo "Compilando aplicação..."
yarn build

echo "Copiando arquivo .env para o diretório de build"
cp /home/ubuntu/Projetos/shared/conf/.env /home/ubuntu/Projetos/backend/build/

echo "Reiniciando aplicação com PM2"
pm2 restart meu-ingresso-api || pm2 start build/server.js --name meu-ingresso-api
