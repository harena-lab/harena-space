[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-space/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Harena Space
Web-based client platform that includes: authoring environment, player engine and the Versum narrative scripting language translator.

## Table of Contents 

* [Getting Started](#getting-started)
  * [Option 1: Access our instance running at cloud](#option-1-access-our-instance-running-at-cloud)
  * [Option 2: Running as Docker containers](#option-2-running-as-docker-containers)
  * [Option 3: Running locally](#option-3-running-locally)
* [Digital Content Component Playground](#digital-content-component-playground)
* [Directory Map](#directory-map)

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

Clone the harena manager repository, get into it, checkout development branch, and build the manager docker image:
```bash
git clone https://github.com/datasci4health/harena-manager.git
cd harena-manager
git checkout -b development
git pull origin development

docker build . -t manager
cd ..
```

Clone the harena space repository, get into it and checkout development branch, and build the space docker image:
```bash
git clone https://github.com/datasci4health/harena-space.git
cd harena-space
git checkout -b development
git pull origin development
docker build . -t space

```

Then, up the docker<sup>1</sup> container:

```bash
docker-compose -f docker-compose-dev.yml up
```
<sub><sup>1</sup>Make sure you have [docker](https://docs.docker.com/install/) and [docker-compose command](https://docs.docker.com/compose/install/) already installed on your system.</sub>

After starting the container, go to http://localhost:10010/author to see the authoring environment.

If you want to get the command line of the container, then run the command:

```bash
docker exec -it harena-space_harena-space_1 bash
```

#### Just run the docker container

If you do not want get the code, just run the docker container, then :

```bash
docker-compose --url https://github.com/datasci4health/case-notebook/blob/master/docker-compose-dev.yml up
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

# References and Playgrounds

## Versum Translator

Versum [Syntax  and Object Representation](https://github.com/datasci4health/harena-docs/blob/master/versum/syntax.md).

Learn how the Versum translator works and its correspondent output in  Versum Object Representation as well as HTML in the [Translator Playground](https://ds4h.org/harena-space/src/adonisjs/public/translator/playground/).

## Digital Content Components

Digital Content Components [Reference and Examples](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/).

Learn and try to instantiate and customize Digital Content Components (DCCs) at the [DCC Playground](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/playground/).


# Directory Map

* **author** - Front-end of the authoring environment that runs on the client-side. The `author.html` plus the `js/index.js` files are the main modules. The Javascript files of the module are in the `[js]` directory.

* **player** - Kernel of the HTML cases player. This kernel is used by the `translator` module to produce the final HTML version of the cases, which have the player kernel inside them.

* **translator** - Translates the markdown document of a case to the final case executed in the player using HTML, CSS, and Javascript. In the process, it produces an intermediary object representation of the case.

* **dccs** - Digital Content Components (DCCs) library. The authoring environment and the generated cases use web components to execute active web tasks, e.g., buttons, animations, inputs, etc. These web components follow the DCC standard and are stored in this directory.

* **flow** - Flow representation and processing. For example, several cases can be dynamically composed in a flow controlled by this module.

* **scripts** - Scripts programming via box programming through Blockly.

* **context** - Semantic related data management, related to controlled vocabularies, taxonomies, and ontologies. For example, semantic annotations of medical texts are resolved by this module.

* **infra** - Contains infrastructure-related modules, which are shared by the Author and Player platforms -- e.g., the bus service.

* **lib** - External javascript libraries adopted by both platforms (author and player).

* **themes** - HTML + CSS + DCC themes that are used to render cases.

* **templates** - Case templates adopted at the beginning of the authoring process.

## To Refactor

* **start** - Environment landing page. Deprecated, it was replaced by an AdonisJS/Edge approach.

* **modules** - Miniature environment to render cases used in the author environment to preview the case render. It will be transferred to the author directory.

* **resources** - Aggregates resources shared by several modules. It will be transferred to a specific AdonisJS directory.