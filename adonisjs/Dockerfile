FROM node:10

WORKDIR /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/ .

RUN npm install

CMD [ "npm", "start"]
#CMD [ "ls"]
#ENTRYPOINT ["./bootstrap.sh"]
