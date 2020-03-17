FROM node:10

WORKDIR . /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

RUN npm install

RUN git clone https://github.com/datasci4health/harena-manager.git harena-manager

USER node

ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "start"]
