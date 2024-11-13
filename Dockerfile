FROM node:22-alpine

WORKDIR /home/
COPY package*.json yarn.* ./
RUN chown -R root:root /home/
RUN yarn install
COPY . .

EXPOSE 5555
CMD [ "yarn", "dev" ]
