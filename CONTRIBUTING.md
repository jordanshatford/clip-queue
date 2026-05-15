# Contributing

## Local development requirements

Setting up the project for local development will require all of the following the be installed:

- [git](https://git-scm.com/) (version `2.39` or higher)
- [node](https://nodejs.org/en) (version `22.0` or higher)
- [pnpm](https://pnpm.io/) (version `11.0` or higher)
  > NOTE: `pnpm` will use the version specified in the root `package.json` file.

## Setting up for development

First make sure to copy the `.env.example` file to a `.env` file and fill out the correct values. Otherwise the web app will not work properly.

Install all project dependencies:

```sh
# Install all dependencies
pnpm install
```

Run the project in development mode:

```sh
# Run the projects in development mode
pnpm dev
```

### Running formatting, linting, and checking

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
