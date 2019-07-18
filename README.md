[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-space/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)

# Harena Space
Web-based client platform that includes: authoring environment, player engine and the Versum narrative scripting language translator.

## Getting Started

### Running as Docker containers

Get the image from docker hub:

```docker pull datasci4health/harena-space```

Then, run the command to start the docker container:

```docker-compose up```

### Running locally
Install nodejs and npm:
```
# updating and installing curl
sudo apt-get update && sudo apt-get install -y curl 

# installing/updating nodejs/npm LTS
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs npm gcc g++
```

Update npm, install packages and run adonisjs:

```
sudo npm i npm

# installing adonis cli
sudo npm i -g @adonisjs/cli

cd src/adonisjs 
cp .env.example .env

# installing npm packages
npm install

# running adonis
adonis serve --dev

```
Go to http://127.0.0.1:3333/author/author.html


---

# Directory Map

* **author** - Front-end of the authoring environment that runs in the client side. The `author.html` plus the `js/author.js` files are the main modules. The Javascript files of the module are in the `[js]` directory.

* **dccs** - Digital Content Components (DCCs) library. The authoring environment and the generated cases use web components to execute active web tasks, e.g., buttons, animations, inputs, etc. These web components follow the DCC standard and are stored in this directory.

* **infra** - Contains infrastructure related modules, which are shared by the Author and Player platforms -- e.g., the bus service.

* **lib** - External javascript libraries adopted by both platforms (author and player).

* **player** - Kernel of the HTML cases player. This kernel is used by the `translator` module to produce the final HTML version of the cases, which have the player kernel inside them.

* **translator** - Translates the markdown document of a case to the final case executed in the player using HTML, CSS, and Javascript. In the process, it produces an intermediary object representation of the case.

# Getting Started

## Option 1: Access an instance running at our cloud

The link below starts the authoring environment running in our cloud

* http://cloud.lis.ic.unicamp.br/case-notebook/v1/web/author/author.html


## Option 2: Run a local instance as a Docker container

Make sure you have [Docker](https://docs.docker.com/install/#supported-platforms) and [docker-compose](https://docs.docker.com/compose/install/#install-compose) installed, then start the container directly:

```bash
sudo docker run -it -p 80:80 -p 8888:8888 datasci4health/case-notebook 
```

Or via docker-compose:


```bash
sudo docker-compose --url https://github.com/datasci4health/case-notebook/blob/master/docker-compose.yml up
```

After starting the container, got to http://localhost/author/author.html to see the authoring environment.
