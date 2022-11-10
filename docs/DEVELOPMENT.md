# Clip Queue Frontend

The frontend for this project is written using the popular javascript framework [Vue](https://vuejs.org/).

The frontend also utilizes other technologies like:
  - [ESLint](https://eslint.org/)
  - [PostCSS](https://postcss.org/)
  - [Prettier](https://prettier.io/)
  - [Tailwind](https://tailwindcss.com/)
  - [TypeScript](https://www.typescriptlang.org/)

## Developing
### Without Docker
To setup the frontend for local development you must first ensure that you have the following dependencies installed:
  - [NodeJS](https://nodejs.org/en/)
  - [NPM](https://www.npmjs.com/package/npm)

Now you can install the project specific dependencies using:
```bash
npm install
```

Then you must specify a value for the following environment variables:
```bash
# The Twitch client id generated for the application
VITE_TWITCH_CLIENT_ID=
# The redirect URI (this will be the URI where the application is hosted)
VITE_TWITCH_REDIRECT_URI=http://localhost:3000/
```
This can be done by filling out and copying the `example.env` file to a `.env` file.

Once the project dependencies are installed and environment variables specified you can start a development server using:
```bash
npm run dev
```

### With Docker
To setup the frontend for local development you can also use [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

You can run the application using the following command:

```bash
docker-compose up --build
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
