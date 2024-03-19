# Contributing

## Local development requirements

Setting up the project for local development will require all of the following the be installed:

- [git](https://git-scm.com/) (version `2.39` or higher)
- [node](https://nodejs.org/en) (version `18.0` or higher)
- *optionally* [docker](https://www.docker.com/) (version `24.0` or higher)
> NOTE: docker is an alternative way to develop. If you are using docker, all other dependencies above will not be required except for git.

## Setting up for development

First make sure to copy the `example.env` file to a `.env` file and fill out the correct values. Otherwise the web app will not work properly.

### Docker

Setting up the project using docker is simple. Simply run the following command with docker installed:

```sh
# NOTE: ensure to specify the dev docker compose file for features like hot reload when code changes
docker compose up --build
```
> NOTE: using this method will only allow running the project. You must setup the project without docker to be able to format, lint, and check the project.

### Without Docker

Setting up the project will require that the above dependencies are all installed. After which you can run the following commands:

```sh
# Enable corepack, it is disabled by default in the supported versions of NodeJS
corepack enable
# Prepare corepack based on the packageManager specified in the projects package.json
corepack prepare
# Install all dependencies
pnpm install
# Run the projects web app in development mode
pnpm web dev
```

#### Running formatting, linting, and checking

Running type checking on the project can be done using the following command:

```sh
pnpm typecheck
```

Running formatting on the project can be done using the following command:

```sh
pnpm format
```

Running linting on the project can be done using the following command:

```sh
pnpm lint
```

Running the projects tests can be done using the following command:

```sh
pnpm test
# if you want to generate coverage for the tests
pnpm test:coverage
```

## Fixing bugs

If you plan to fix a bug with the project, please start by putting in a bug report issue in the GitHub repository.

Please ensure that once you make a bug fix you run `pnpm changeset` to generate a changeset entry for the bug fix.

## Adding features

If you plan to add a new feature to the project, please start by putting in a feature request issue in the GitHub repository. This will ensure tracking of the feature request, as well as provide information about what you are attempting to implement.

After developing a new feature it is important that you test it thoroughly locally first before submitting a pull request.

Please ensure that once you develop a feature you run `pnpm changeset` to generate a changeset entry for the feature.
