<p align="center">
  <br />
  <img width="150" height="150" src="./apps/web/public/icon.png" alt="Logo">
  <h1 align="center"><b>Clip Queue</b></h1>
  <div align="center">
    <a href="https://vuejs.org/">
      <img src="https://img.shields.io/badge/Powered%20by-Vue-%234FC08D.svg?style=flat&logo=Vue.js" alt="Powered by Vue">
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/Language-Typescript-%233178C6.svg?style=flat&logo=typescript" alt="Language: TypeScript">
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/CSS%20Framework-TailwindCSS-%2306B6D4?logo=tailwindcss" alt="CSS Framework: TailwindCSS">
    </a>
    <a href="https://codecov.io/gh/jordanshatford/clip-queue" >
      <img src="https://codecov.io/gh/jordanshatford/clip-queue/branch/main/graph/badge.svg?token=55KCL03QIH"/>
    </a>
    <a href="https://github.com/jordanshatford/clip-queue/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-black.svg?style=flat&logo=license" alt="License: MIT">
    </a>
  </div>
  <p align="center">
    An enhanced clip viewing experience.
    <br />
    <a href="https://clipqueue.vercel.app/"><strong>clipqueue.vercel.app »</strong></a>
    <br />
    <br />
  </p>
</p>

Clip Queue is a web application designed to allow users to easily integrate with their [Twitch](https://www.twitch.tv/) chat and queue clips sent from their viewers.

# Features

- Automatically connect to logged in users Twitch chat to detect clips submitted in chat
- Duplicate clip prevention
- Popular clips rise up in the queue
- Support for multiple clip providers (Twitch, Kick, YouTube)
- Chat commands for moderators ([more info](./docs/COMMANDS.md))
- Automatic moderation and clip removal
- Settings customization to personalize the users experience
- Dark and light UI themes

# Developer Guide

Please refer to the [contributing guide](CONTRIBUTING.md) for how to install the project for development purposes.

## Monorepo structure:

### Apps:

- `web`: A web application developed using [Vue.js](https://vuejs.org/).

### Packages

- `config`: Common configs shared between other apps and packages in the monorepo.
- `providers`: Various clip providers used to get clips developed using [TypeScript](https://www.typescriptlang.org/).
- `services`: Various API clients used to interact with external services developed using [TypeScript](https://www.typescriptlang.org/).
- `ui`: A UI library developed using [Vue.js](https://vuejs.org/), [TailwindCSS](https://tailwindcss.com/), and [PrimeVue](https://primevue.org/).

# Additional Documentation

- [Commands](./docs/COMMANDS.md)
