# Clip Queue Frontend

The frontend for this project is written using the popular javascript framework [Vue](https://vuejs.org/).

The frontend also utilizes other technologies like:
  - [ESLint](https://eslint.org/)
  - [PostCSS](https://postcss.org/)
  - [Prettier](https://prettier.io/)
  - [Tailwind](https://tailwindcss.com/)
  - [TypeScript](https://www.typescriptlang.org/)

## Developing
To setup the frontend for local development you must first ensure that you have the following dependencies installed:
  - [NodeJS](https://nodejs.org/en/) (version v14.18.1 or above)
  - [NPM](https://www.npmjs.com/) (version 6.14.15 or above) `this will be installed with NodeJS`

Now you can install the project specific dependencies using:
```bash
npm install
```

Then you must specify a value for the following environment variables:
```bash
# The Twitch client id generated for the application
VUE_APP_TWITCH_CLIENT_ID=
# The redirect URI (this will be the URI where the application is hosted)
VUE_APP_TWITCH_REDIRECT_URI=http://localhost:8080/
```
This can be done by filling out and copying the `.env.sample` file to a `.env` file.

Once the project dependencies are installed and environment variables specified you can start a development server using:
```bash
npm run serve
```

## Building
You can build a production version of the application using:

```bash
npm run build
```

## Linting
You can lint the project using:

```bash
npm run lint
```
