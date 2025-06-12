<p align="center">
  <br />
  <img width="150" height="150" src="./apps/web/public/icon.png" alt="Logo">
  <h1 align="center"><b>Clip Queue</b></h1>
  <p align="center">
    An enhanced clip viewing experience.
    <br />
    <a href="https://clipqueue.vercel.app/"><strong>clipqueue.vercel.app »</strong></a>
    <br />
    <br />
  </p>
</p>

Clip Queue integrates into a users chat and queues clips submitted in chat by their viewers. Clips can be easily viewed through the web interface.

# Features

- Automatically connect to users chat to detect clips submitted by viewers.
- Duplicate clip prevention.
- Popular clips rise up in the queue.
- Support for multiple clip providers:
  - [Twitch](https://www.twitch.tv/)
  - [Kick](https://kick.com/)
- Support for multiple clip sources:
  - [Twitch Chat](https://www.twitch.tv/)
- Chat commands available to moderators and broadcasters.
- Automatic moderation and clip removal.
- Settings customization to personalize for your needs.
- UI customization to personalize your experience.
- Multilingual support.

# Developer Guide

Please refer to the [contributing guide](CONTRIBUTING.md) for how to install the project for development purposes.

## Monorepo structure:

### Apps:

- `web`: A web application. Developed with [Vue.js](https://vuejs.org/).

### Packages

- `config`: Common configurations shared between other apps and packages in the monorepo.
- `player`: A clip player used for displaying a variety of clip types. Developed with [Video JS](https://videojs.com/) and [Vue.js](https://vuejs.org/).
- `providers`: Various clip providers used to get clips based on its URL. Developed with [TypeScript](https://www.typescriptlang.org/).
- `services`: Various clients used to interact with the API's of external services. Developed with [TypeScript](https://www.typescriptlang.org/).
- `sources`: Various clip sources where clip links can originate from. Developed with [TypeScript](https://www.typescriptlang.org/).
- `ui`: A UI library. Developed with [Vue.js](https://vuejs.org/), [TailwindCSS](https://tailwindcss.com/), and [PrimeVue](https://primevue.org/).
