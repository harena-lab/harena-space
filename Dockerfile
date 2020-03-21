FROM node:10

WORKDIR /app

COPY ./src/adonisjs .

#RUN chown node:node /app

RUN npm i npm
RUN npm i -g @adonisjs/cli

RUN npm install

#RUN chown node:node /app

#USER node

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "start"]
ENTRYPOINT ["./bootstrap.sh"]
