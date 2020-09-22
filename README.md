[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/datasci4health/harena-space/blob/master/LICENSE)
[![Docker Automated](https://img.shields.io/docker/cloud/automated/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Build](https://img.shields.io/docker/cloud/build/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Pulls](https://img.shields.io/docker/pulls/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![Docker Stars](https://img.shields.io/docker/stars/datasci4health/harena-space.svg?style=flat)](https://cloud.docker.com/u/datasci4health/repository/registry-1.docker.io/datasci4health/harena-space)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Harena Space

Web-based front-end module of [Harena](https://github.com/datasci4health/harena) environment.

Harena is available at https://harena.ds4h.org/.

<!-- platform that includes: authoring environment, player engine and the Versum narrative scripting language translator. -->

<!--
## Table of Contents 

* [Getting Started](#getting-started)
  * [Option 1: Access our instance running at cloud](#option-1-access-our-instance-running-at-cloud)
  * [Option 2: Running as Docker containers](#option-2-running-as-docker-containers)
  * [Option 3: Running locally](#option-3-running-locally)
* [Digital Content Component Playground](#digital-content-component-playground)
* [Directory Map](#directory-map)
 * [System Requirements](#system-requirements)
  * [For running as Docker containers](#for-running-as-linuxwindows-docker-containers)
  * [For running locally](#for-running-locally)
* [Configuration](#configuration)
  * [Virtualenvs: AdonisJS](#virtualenvs-adonisjs)
  * [Virtualenvs: Database](#virtualenvs-database)
* [Contributing](#contributing)
  * [Project organization](#project-organization)
  * [Branch organization (future CI/CD)](#branch-organization-future-cicd)-->

## Getting Started

We provide a docker container to locally run `harena-space` code. Containers guarantee the required minimal configuration to run the code. Read [docker](https://docs.docker.com/install/) e [docker-compose](https://docs.docker.com/compose/install/) documentations to install docker and learn further about containers.

> In order to execute `docker` without `sudo`, read this link: https://docs.docker.com/engine/install/linux-postinstall/, which shows another optional and valuable configurations in docker environment.

### Instructions (for Linux users)

Clone harena-manager repository, get into it, checkout development branch, and build manager docker image:
```bash
git clone https://github.com/datasci4health/harena-manager.git
cd harena-manager
git checkout -b development
git pull origin development

docker build . -t manager
cd ..
```

Clone harena-space repository, get into it, checkout development branch and pull the latest code version:
```bash
git clone https://github.com/datasci4health/harena-space.git
cd harena-space
git checkout -b development
git pull origin development
```

Start up the docker container:
```bash
docker-compose -f docker-compose-dev.yml up
```
Wait for some 5 minutes, then Press `Ctrl+c` to stop the container. Then, re-start the container:
```bash
docker-compose -f docker-compose-dev.yml up
```

Once the start up process is done, access http://localhost:10010/ to check if the system is working.

If you want to get the command line of the container, then run the command:
```bash
docker exec -it harena-space_harena-space_1 bash
```

## Contributing

### Branch organization
* `master`:
    * The code used by our production cloud server: https://harena.ds4h.org/
    * Protected. Must use _pull request_ to merge evolutions from _development_ branch
* `development`:
    * The latest code contaning the most recent updates made by the development team
    * [Changelog file](https://github.com/datasci4health/harena-space/blob/development/CHANGELOG.md) show unreleased features which will be merged into `master` from `development` branch in the next release
    * Version running at http://harena.ds4h.org/development . 
    * Protected. Must use _pull request_ to merge new features.

## Change log

Release updates can be found at [CHANGELOG.md file](https://github.com/datasci4health/harena-space/blob/development/CHANGELOG.md).

## Harena Technologies

### Versum Translator

Versum [Syntax  and Object Representation](https://github.com/datasci4health/harena-docs/blob/master/versum/syntax.md).

Learn how the Versum translator works and its correspondent output in  Versum Object Representation as well as HTML in the [Translator Playground](https://ds4h.org/harena-space/src/adonisjs/public/translator/playground/).

### Digital Content Components

Digital Content Components [Reference and Examples](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/).

Learn and try to instantiate and customize Digital Content Components (DCCs) at the [DCC Playground](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/playground/).
