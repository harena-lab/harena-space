FROM node:10

WORKDIR /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

RUN cp .env.example .env
RUN npm install

CMD [ "npm", "start"]
#ENTRYPOINT ["./bootstrap.sh"]
