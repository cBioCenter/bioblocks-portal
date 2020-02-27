# [Bioblocks Portal](https://cbiocenter.github.io/bioblocks-portal/)

Bioblocks Portal is the frontend site for displaying data from the [Bioblocks Server](https://github.com/cBioCenter/bioblocks-server).

[![CircleCI](https://circleci.com/gh/cBioCenter/bioblocks-portal.svg?style=shield)](https://circleci.com/gh/cBioCenter/bioblocks-portal)[![GitHub license](https://img.shields.io/github/license/cBioCenter/bioblocks-portal.svg?style=flat)](https://github.com/cBioCenter/bioblocks-portal/blob/master/LICENSE)[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)[![Coverage Status](https://img.shields.io/codecov/c/github/cBioCenter/bioblocks-portal/master.svg)](https://codecov.io/gh/cBioCenter/bioblocks-portal/branch/master)

## Installation

```sh
git clone git@github.com:cBioCenter/bioblocks-portal.git
cd bioblocks-portal
yarn install
```

## Running Locally

To start a local server that talks to [Bioblocks.org](https://bioblocks.org), simply run:

```sh
yarn start:hot
```

## Changing the API

The API endpoint that bioblocks-portal uses is determined by the environment argument `API_URL`, so if you want to test out a local bioblocks server instance you can run the frontend like so:

```sh
cd bioblocks-portal
API_URL=your.local.bioblocks.server yarn run start:hot
```

This default is set in webpack.dev.ts and webpack.prod.ts for development and production, respectively.
