FROM node:10

#Update stretch repositories
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list

RUN apt update
RUN apt install vim -y

WORKDIR /app

COPY ./src/adonisjs .

#RUN chown node:node /app

RUN npm i npm
RUN npm i -g --unsafe-perm @adonisjs/cli

RUN npm install

#RUN chown node:node /app

#USER node

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "npm", "start"]
ENTRYPOINT ["./bootstrap.sh"]
