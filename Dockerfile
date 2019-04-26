FROM node:8

WORKDIR . /app/jacinto/casemanager

RUN npm i npm
RUN npm i -g @adonisjs/cli

COPY ./src/adonisjs .

#RUN cp .env.example .env
RUN npm install


CMD [ "adonis", "serve", "--dev" ]
