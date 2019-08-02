FROM node:10

WORKDIR /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

RUN npm install

RUN cp .env.example .env
RUN adonis key:generate

#CMD [ "npm", "start"]
ENTRYPOINT ["./bootstrap.sh"]
