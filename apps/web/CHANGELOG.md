# @cq/web

## 1.13.1

### Patch Changes

- Updated dependencies [[`0253bc982d8a81665a7656b59f4b4966c530e938`](https://github.com/jordanshatford/clip-queue/commit/0253bc982d8a81665a7656b59f4b4966c530e938)]:
  - @cq/services@1.0.0

## 1.13.0

### Minor Changes

- feat: allow for passing context to providers ([`8fdbd82347a21c479c1bb72fe342eb8b543c684f`](https://github.com/jordanshatford/clip-queue/commit/8fdbd82347a21c479c1bb72fe342eb8b543c684f))

## 1.12.0

### Minor Changes

- feat: add commands to enable and disable auto moderation ([`de20ecdd4fe0bc45ab1dc7680c1aeebafc5f2710`](https://github.com/jordanshatford/clip-queue/commit/de20ecdd4fe0bc45ab1dc7680c1aeebafc5f2710))

- feat: add commands to enable and disable specified providers ([`5ad88ad8f7261f0cdc3f329f55135d44b32175e3`](https://github.com/jordanshatford/clip-queue/commit/5ad88ad8f7261f0cdc3f329f55135d44b32175e3))

## 1.11.0

### Minor Changes

- feat: allow configuring allowed chat commands (closes: #253) ([`5ef8adfdb8233f3b4de6a03c8d7acf13f591b45b`](https://github.com/jordanshatford/clip-queue/commit/5ef8adfdb8233f3b4de6a03c8d7acf13f591b45b))

- revert: command to remove clips by channel name ([`5621873009f2eac7bcb4a3a434782a5a05b7cec3`](https://github.com/jordanshatford/clip-queue/commit/5621873009f2eac7bcb4a3a434782a5a05b7cec3))

## 1.10.0

### Minor Changes

- feat: add support for youtube clips (closes: #231) ([`c7b8f650bdd4c811eae63351f670f4a246f3ed65`](https://github.com/jordanshatford/clip-queue/commit/c7b8f650bdd4c811eae63351f670f4a246f3ed65))

- feat: display when experimental providers are enabled ([`4ffba9d9a1a562f17f19bef19d1ba5ae83a2fb60`](https://github.com/jordanshatford/clip-queue/commit/4ffba9d9a1a562f17f19bef19d1ba5ae83a2fb60))

- feat: add YouTube service to get clip information ([`5db76760605f0cca75b6a2082dfa971d91fbc655`](https://github.com/jordanshatford/clip-queue/commit/5db76760605f0cca75b6a2082dfa971d91fbc655))

### Patch Changes

- fix: handle cases where category or created at are not known for a given clip ([`6f3758b1cd920bcdf0e739a760bed2fd87a693fa`](https://github.com/jordanshatford/clip-queue/commit/6f3758b1cd920bcdf0e739a760bed2fd87a693fa))

## 1.9.0

### Minor Changes

- feat: allow clip limit to be empty to represent no limit ([`40212fbf2e47d41ce28889dcb0d0edec13d46dd7`](https://github.com/jordanshatford/clip-queue/commit/40212fbf2e47d41ce28889dcb0d0edec13d46dd7))

- revert: ability to add blocked channels in settings ([`89fa7f6944ccd476179484d88c72a835b36112bc`](https://github.com/jordanshatford/clip-queue/commit/89fa7f6944ccd476179484d88c72a835b36112bc))

- revert: ability to add blocked submitters in settings ([`89fa7f6944ccd476179484d88c72a835b36112bc`](https://github.com/jordanshatford/clip-queue/commit/89fa7f6944ccd476179484d88c72a835b36112bc))

- refactor: move auto moderation toggle to queue settings ([`94f7933410aa275b348cf101d4f5a3d733d373a6`](https://github.com/jordanshatford/clip-queue/commit/94f7933410aa275b348cf101d4f5a3d733d373a6))

## 1.8.0

### Minor Changes

- feat: add provider icon when displaying clip provider ([`ce8e9ab69d20dd54878d332bfa7bdbaf1ca9369e`](https://github.com/jordanshatford/clip-queue/commit/ce8e9ab69d20dd54878d332bfa7bdbaf1ca9369e))

- feat: detect multiple urls in messsage (closes: #229) ([`70e32a3ee150bcd3af1abc0e7ea256b66110b3ca`](https://github.com/jordanshatford/clip-queue/commit/70e32a3ee150bcd3af1abc0e7ea256b66110b3ca))

### Patch Changes

- fix: do not allow duplicates for blocked channels and submitters ([`cfea42a4d4dcb04ba9ec097531031c94c82a4f80`](https://github.com/jordanshatford/clip-queue/commit/cfea42a4d4dcb04ba9ec097531031c94c82a4f80))

## 1.7.0

### Minor Changes

- feat: make each settings page a unique route (closes: #243) ([`44acb6efc727edf06f5b6e5aef576242c3f98aab`](https://github.com/jordanshatford/clip-queue/commit/44acb6efc727edf06f5b6e5aef576242c3f98aab))

- feat: collapse command descriptions in settings by default ([`09b1a47ec407a37978d7248b0ea7e47c8dfe3c18`](https://github.com/jordanshatford/clip-queue/commit/09b1a47ec407a37978d7248b0ea7e47c8dfe3c18))

## 1.6.0

### Minor Changes

- feat: handle deleted clips in queue and history page ([`b66d4e08a93ebf1175160dea179990135067b505`](https://github.com/jordanshatford/clip-queue/commit/b66d4e08a93ebf1175160dea179990135067b505))

### Patch Changes

- fix: player breaking when switching from kick to twitch clip ([`a9c5f52c466264b146331097083610948d280986`](https://github.com/jordanshatford/clip-queue/commit/a9c5f52c466264b146331097083610948d280986))

## 1.5.1

### Patch Changes

- fix: new providers added will not be available without clearing storage (closes: #249) ([`3771d3f18a6eca1176af0d830564c536052883e8`](https://github.com/jordanshatford/clip-queue/commit/3771d3f18a6eca1176af0d830564c536052883e8))

## 1.5.0

### Minor Changes

- feat: replace confirmation plugin with prime vue confirmation (closes: #247) ([`87f93a22ea6e77b65ed81040638a4aed255d57bb`](https://github.com/jordanshatford/clip-queue/commit/87f93a22ea6e77b65ed81040638a4aed255d57bb))

- feat: display warning message in queue when no providers are enabled ([`b18fe18cecb9852442026c8d3f99ef26a239fea9`](https://github.com/jordanshatford/clip-queue/commit/b18fe18cecb9852442026c8d3f99ef26a239fea9))

- feat: replace vue toastification with prime vue toasts (closes: #248) ([`056edc1f5d8e76a8784836ab20a56ec84989275e`](https://github.com/jordanshatford/clip-queue/commit/056edc1f5d8e76a8784836ab20a56ec84989275e))

### Patch Changes

- fix: reset enabled providers to defaults when resetting settings ([`1fe1d6221d3dba6f72c7febf5d60f38602ecb0c8`](https://github.com/jordanshatford/clip-queue/commit/1fe1d6221d3dba6f72c7febf5d60f38602ecb0c8))

## 1.4.0

### Minor Changes

- feat: add setting to modify enabled providers (closes: #232) ([`9260d56f3e306eeb768aaf73c0c7040c41e50d90`](https://github.com/jordanshatford/clip-queue/commit/9260d56f3e306eeb768aaf73c0c7040c41e50d90))

- feat: use PrimeVue and PrimeIcons with TailwindCSS (closes: #225) ([`9451636bf2120aac32ff5cc803aaa1f4f7f45ffe`](https://github.com/jordanshatford/clip-queue/commit/9451636bf2120aac32ff5cc803aaa1f4f7f45ffe))

### Patch Changes

- fix: properly display category in history table ([`9451636bf2120aac32ff5cc803aaa1f4f7f45ffe`](https://github.com/jordanshatford/clip-queue/commit/9451636bf2120aac32ff5cc803aaa1f4f7f45ffe))

## 1.3.0

### Minor Changes

- feat: add command to remove clips by submitter ([#241](https://github.com/jordanshatford/clip-queue/pull/241))

- feat: add command to remove clips by provider ([#241](https://github.com/jordanshatford/clip-queue/pull/241))

- feat: add command to remove clips by channel ([#241](https://github.com/jordanshatford/clip-queue/pull/241))

## 1.2.0

### Minor Changes

- feat: rework using new clip interface and providers ([#239](https://github.com/jordanshatford/clip-queue/pull/239))

- feat: cache each provider data separately ([#239](https://github.com/jordanshatford/clip-queue/pull/239))

- feat: unify clip providers into common interface ([#239](https://github.com/jordanshatford/clip-queue/pull/239))

- feat: show provider on clip card and history page ([#239](https://github.com/jordanshatford/clip-queue/pull/239))

## 1.1.0

### Minor Changes

- remove: ability to scan subreddits for clips ([`500c57f1f62ab51c9bbf116695a2ec8c3aff7508`](https://github.com/jordanshatford/clip-queue/commit/500c57f1f62ab51c9bbf116695a2ec8c3aff7508))

- feat: add support for kick.com clips ([`b27bb6ebdcf87e9a4cbe51dcdb51cb7499d9507d`](https://github.com/jordanshatford/clip-queue/commit/b27bb6ebdcf87e9a4cbe51dcdb51cb7499d9507d))

- feat: add commands to purge cache and purge history ([`4ef918985e2979da2a15f6e6877d2fb4b5c5c619`](https://github.com/jordanshatford/clip-queue/commit/4ef918985e2979da2a15f6e6877d2fb4b5c5c619))

- feat: show application version in other settings ([`70bc8fe15df0be91a62b529e0ae9d5f70cfedbd6`](https://github.com/jordanshatford/clip-queue/commit/70bc8fe15df0be91a62b529e0ae9d5f70cfedbd6))

- feat: always autoplay the current clip ([`c4a1b0fe8a23b26fe03c70cf9208c7da298abab0`](https://github.com/jordanshatford/clip-queue/commit/c4a1b0fe8a23b26fe03c70cf9208c7da298abab0))

### Patch Changes

- fix: use clip id and provider when determining if clip is unique ([`9a9228030e762d91f4d04cd4b999d148f0829f11`](https://github.com/jordanshatford/clip-queue/commit/9a9228030e762d91f4d04cd4b999d148f0829f11))

## 1.0.0

### Major Changes

- feat: initial release of existing code ([`bb8921ea0bbd7af72734a05e89a705bb0266a782`](https://github.com/jordanshatford/clip-queue/commit/bb8921ea0bbd7af72734a05e89a705bb0266a782))
