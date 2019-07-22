[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-space/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)

# Harena Space
Web-based client platform that includes: authoring environment, player engine and the Versum narrative scripting language translator.

## Table of Contents 

* [Getting Started](#getting-started)
  * [Option 1: Access our instance running at cloud](#access-our-instance-running-at-cloud)
  * [Option 2: Running as Docker containers](#running-as-docker-containers)
  * [Option 3: Running locally](#running-locally)

<!-- * [System Requirements](#system-requirements)
  * [For running as Docker containers](#for-running-as-linuxwindows-docker-containers)
  * [For running locally](#for-running-locally)
* [Configuration](#configuration)
  * [Virtualenvs: AdonisJS](#virtualenvs-adonisjs)
  * [Virtualenvs: Database](#virtualenvs-database)
* [Contributing](#contributing)
  * [Project organization](#project-organization)
  * [Branch organization (future CI/CD)](#branch-organization-future-cicd)-->

## Getting Started

### Option 1: Access our instance running at cloud

The link below starts the authoring environment running in our cloud

* http://cloud.lis.ic.unicamp.br/case-notebook/v1/web/author/author.html

### Option 2: Running as Docker containers

#### For developers

If you want to contribute to harena-space, we provide a Docker container to develop environments. 
This is the recomended way of run the harena-manager code, since it guarantees the default configuration of the development environment, dispensing a manual configuration.

Clone the repository and get into it:

```bash
git clone https://github.com/datasci4health/harena-space.git
cd harena-manager
```

Then, checkout to development branch and get the latest code version:

```bash
git checkout -b development
git pull origin development
```

Then, run the command to start the docker<sup>1</sup> container:

```bash
docker-compose up
```
<sub><sup>1</sup>Make sure you have [docker](https://docs.docker.com/install/) and [docker-compose command](https://docs.docker.com/compose/install/) already installed on your system.</sub>

After starting the container, go to http://localhost:10010/author to see the authoring environment.

If you want to get the command line of the container, then run the command:

```bash
docker exec -it adonisjs_harena-space_1 bash
```

#### Just run the docker container

If you do not want get the code, just run the docker container, then :

```bash
sudo docker-compose --url https://github.com/datasci4health/case-notebook/blob/master/docker-compose.yml up
```

After starting the container, go to http://localhost:10010/author to see the authoring environment.

### Option 3: Running locally
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

