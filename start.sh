set -e

echo "Configura o NVM"
[[ -s /home/ubuntu/.nvm/nvm.sh ]] && . /home/ubuntu/.nvm/nvm.sh

echo "Seta a configuração da versão do Node.js"

nvm use 22.0.0 || exit 11
echo "Node.js versão: $(node -v)"

echo "Instalando dependências..."
yarn

echo "Compilando aplicação..."
yarn build

echo "Copiando arquivo .env para o diretório de build"
cp /home/ubuntu/Projetos/shared/conf/.env /home/ubuntu/Projetos/backend/build/

echo "Reiniciando aplicação com PM2"
pm2 restart meu-ingresso-api || pm2 start build/server.js --name meu-ingresso-api
