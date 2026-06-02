# clip-queue

## 3.4.1

### Patch Changes

- [`0f93dcd`](https://github.com/jordanshatford/clip-queue/commit/0f93dcdd9b6a4029755db3bf082b77f683105a2f) - fix: twitch oath validation to properly refresh sessions

- [`0f93dcd`](https://github.com/jordanshatford/clip-queue/commit/0f93dcdd9b6a4029755db3bf082b77f683105a2f) - fix: kick oath validation to properly refresh sessions

## 3.4.0

### Minor Changes

- [`12635c5`](https://github.com/jordanshatford/clip-queue/commit/12635c5d98b5f089d2a4b85b57b9e5971bdafbec) - feat: use dropdown for application preferences

- [`111506b`](https://github.com/jordanshatford/clip-queue/commit/111506b9f72dfbef3c6d880332235eb0086437a6) - feat: add custom composable to handle persisted settings

- [`a4b8ffe`](https://github.com/jordanshatford/clip-queue/commit/a4b8ffe7017d0ffbdfa22f66de8987427b6ddc41) - feat: improve settings descriptions

- [`6a1b9ef`](https://github.com/jordanshatford/clip-queue/commit/6a1b9efcd2af2d3babe032dfbd706a9b2d79fe12) - feat: change max history to 1000 clips

- [`a4cdc83`](https://github.com/jordanshatford/clip-queue/commit/a4cdc83a256a6193c0eb6fc2a818c5c6ca148d55) - feat: cleanup preference settings page

### Patch Changes

- [`256001f`](https://github.com/jordanshatford/clip-queue/commit/256001f964405bbcc57b59da66318e02b7c7d344) - fix: use updated session when refreshing oath

- [`c640ed1`](https://github.com/jordanshatford/clip-queue/commit/c640ed119e18d604e6e8c382f746241165a08180) - fix: only detect if integration provider is misconfigured

- [`8f22ea6`](https://github.com/jordanshatford/clip-queue/commit/8f22ea6d315d5aa407502b081608d8041cf1e603) - fix: queue heading overflow handling

## 3.3.0

### Minor Changes

- feat: cannot disable kick integration as a whole ([`65771b0`](https://github.com/jordanshatford/clip-queue/commit/65771b07704ba9121ee48c5c0a40044702819b0e))

- feat: make is experimental optional, assume false ([`65771b0`](https://github.com/jordanshatford/clip-queue/commit/65771b07704ba9121ee48c5c0a40044702819b0e))

- feat: unify authentication and source on integration card ([`6d06587`](https://github.com/jordanshatford/clip-queue/commit/6d0658761c340d5fb9c59afdd8a15f55b0c90311))

- feat: improve integration auto login by doing it parallel ([`9c4a2a8`](https://github.com/jordanshatford/clip-queue/commit/9c4a2a823fa65889e219dc8ad1ad79d599352285))

- feat: simplify integration authentication handling ([`99ad496`](https://github.com/jordanshatford/clip-queue/commit/99ad496d4a1c91590fde50aec3251afa19619500))

- feat: refactor authentication to allow multiple authentication ([`0f06394`](https://github.com/jordanshatford/clip-queue/commit/0f0639480eee3611c9ad9f23270576927850334f))

- feat: show integration icon when hovering avatar ([`72335d7`](https://github.com/jordanshatford/clip-queue/commit/72335d71ae326e3d9ab46d52670d9278dd290d9c))

- feat: add integration source feature for auto connect ([`eda097f`](https://github.com/jordanshatford/clip-queue/commit/eda097f1da5e7f8575274a2691d1595a493fce2f))

- feat: integration is enabled can be undefined ([`6d06587`](https://github.com/jordanshatford/clip-queue/commit/6d0658761c340d5fb9c59afdd8a15f55b0c90311))

- feat: add kick authentication support to kick integration ([`37f9bfd`](https://github.com/jordanshatford/clip-queue/commit/37f9bfda379b00237a4103aaf87b2c4bfdef228a))

- feat: move twitch authentication to server ([`e7bf5c4`](https://github.com/jordanshatford/clip-queue/commit/e7bf5c436ed3e9022855c128b7a8adb0053567dd))

- feat: disable integration source enable when misconfigured ([`df6c5ea`](https://github.com/jordanshatford/clip-queue/commit/df6c5ea74b5387f5c108afa4f3844f6884f95dac))

- feat: show twitch providers are misconfigured when not logged in ([`318e714`](https://github.com/jordanshatford/clip-queue/commit/318e7140d11040a79e30343413f3b7d7a4373a5d))

- feat: show when integration provider is misconfigured ([`318e714`](https://github.com/jordanshatford/clip-queue/commit/318e7140d11040a79e30343413f3b7d7a4373a5d))

- feat: update feature card to remove twitch reference ([`5567d90`](https://github.com/jordanshatford/clip-queue/commit/5567d906d4df7ac8ded9553dd2db31f66669b503))

- feat: add kick chat support to kick integration ([`a708e0e`](https://github.com/jordanshatford/clip-queue/commit/a708e0e20cf39b8e594606a7591e2abdff6a95df))

- feat: support logging in with only kick ([`4e29684`](https://github.com/jordanshatford/clip-queue/commit/4e296849f4b74d9f32874a71175e8c58432c27ee))

### Patch Changes

- fix: allow authentication to provide details for future requests ([`31a65f4`](https://github.com/jordanshatford/clip-queue/commit/31a65f4ad88d42f029d627079c4612a458bd3322))

- fix: ensure twitch authentication has required scopes ([`e7bf5c4`](https://github.com/jordanshatford/clip-queue/commit/e7bf5c436ed3e9022855c128b7a8adb0053567dd))

- fix: unify all vods and videos integration ids ([`523b611`](https://github.com/jordanshatford/clip-queue/commit/523b6112cd06d7c79f61e6bae9abc79209402396))

- fix: cache kick chat message to support delete moderation ([`bd9abb2`](https://github.com/jordanshatford/clip-queue/commit/bd9abb2d53b62b66c60ea5b1fb31c5463f2a8853))

- fix: do not show queue length in tab bar when logged out ([`00ca6e3`](https://github.com/jordanshatford/clip-queue/commit/00ca6e3420751551712019353e41a9209b3c5436))

- fix: sort integration source features ([`eda097f`](https://github.com/jordanshatford/clip-queue/commit/eda097f1da5e7f8575274a2691d1595a493fce2f))

- fix: make application title clipqueue without space ([`a3bd0c8`](https://github.com/jordanshatford/clip-queue/commit/a3bd0c8c76c9aec35592358120087869187a6abd))

## 3.2.0

### Minor Changes

- feat: show list of submitters in clip card dropdown menu ([`c27b6f2`](https://github.com/jordanshatford/clip-queue/commit/c27b6f2b5a93b2d937461a936512b6202fa53a7b))

- feat: disable youtube integration by default ([`4862232`](https://github.com/jordanshatford/clip-queue/commit/4862232d9081e92be4a4abd45d2e47f23da6dabb))

- feat: disable rumble integration by default ([`4862232`](https://github.com/jordanshatford/clip-queue/commit/4862232d9081e92be4a4abd45d2e47f23da6dabb))

- feat: only mark integrations as experimental ([`7d51820`](https://github.com/jordanshatford/clip-queue/commit/7d51820a7c500c507b0216727be92167beb97604))

- feat: improve application command settings ([`49bd2e0`](https://github.com/jordanshatford/clip-queue/commit/49bd2e076bc1a54bb01b5ff5ddf8bf443811d899))

- feat: add additional details to clip dropdown menu ([`75b1183`](https://github.com/jordanshatford/clip-queue/commit/75b1183ceb2367054145b40ca529fa3420f587db))

- feat: add clip dropdown menu to player controls ([`9eea7e9`](https://github.com/jordanshatford/clip-queue/commit/9eea7e965a59d135f9573a821bdff0e854657b87))

- feat: add nuxt loading indicator to application ([`f4edf1d`](https://github.com/jordanshatford/clip-queue/commit/f4edf1d2051ed2ebfd15f1348aa04a677bb0bd3e))

- feat: do not expand toasts unless hovering ([`197667e`](https://github.com/jordanshatford/clip-queue/commit/197667e7fff88a10f7ae8c217a0585aef36fa0d4))

- feat: make container sizing 90 rem ([`98e2e62`](https://github.com/jordanshatford/clip-queue/commit/98e2e625feb148b91d73255375a0c15052dad4e6))

- feat: display all authenticated integrations in app header ([`40be782`](https://github.com/jordanshatford/clip-queue/commit/40be7824059d3f1870d4a1b4eab04dde1f23735d))

### Patch Changes

- fix: unify all labeling without colons ([`2517947`](https://github.com/jordanshatford/clip-queue/commit/2517947e96225a511ec5e5d3638511d221643e56))

- fix: do not attempt to connect twitch chat if it is misconfigured ([`b040fca`](https://github.com/jordanshatford/clip-queue/commit/b040fcaeb129631b76505cb175309d42dcc130a3))

- fix: simplify auto login handling in nuxt plugin ([`03122d5`](https://github.com/jordanshatford/clip-queue/commit/03122d516c604dffc2369d0b4a346bc498b91d7c))

- fix: submitters display on upcoming list ([`c27b6f2`](https://github.com/jordanshatford/clip-queue/commit/c27b6f2b5a93b2d937461a936512b6202fa53a7b))

- fix: issue causing filtering clip submitters to fail ([`7b37d3f`](https://github.com/jordanshatford/clip-queue/commit/7b37d3f8f6383b3d22682c029429a378d755b92e))

- fix: removal of clips is forcefully done when using ui ([`89d957a`](https://github.com/jordanshatford/clip-queue/commit/89d957add8c6f32c78ba6275cf487ba4ecea11cd))

- fix: only connect sources that are authenticated and configured ([`e0ef504`](https://github.com/jordanshatford/clip-queue/commit/e0ef504434b7cc36e20cb0d7b107dc8568a6b8ff))

## 3.1.0

### Minor Changes

- feat: unify clip player styling ([`861ae15`](https://github.com/jordanshatford/clip-queue/commit/861ae152b9358c83a5e8687ac11c0ca2d8470790))

- feat: display details when a clip is not selected for viewing ([`861ae15`](https://github.com/jordanshatford/clip-queue/commit/861ae152b9358c83a5e8687ac11c0ca2d8470790))

- feat: improve unsupported clip playback message ([`861ae15`](https://github.com/jordanshatford/clip-queue/commit/861ae152b9358c83a5e8687ac11c0ca2d8470790))

- feat: add composable for handling of clip extras ([`7c8ebe4`](https://github.com/jordanshatford/clip-queue/commit/7c8ebe423a786b8d103f320195d40a62aacc8ee3))

- feat: show application title in header ([`85165b9`](https://github.com/jordanshatford/clip-queue/commit/85165b9c760e1aac2492e6622598e140850ab086))

- feat: update twitch authentication to use full route path for login ([`20d2158`](https://github.com/jordanshatford/clip-queue/commit/20d21581bd724aad65679930acb903133ce6cf49))

- feat: improve queue page layout ([`861ae15`](https://github.com/jordanshatford/clip-queue/commit/861ae152b9358c83a5e8687ac11c0ca2d8470790))

- feat: twitch chat source relies on authentication ([`e426c86`](https://github.com/jordanshatford/clip-queue/commit/e426c86833a9323c85b966fa3e4bafe869280a65))

- feat: link to integration in settings card ([`e1dd588`](https://github.com/jordanshatford/clip-queue/commit/e1dd588bf61933d07ef9466f56488b07c1cdfcc8))

- feat: allow integration login from settings card ([`32eba9f`](https://github.com/jordanshatford/clip-queue/commit/32eba9f8a26b9658ed7545f9d83b08c0086ef5c9))

- feat: simplify source details on integration card ([`b0c81f6`](https://github.com/jordanshatford/clip-queue/commit/b0c81f61a537b3585294ca508e2e0ff55594afb7))

- feat: add branding details about each integration ([`861626f`](https://github.com/jordanshatford/clip-queue/commit/861626f1e0c00c036c3808e96d9313649d63f8e2))

- feat: show total submitters in clip player controls ([`7c8ebe4`](https://github.com/jordanshatford/clip-queue/commit/7c8ebe423a786b8d103f320195d40a62aacc8ee3))

### Patch Changes

- fix: make clip player title link to clip externally ([`861ae15`](https://github.com/jordanshatford/clip-queue/commit/861ae152b9358c83a5e8687ac11c0ca2d8470790))

- fix: issue with wrapping of source features on mobile ([`245cd4d`](https://github.com/jordanshatford/clip-queue/commit/245cd4d404814caa155e810fc62dc89ded8f7717))

- fix: hide hamburger menu when there are no visible routes ([`6fc2588`](https://github.com/jordanshatford/clip-queue/commit/6fc2588c72156dbef4a7a0b0f001c7b380f20615))

- fix: simplify authentication details on integration card ([`82db04e`](https://github.com/jordanshatford/clip-queue/commit/82db04ef0505b521408d3e430ec8de99a5838307))

- fix: make submitter unique based on source ([`d7da7c1`](https://github.com/jordanshatford/clip-queue/commit/d7da7c17e25f87eca2e2734321f41b1723f205dd))

## 3.0.1

### Patch Changes

- fix: ensure primary and surface color are valid ([`7579fca`](https://github.com/jordanshatford/clip-queue/commit/7579fca63eace7e4fe14ed2e0bcd20d28e628798))

## 3.0.0

### Major Changes

- feat: migrate repository to use nuxt ([`8220682`](https://github.com/jordanshatford/clip-queue/commit/8220682fc2cdfc4f258fd179632878fc6dbb79f7))

### Minor Changes

- feat: mention integrations on feature cards ([`01b4eb0`](https://github.com/jordanshatford/clip-queue/commit/01b4eb085035ad4969a7677b7577d1cef98f88be))

- feat: show queue size in application navbar ([`44fa141`](https://github.com/jordanshatford/clip-queue/commit/44fa1412dcc8a15fdda144913eb6c3378b0ca8a2))

- feat: use common layout for app and error entrypoints ([`02d4621`](https://github.com/jordanshatford/clip-queue/commit/02d4621fcad2756a8515dc0ff6de5a99f4faac6d))

- feat: limit the maximum number of elements in the queue history ([`0992785`](https://github.com/jordanshatford/clip-queue/commit/0992785db30fcff1360961f29f4e4b3e5ee0d4fe))

- feat: increase ui radius used by nuxt ui ([`62b93f8`](https://github.com/jordanshatford/clip-queue/commit/62b93f8cb00e088eba656b58d192d6d8a999ec19))

- feat: settings item in user dropdown to go to integration settings ([`bfbcd82`](https://github.com/jordanshatford/clip-queue/commit/bfbcd825f8e8b8eca6b0534dedd59fd0357bfd8a))

- feat: use nuxt middleware for authentication handling ([`8220682`](https://github.com/jordanshatford/clip-queue/commit/8220682fc2cdfc4f258fd179632878fc6dbb79f7))

- feat: move visible routes handling to composable ([`b5509a0`](https://github.com/jordanshatford/clip-queue/commit/b5509a0a9348d85298c0e32d82374a30a07512de))

- feat: simplify integration source status indicator ([`d41c0a0`](https://github.com/jordanshatford/clip-queue/commit/d41c0a01922e373f527d2d8654b6d1b69bb4395e))

- feat: replace primevue table with tanstack table and nuxt/ui ([`ec41908`](https://github.com/jordanshatford/clip-queue/commit/ec419082df84c3548cec41f7c68c4f7a3d60f7ac))

- feat: show queue open status in application navbar ([`44fa141`](https://github.com/jordanshatford/clip-queue/commit/44fa1412dcc8a15fdda144913eb6c3378b0ca8a2))

- feat: use route validation to ensure integration auth exists ([`0f42ee9`](https://github.com/jordanshatford/clip-queue/commit/0f42ee9ff3b5f1786ddfab82edd8bc04152c3716))

- feat: use nuxt plugin for auto login ([`8220682`](https://github.com/jordanshatford/clip-queue/commit/8220682fc2cdfc4f258fd179632878fc6dbb79f7))

- feat: allow specifying system as ui theme ([`b050886`](https://github.com/jordanshatford/clip-queue/commit/b0508865223ca2057c71c0b213ce17ce80e412e0))

- feat: update language labeling to be locale in preferences ([`b567b51`](https://github.com/jordanshatford/clip-queue/commit/b567b51e4ef9ccb7e45b4ba4d5dcede8985bdc4b))

- feat: remove duplicate integration status lookup ([`d41c0a0`](https://github.com/jordanshatford/clip-queue/commit/d41c0a01922e373f527d2d8654b6d1b69bb4395e))

- feat: support localizations that use rtl direction ([`25e8fc2`](https://github.com/jordanshatford/clip-queue/commit/25e8fc2783a99e5a097258767368dc12ba2f4f3f))

- feat: add nuxt page transitions when navigating ([`6608973`](https://github.com/jordanshatford/clip-queue/commit/66089732259067a19b8902a52399d03f6186fdf1))

- feat: use tooltip from nuxt/ui ([`8ab9908`](https://github.com/jordanshatford/clip-queue/commit/8ab99088cf83a4875fca40add4c3631320cd3eda))

- feat: use primary and surface colors based on nuxt/ui ([`ec41908`](https://github.com/jordanshatford/clip-queue/commit/ec419082df84c3548cec41f7c68c4f7a3d60f7ac))

- feat: use toast handling from nuxt/ui ([`f2c48d5`](https://github.com/jordanshatford/clip-queue/commit/f2c48d55d1d09d584338cd527e4a82c10659824d))

- feat: add confirmation modal using nuxt/ui ([`c00bdeb`](https://github.com/jordanshatford/clip-queue/commit/c00bdeb43853e4efda77d7df04dbd56f17bbfee9))

- feat: rework clip player components ([`608379c`](https://github.com/jordanshatford/clip-queue/commit/608379c0c06398863527d5c01f8e261e68288743))

- feat: only show logged in user image on mobile ([`63781ff`](https://github.com/jordanshatford/clip-queue/commit/63781ff43481747b736b6e9cb6db46cbaf5fce9e))

- feat: show locale icon in locales select ([`b802c32`](https://github.com/jordanshatford/clip-queue/commit/b802c32cfeb534acfb8de1a04316f7a64036a4d4))

- feat: use nuxt plugin for logger initialization ([`8220682`](https://github.com/jordanshatford/clip-queue/commit/8220682fc2cdfc4f258fd179632878fc6dbb79f7))

- feat: show chat connection status chip in navbar ([`9758f59`](https://github.com/jordanshatford/clip-queue/commit/9758f591f4321b6398006adc1012ae6361483f55))

- feat: initial reworking and setup for nuxt and nuxt/ui ([`44fa141`](https://github.com/jordanshatford/clip-queue/commit/44fa1412dcc8a15fdda144913eb6c3378b0ca8a2))

- feat: add ability to copy logs in settings ([`6bef758`](https://github.com/jordanshatford/clip-queue/commit/6bef758c7dc9669657ae3f514b5e17f8a67691ba))

- feat: migrate to using nuxt/ui theme mode handling ([`a11945b`](https://github.com/jordanshatford/clip-queue/commit/a11945b22367b34a224e0c2fb849f0b36eef68a4))

- feat: allow logging out of integration on integrations page ([`bce970d`](https://github.com/jordanshatford/clip-queue/commit/bce970da99831b1a450f4bf83a0e1f7d8ad21c06))

### Patch Changes

- fix: add error page used by nuxt ([`947a898`](https://github.com/jordanshatford/clip-queue/commit/947a89891c77b19bf24f65a17593bc876660fabf))

- fix: cleanup commands that may have been removed ([`cc5b68b`](https://github.com/jordanshatford/clip-queue/commit/cc5b68b0cc69e37c7a61c67fb8bc787e128b506c))

- fix: issue causing some kick clips to not be detected ([`6245ae1`](https://github.com/jordanshatford/clip-queue/commit/6245ae12acb341f00c9cb3628f734bc27ea8369e))

- fix: remove toast hack in integrations store ([`c9cdc7e`](https://github.com/jordanshatford/clip-queue/commit/c9cdc7e371656304ba10467d0a27c0698fc46a2c))

- fix: properly add item back to queue when going to previous item ([`754affd`](https://github.com/jordanshatford/clip-queue/commit/754affdf6e5c02ea59cb966771752a5ee1593128))

- fix: ensure locale is specified on error page ([`3c87fad`](https://github.com/jordanshatford/clip-queue/commit/3c87fad81180e595878a9f4acac14781420d5628))

- fix: properly type primary and neutral color options ([`6112054`](https://github.com/jordanshatford/clip-queue/commit/6112054fcd94e0bf57066ec722d52c0650a9d187))

- fix: add page meta typing declaration ([`5371e02`](https://github.com/jordanshatford/clip-queue/commit/5371e0216ca2dd5624c42277f0df5a913cca8fca))

- fix: add translations for selected table items ([`05a9dda`](https://github.com/jordanshatford/clip-queue/commit/05a9ddacd6052332ea094efa391b7a6510b22eec))

- fix: remove no longer used primeicons ([`d0548bf`](https://github.com/jordanshatford/clip-queue/commit/d0548bfac577d097526d86b9bbbceb654bf23c69))

- fix: display history table with most recent at the top ([`0992785`](https://github.com/jordanshatford/clip-queue/commit/0992785db30fcff1360961f29f4e4b3e5ee0d4fe))

- fix: improve nuxt head elements and handling ([`bb90401`](https://github.com/jordanshatford/clip-queue/commit/bb904019e847058016674a94418791e65a311e49))

- fix: sizing of integration icon on clip card ([`cd00917`](https://github.com/jordanshatford/clip-queue/commit/cd00917bd904c7d4eb0ed760067253b38c8b04fc))

- fix: localize nuxt ui components ([`25e8fc2`](https://github.com/jordanshatford/clip-queue/commit/25e8fc2783a99e5a097258767368dc12ba2f4f3f))

## 2.7.0

### Minor Changes

- feat: add setting to allow duplicate clips ([`22ed22b`](https://github.com/jordanshatford/clip-queue/commit/22ed22be2f48767be9791eb85132948fa6a69fd6))

- feat: allow getting integration source using integration id ([`9c9579a`](https://github.com/jordanshatford/clip-queue/commit/9c9579a81e0530e5cf62f26b458572cb4e8529b9))

- feat: improve handling by implementing integrations store ([`fe5c9c4`](https://github.com/jordanshatford/clip-queue/commit/fe5c9c4f5194e4c7e863b060bae8118d4e9d6e36))

- feat: update integrations store to handle sources ([`e253a1a`](https://github.com/jordanshatford/clip-queue/commit/e253a1ad10dc88e86b8715315052733ccd9eb7f8))

- feat: have command to remove clips based on integration ID ([`b28feb4`](https://github.com/jordanshatford/clip-queue/commit/b28feb48e2359dd6464998a18fab4e7c3c3c3d77))

- feat: command allows enabled and disabling integrations by ID ([`429b030`](https://github.com/jordanshatford/clip-queue/commit/429b030b690921d49032408aaf616d41ef17888c))

### Patch Changes

- fix: do not connect sources for disabled integrations ([`e253a1a`](https://github.com/jordanshatford/clip-queue/commit/e253a1ad10dc88e86b8715315052733ccd9eb7f8))

- fix: issue causing command aliases to fail as not enabled ([`e253a1a`](https://github.com/jordanshatford/clip-queue/commit/e253a1ad10dc88e86b8715315052733ccd9eb7f8))

- fix: clarify integration cache resetting in settings and commands ([`06d120e`](https://github.com/jordanshatford/clip-queue/commit/06d120e99cf7463cb4ad04b7b4ddb59462542a06))

## 2.6.0

### Minor Changes

- feat: make default surface color neutral ([`96bdcc8`](https://github.com/jordanshatford/clip-queue/commit/96bdcc8575a2a66233c94d6078dfb2ff777f9b7a))

- feat: store settings use single localstorage key ([`882189a`](https://github.com/jordanshatford/clip-queue/commit/882189af7a1863b07075f502fb3c2c898e1bcf8f))

- feat: make rumble its own integration ([`1300e75`](https://github.com/jordanshatford/clip-queue/commit/1300e75568f0ecb3f7d523bff79af70cd159329f))

### Patch Changes

- fix: reset logger settings when resetting settings ([`882189a`](https://github.com/jordanshatford/clip-queue/commit/882189af7a1863b07075f502fb3c2c898e1bcf8f))

## 2.5.0

### Minor Changes

- feat: update preferences settings to save immediately ([`154b43a`](https://github.com/jordanshatford/clip-queue/commit/154b43aac15825b5c6701059214be923d9f82673))

- feat: implement history as its own store ([`b0bed00`](https://github.com/jordanshatford/clip-queue/commit/b0bed0054de4d62c0a309664047888d3a7859a7f))

- feat: default to having all commands disabled ([`8d6124e`](https://github.com/jordanshatford/clip-queue/commit/8d6124ebb9328283b3128b6b31c6a0c888a0079f))

- feat: move logger related settings to logger store ([`73337da`](https://github.com/jordanshatford/clip-queue/commit/73337dac1e9277c0cda77e8a9c458715288de94a))

- feat: implement upcoming as its own store ([`b9f25ce`](https://github.com/jordanshatford/clip-queue/commit/b9f25cedbe87bc7eae8cc076aa6da52471318f70))

- feat: move command prefix and enabled to commands store ([`9a643ac`](https://github.com/jordanshatford/clip-queue/commit/9a643ac0206decc017c7dff9898f4c6161b5a514))

- feat: move automod setting to sources store ([`9a643ac`](https://github.com/jordanshatford/clip-queue/commit/9a643ac0206decc017c7dff9898f4c6161b5a514))

- feat: move queue limit setting to queue store ([`9a643ac`](https://github.com/jordanshatford/clip-queue/commit/9a643ac0206decc017c7dff9898f4c6161b5a514))

- feat: redesign command system to allow registering commands ([`8d6124e`](https://github.com/jordanshatford/clip-queue/commit/8d6124ebb9328283b3128b6b31c6a0c888a0079f))

- feat: rework preferences store to use vueuse ([`6531ac2`](https://github.com/jordanshatford/clip-queue/commit/6531ac2ddc1f73b1f29fdc750ee838d982586ef4))

### Patch Changes

- fix: clear twitch authentication redirect state after use ([`1f8ceda`](https://github.com/jordanshatford/clip-queue/commit/1f8cedadbe1b5e664baf69d15bcae246c2ec5be7))

- fix: persist open state of the queue ([`b9f25ce`](https://github.com/jordanshatford/clip-queue/commit/b9f25cedbe87bc7eae8cc076aa6da52471318f70))

- fix: dont part from twitch chat just disconnect ([`6fdf33e`](https://github.com/jordanshatford/clip-queue/commit/6fdf33e47ced67654273cf1e89861ea066a97264))

- fix: persist queue current and open state using vueuse ([`0c6b4cc`](https://github.com/jordanshatford/clip-queue/commit/0c6b4cc86172f653a8bb1dfa9c133d3b476d7b5f))

## 2.4.0

### Minor Changes

- feat: allow enabling and disabling twitch chat source ([`c88067c`](https://github.com/jordanshatford/clip-queue/commit/c88067ca511ce1ab76cb820fae661032dca33091))

- feat: use state in twitch authentication redirect ([`fb45bef`](https://github.com/jordanshatford/clip-queue/commit/fb45befee98e8bd23b261400720c6eb242410b7e))

- feat: toast on source connect and disconnect events ([`c652053`](https://github.com/jordanshatford/clip-queue/commit/c652053f4073b1d8294946dde2f78ee562150278))

- feat: display twitch chat source id in settings ([`eb2ad35`](https://github.com/jordanshatford/clip-queue/commit/eb2ad35c87d7ee4636d020ca91b31f1b48c62f21))

- feat: use vue router file based routing ([`e15bf54`](https://github.com/jordanshatford/clip-queue/commit/e15bf541de1309b10dc6d1441c0e498fd38be227))

- feat: remove source reconnect in place of disabling and re-enabling ([`7351371`](https://github.com/jordanshatford/clip-queue/commit/7351371e74ecee186bc01c234cd2c7baef84a2c3))

- feat: rework integration source and simplify ([`b474c80`](https://github.com/jordanshatford/clip-queue/commit/b474c807886a1012c858984f66130009aeb4663b))

### Patch Changes

- fix: breakpoints on app navigation bar ([`31bf999`](https://github.com/jordanshatford/clip-queue/commit/31bf999f6de10309f780d6b83de0e61bb93d2982))

- fix: issue causing enabling and disabling chat to fail ([`0c79f30`](https://github.com/jordanshatford/clip-queue/commit/0c79f30ee983da518cddba8dbb144d145417a9be))

- fix: move toasts to bottom right of application ([`40d02c7`](https://github.com/jordanshatford/clip-queue/commit/40d02c7b709e83ba9ecccb707904e7f5a4e7bc5d))

- fix: all integration status tag status values ([`f4f9366`](https://github.com/jordanshatford/clip-queue/commit/f4f9366cf7ee4be01071009a631b1a6fe20afd37))

- fix: rename clip detection to link detection for source features ([`8721ecd`](https://github.com/jordanshatford/clip-queue/commit/8721ecd5061509090c6f2d5477670e3823bfc865))

## 2.3.0

### Minor Changes

- feat: add provider for streamable videos ([`476b6e1`](https://github.com/jordanshatford/clip-queue/commit/476b6e10f4fdc0b9e3174f9d3b0821288f432189))

- feat: add provider for vimeo videos ([`054886c`](https://github.com/jordanshatford/clip-queue/commit/054886cf4c1d01830cb8055a999727fb2a48d5cc))

- feat: display logged in user name and photo in navbar ([`6e4fad4`](https://github.com/jordanshatford/clip-queue/commit/6e4fad4e8dc94b114da65ad20515c6693dc44d5b))

- feat: add provider for medal tv clips ([`0513362`](https://github.com/jordanshatford/clip-queue/commit/05133628fdeb00ed12fe8dce9dd148d7ebc18ad3))

- feat: add provider for sooplive vods ([`f9980d9`](https://github.com/jordanshatford/clip-queue/commit/f9980d9dbf80e2378547d1a8b7f676781e8d36e5))

- feat: add ability to disable complete integrations aside from twitch ([`a7b91a2`](https://github.com/jordanshatford/clip-queue/commit/a7b91a2159c0991655fe5aaf87593feef86f9c4b))

- feat: add integration for miscellaneous providers ([`f9980d9`](https://github.com/jordanshatford/clip-queue/commit/f9980d9dbf80e2378547d1a8b7f676781e8d36e5))

- feat: add provider for rumble videos and shorts ([`f1979a8`](https://github.com/jordanshatford/clip-queue/commit/f1979a85bde6e0a8bc03dfee381edfe65556c19d))

- feat: add provider for dailymotion videos ([`a01b0ba`](https://github.com/jordanshatford/clip-queue/commit/a01b0ba47b904124c6f9fb67116eadfca7669598))

### Patch Changes

- fix: improve provider url detection and handling ([`c00f254`](https://github.com/jordanshatford/clip-queue/commit/c00f254bc71e0be1a8e7b18e609d1dd0000b6ad4))

- fix: simplify integrations authentication, source, provider description ([`a49861d`](https://github.com/jordanshatford/clip-queue/commit/a49861d4811de4d1bf7b601676483e9115bb3064))

- fix: tighten url hostname checks for providers ([`7e7157d`](https://github.com/jordanshatford/clip-queue/commit/7e7157df7a46196dd85da9fc21437a088f7160f8))

## 2.2.0

### Minor Changes

- feat: display total submitters on clip card ([`8ca3c9f`](https://github.com/jordanshatford/clip-queue/commit/8ca3c9f267a1fbcb639edf3732c7b1464ea5e8f6))

- feat: add provider for kick videos ([`81476c2`](https://github.com/jordanshatford/clip-queue/commit/81476c20399b8a135a7e51d2cd12d66bbc3cc5de))

- feat: update provider to return player config ([`5b711df`](https://github.com/jordanshatford/clip-queue/commit/5b711df058bfa9d7874e66f9c85095dfaf5dec7c))

- feat: add component for rendering an integration icon based on ID ([`51d66ea`](https://github.com/jordanshatford/clip-queue/commit/51d66ea56cab6dda6bc98c6ea9afb09ad58a6d82))

- feat: add provider for youtube shorts ([`048fd49`](https://github.com/jordanshatford/clip-queue/commit/048fd49d87ba40dc8c8c006639c07d96c79916bf))

- feat: add provider for youtube videos ([`048fd49`](https://github.com/jordanshatford/clip-queue/commit/048fd49d87ba40dc8c8c006639c07d96c79916bf))

- feat: add youtube integration ([`048fd49`](https://github.com/jordanshatford/clip-queue/commit/048fd49d87ba40dc8c8c006639c07d96c79916bf))

### Patch Changes

- fix: remove creator from clips as it is not relevant ([`e0bb083`](https://github.com/jordanshatford/clip-queue/commit/e0bb083cd9b4a8eb74ad88eb142c08d65c63a665))

- fix: require twitch token callback for clip and vod providers ([`4c64ef5`](https://github.com/jordanshatford/clip-queue/commit/4c64ef5df6f1e6c0acff1ca4eb6aa75fbc437658))

- fix: add fallback with clip thumbnail cannot load ([`9696dcf`](https://github.com/jordanshatford/clip-queue/commit/9696dcfcb0a6188c4745393dd889db775349774b))

## 2.1.0

### Minor Changes

- feat: settings on navbar allows selecting sub setting page ([`0a00a5f`](https://github.com/jordanshatford/clip-queue/commit/0a00a5fbaf01f6fee02a64c0885ef165402585b0))

- feat: add provider for twitch videos to integrations ([`af63580`](https://github.com/jordanshatford/clip-queue/commit/af63580b9c6fcff6776f62b37c291fd8bbd2a1e6))

- feat: use common integration status enumeration ([`bee2957`](https://github.com/jordanshatford/clip-queue/commit/bee295791fdd6faf98fdf128eaeca2751c00d68c))

- feat: allow providers to add optional metadata to clip ([`a41faff`](https://github.com/jordanshatford/clip-queue/commit/a41faffee8c827fc4126350af8a40dd9150127a8))

- feat: make integrations page use expandable panels per integration ([`5e8437b`](https://github.com/jordanshatford/clip-queue/commit/5e8437b3803b7070223db1ee787d0c29087c29d0))

- feat: display queue status and number of items in tab ([`1a56776`](https://github.com/jordanshatford/clip-queue/commit/1a567760414ece67a33f6c579f91efe23dc9ab7a))

- feat: allow integration source to specify the features it provides ([`f458b8f`](https://github.com/jordanshatford/clip-queue/commit/f458b8fadc78dcfb6f9e370f4351208a9c1c4b53))

- feat: use composable for settings form handling ([`9f0eaf4`](https://github.com/jordanshatford/clip-queue/commit/9f0eaf45de62b6bcd34762d84f1c16c297517d34))

### Patch Changes

- fix: remove deprecated enable background from twitch svg ([`75d1be1`](https://github.com/jordanshatford/clip-queue/commit/75d1be18cf9bb6c7e065bb1784b8c02b6968995c))

- fix: add missing translations for integration status ([`64b9ffe`](https://github.com/jordanshatford/clip-queue/commit/64b9ffe7f8eb7869cf2c0a19c1c1f817556a5576))

- fix: navbar layout on mobile devices ([`f7bb4ff`](https://github.com/jordanshatford/clip-queue/commit/f7bb4ff132aa8c5178dabf8e8f3c23a047d8b41a))

- fix: settings tabs on mobile device by using scrollable tabs ([`3ec992f`](https://github.com/jordanshatford/clip-queue/commit/3ec992fbad5edccb790c2b8154a6033dba2e7630))

- fix: update translations using inlang cli ([`1058036`](https://github.com/jordanshatford/clip-queue/commit/1058036480b31b319e7cba9010fd157fdaf3d623))

- fix: display in integrations page if source is experimental ([`bd8629b`](https://github.com/jordanshatford/clip-queue/commit/bd8629bbefbf394b1a462ef2721a30a10323cd7a))

- fix: do not remove clip from queue if thumbnail cannot be loaded ([`4aa5e2d`](https://github.com/jordanshatford/clip-queue/commit/4aa5e2dd654a873e3978e0a53c38651c4861dd31))

- fix: add missing chinese translation ([`d26b5ec`](https://github.com/jordanshatford/clip-queue/commit/d26b5ecfcb88f6119367149ffb691e58c8ff2321))

- fix: show correct provider name in history table ([`8d420a6`](https://github.com/jordanshatford/clip-queue/commit/8d420a6f6642ef6e09b7673e59ce892595d9c73e))

- fix: make navbar sticky to the top ([`b566796`](https://github.com/jordanshatford/clip-queue/commit/b5667965effaf08e9d7e9686421b4473b199eaf9))

- fix: always fetch latest user details from twitch ([`9b23176`](https://github.com/jordanshatford/clip-queue/commit/9b2317669b87101c269d313864080e6374c98f05))

- fix: unify all settings card styling and size ([`e7acd8f`](https://github.com/jordanshatford/clip-queue/commit/e7acd8f38c0619a455b9e5cddfa6b7033a02f7c6))

## 2.0.0

### Major Changes

- breaking: rework application to use integrations ([`0ee6120`](https://github.com/jordanshatford/clip-queue/commit/0ee6120dfc92c98d8be834f4d4cf82d5ba6d60cc))

### Minor Changes

- feat: use unique route for integration redirects ([`bee1d13`](https://github.com/jordanshatford/clip-queue/commit/bee1d1387b5e2529acdebb4aedcda7c902c7d83b))

- feat: add components for handling integration info display ([`16679f4`](https://github.com/jordanshatford/clip-queue/commit/16679f46355fcb3ccdece23fa76114dcb70dc586))

- feat: rework twitch authentication into an integration ([`0f341a1`](https://github.com/jordanshatford/clip-queue/commit/0f341a14aba39aa5bb67a1d36c6dcbaa18c48013))

- feat: move chat and queue settings to single application tab ([`0b6786f`](https://github.com/jordanshatford/clip-queue/commit/0b6786f9c7d71b2626e13d23542eaba6060eb44a))

- feat: rework twitch clip provider into integration ([`e6d9fad`](https://github.com/jordanshatford/clip-queue/commit/e6d9fad7be46b4ee4d843b5d353cd2ca55b7393a))

- feat: rework twitch chat into integration ([`dd0d747`](https://github.com/jordanshatford/clip-queue/commit/dd0d74785ea8ab1408d0a9ef7ab050ee620f53f1))

- feat: rework kick clip provider into integration ([`9aeb119`](https://github.com/jordanshatford/clip-queue/commit/9aeb1195cc7ea57808312660e4bf51c80763159a))

### Patch Changes

- fix: commands to enabled and disable providers ([`f4247b5`](https://github.com/jordanshatford/clip-queue/commit/f4247b57f1a3acf886c44c654d911420d88da430))

- fix: do not attempt to get clip from provider if it does not support the url ([`e6d9fad`](https://github.com/jordanshatford/clip-queue/commit/e6d9fad7be46b4ee4d843b5d353cd2ca55b7393a))

- fix: replace custom composable with one from vueuse ([`b72db3a`](https://github.com/jordanshatford/clip-queue/commit/b72db3af209d4d271fdc50bb48ec8541263a2550))

## 1.15.0

### Minor Changes

- feat: use primevue components directly instead of volt ([`a9ae596`](https://github.com/jordanshatford/clip-queue/commit/a9ae5968f337dd6f1c6de51ae40de7c310b374d9))

- feat: improve clip card provider indicator ([`24d8a60`](https://github.com/jordanshatford/clip-queue/commit/24d8a60ef74928ea2ddbabf72a2ba9d5c69f753f))

### Patch Changes

- fix: dynamic import all routes to improve chunking ([`e52f8a2`](https://github.com/jordanshatford/clip-queue/commit/e52f8a28aca476f43dfac0d274fcbf1c5cfaa1a2))

- fix: update logging levels for some relevant logs ([`f77b42c`](https://github.com/jordanshatford/clip-queue/commit/f77b42c1b27dfd73eff73f8e4868d8200b98f59f))

## 1.14.0

### Minor Changes

- feat: use new @tmi.js/chat instead of outdated tmi.js ([`971da8b`](https://github.com/jordanshatford/clip-queue/commit/971da8b603111b35b6a9b9838e1dc779f009ee0e))

- feat: add reconnect function to base clip source ([`971da8b`](https://github.com/jordanshatford/clip-queue/commit/971da8b603111b35b6a9b9838e1dc779f009ee0e))

### Patch Changes

- fix: properly disconnect sources before logging out ([`d448203`](https://github.com/jordanshatford/clip-queue/commit/d4482038c79d0e0c59b408259d1451db958aaa5e))

- fix: rename user-timeout event to moderation event ([`971da8b`](https://github.com/jordanshatford/clip-queue/commit/971da8b603111b35b6a9b9838e1dc779f009ee0e))

- fix: simply base clip source to no longer have join and leave ([`971da8b`](https://github.com/jordanshatford/clip-queue/commit/971da8b603111b35b6a9b9838e1dc779f009ee0e))

## 1.38.0

### Minor Changes

- feat: add ui components to application and remove package ([`07a1c2b`](https://github.com/jordanshatford/clip-queue/commit/07a1c2b460f1992fdce71132e20a1ee77623f745))

- feat: add player component that uses video.js and embedding ([`7355d81`](https://github.com/jordanshatford/clip-queue/commit/7355d813b0dbb0e38e2d5818fa414cb788ef3eb6))

- feat: add providers to handle clip providers ([`7c64515`](https://github.com/jordanshatford/clip-queue/commit/7c64515b670a7ff4b73fd0c64f1c90890af21bd0))

- feat: move configurations out of there own package ([`2672624`](https://github.com/jordanshatford/clip-queue/commit/2672624a5fdd6c60bdd325b1c0089bac67e55045))

- feat: add sources to handle clip sources ([`e726577`](https://github.com/jordanshatford/clip-queue/commit/e7265777316ce2a53b0199b0b29176db5eae6c67))

- feat: add services to handle third party communication ([`72d445e`](https://github.com/jordanshatford/clip-queue/commit/72d445e012da38e29e577cb4bef016014cdc08db))

## 1.37.1

### Patch Changes

- fix: use template refs for forms and resetting ([`ce3515e`](https://github.com/jordanshatford/clip-queue/commit/ce3515e7eddf56733fb0a9d7297fa85afb79041a))

- Updated dependencies [[`ef153aa`](https://github.com/jordanshatford/clip-queue/commit/ef153aa762c9d32179284b50d13dc8e3d34dfbc2)]:
  - @cq/player@1.1.2

## 1.37.0

### Minor Changes

- feat: arrow right and arrow left are next and previous in queue ([`2de5a4e`](https://github.com/jordanshatford/clip-queue/commit/2de5a4e6bbffcb2164a552d71a72cf2e390d67fc))

- feat: allow using arrow keys to navigate settings tabs ([`b84d607`](https://github.com/jordanshatford/clip-queue/commit/b84d607f8f62958f666efe90d0f6fbb841c5d4d1))

## 1.36.3

### Patch Changes

- fix: use proper pluralization for all locale messages ([`8f1c459`](https://github.com/jordanshatford/clip-queue/commit/8f1c459a8e95b6fe48d043ea5d5242d0f889d5b5))

## 1.36.2

### Patch Changes

- fix: unify logging messages and levels ([`a893da1`](https://github.com/jordanshatford/clip-queue/commit/a893da1e2461b33ce85010ed65fbe7c65d7996a4))

- Updated dependencies [[`b38ae1e`](https://github.com/jordanshatford/clip-queue/commit/b38ae1e7e98dfc8a54a1a5b5982c22ad98442d6e), [`58c4045`](https://github.com/jordanshatford/clip-queue/commit/58c4045c758f3a4c57e1aab9cd200f82ebaec2b4), [`23a6dfb`](https://github.com/jordanshatford/clip-queue/commit/23a6dfb80785118b58ab7f9b99bedab590d4542d)]:
  - @cq/providers@2.1.0
  - @cq/services@2.1.0
  - @cq/sources@1.6.0

## 1.36.1

### Patch Changes

- Updated dependencies [[`4e739dc`](https://github.com/jordanshatford/clip-queue/commit/4e739dc70b2402189aa94fa7c917cb6c6a0bb3a8)]:
  - @cq/providers@2.0.0
  - @cq/services@2.0.0
  - @cq/sources@1.5.2

## 1.36.0

### Minor Changes

- feat: add debug logging for route changes ([`2564e0d`](https://github.com/jordanshatford/clip-queue/commit/2564e0d6811d270171f157885c8f44b0e3435b6d))

## 1.35.0

### Minor Changes

- feat: add support for capturing logs ([`e173bc8`](https://github.com/jordanshatford/clip-queue/commit/e173bc81d3f013af9ed36705cbfee7c858d27ce5))

### Patch Changes

- Updated dependencies [[`005dcf3`](https://github.com/jordanshatford/clip-queue/commit/005dcf3971f5a658d8d3d2774ad43e29795e8d74), [`ee84746`](https://github.com/jordanshatford/clip-queue/commit/ee847467ee315dd55378afb96801f70abf220ceb)]:
  - @cq/ui@1.8.0

## 1.34.1

### Patch Changes

- fix: use Twitch login instead of preferred username when possible ([`51d69d6`](https://github.com/jordanshatford/clip-queue/commit/51d69d6411f6eb77b0e858928ec36c9006424548))

- Updated dependencies [[`51d69d6`](https://github.com/jordanshatford/clip-queue/commit/51d69d6411f6eb77b0e858928ec36c9006424548)]:
  - @cq/services@1.4.0
  - @cq/providers@1.7.1
  - @cq/sources@1.5.1

## 1.34.0

### Minor Changes

- feat: display clip creator in clip player ([`47dfd43`](https://github.com/jordanshatford/clip-queue/commit/47dfd43c778b4656c328db00f86dd50806402c57))

### Patch Changes

- fix: delete clips from history deleting all but last clip ([`48582cb`](https://github.com/jordanshatford/clip-queue/commit/48582cbfe1a3a4450f675512de45c9a5bc87f906))

- fix: switching settings tab only detected when clicking text ([`5757fe8`](https://github.com/jordanshatford/clip-queue/commit/5757fe807dd981fc152fed44482cca0df4d299cd))

- fix: hard to read text in empty history table in dark mode ([`f07e5de`](https://github.com/jordanshatford/clip-queue/commit/f07e5de04b63464d12980f7c194d8fb07dd11a9d))

## 1.33.0

### Minor Changes

- feat: display clip creator in queue and history ([`4d09041`](https://github.com/jordanshatford/clip-queue/commit/4d09041ca3059c039be08c2d7217d29c7cde5560))

### Patch Changes

- Updated dependencies [[`4d09041`](https://github.com/jordanshatford/clip-queue/commit/4d09041ca3059c039be08c2d7217d29c7cde5560)]:
  - @cq/providers@1.7.0

## 1.32.1

### Patch Changes

- fix: confirm modals in other settings not working ([`a886a87`](https://github.com/jordanshatford/clip-queue/commit/a886a87a74d3b7b3201cf91342902e9b0f1d4081))

- fix: navigation bar items in dark theme ([`2b92f25`](https://github.com/jordanshatford/clip-queue/commit/2b92f259460f5361c5c8dfb9ad96d7dbf5de0886))

## 1.32.0

### Minor Changes

- feat: update to use primevue volt instead of tailwind styles ([`966600a`](https://github.com/jordanshatford/clip-queue/commit/966600ad4dfcedf5d38b33c4864cd72b301ac11c))

### Patch Changes

- Updated dependencies [[`966600a`](https://github.com/jordanshatford/clip-queue/commit/966600ad4dfcedf5d38b33c4864cd72b301ac11c)]:
  - @cq/ui@1.7.0

## 1.31.4

### Patch Changes

- Updated dependencies [[`68bef43`](https://github.com/jordanshatford/clip-queue/commit/68bef43fb6346fb90ca7098daf7edb5fc308f173)]:
  - @cq/sources@1.5.0

## 1.31.3

### Patch Changes

- feat: update to use tailwindcss v4 ([`608fdea`](https://github.com/jordanshatford/clip-queue/commit/608fdea009a4db479ebea073fef449b8d35dc0e2))

- Updated dependencies [[`608fdea`](https://github.com/jordanshatford/clip-queue/commit/608fdea009a4db479ebea073fef449b8d35dc0e2)]:
  - @cq/player@1.1.1
  - @cq/ui@1.6.1
  - @cq/providers@1.6.0
  - @cq/services@1.3.0
  - @cq/sources@1.4.1

## 1.31.2

### Patch Changes

- fix: properly add and remove clips from history (do not care about the number of submitters) ([`11201b3`](https://github.com/jordanshatford/clip-queue/commit/11201b3a0e5230780b69221e1fb55e59daca5f52))

- Updated dependencies [[`11201b3`](https://github.com/jordanshatford/clip-queue/commit/11201b3a0e5230780b69221e1fb55e59daca5f52)]:
  - @cq/providers@1.6.0

## 1.31.1

### Patch Changes

- Updated dependencies [[`343e244`](https://github.com/jordanshatford/clip-queue/commit/343e244eceb23601629128f4fde9f45f93af6a3b), [`7fdf357`](https://github.com/jordanshatford/clip-queue/commit/7fdf3570d30bc926db60c451e8f6c1e30b4ecfb7), [`1b771da`](https://github.com/jordanshatford/clip-queue/commit/1b771daef4f5bd54c5be30d32bbc47c1b151131d)]:
  - @cq/services@1.3.0
  - @cq/providers@1.5.2
  - @cq/sources@1.4.1

## 1.31.0

### Minor Changes

- feat: add ability to reconnect to twitch chat source ([`a0dfb1c`](https://github.com/jordanshatford/clip-queue/commit/a0dfb1ceb5487d9b9e2f1d801f4716a19f8c4ef2))

### Patch Changes

- fix: issue when changing theme while on preferences page ([`e9a79a5`](https://github.com/jordanshatford/clip-queue/commit/e9a79a51d6ab29a0196c03b6994bc1ca8511da2d))

- fix: handle disconnecting and connecting source better ([`f746faa`](https://github.com/jordanshatford/clip-queue/commit/f746faae55a5a9bfab8ffdcece06b5128fb73eb2))

- Updated dependencies [[`7c1309a`](https://github.com/jordanshatford/clip-queue/commit/7c1309a729f550325ceaaa3296ba713305d0f08f), [`cabddd5`](https://github.com/jordanshatford/clip-queue/commit/cabddd5d35a235178b498e284c5aa82fc4aea537), [`c06a9c1`](https://github.com/jordanshatford/clip-queue/commit/c06a9c1bdcddb3f1fa137ac69031126f123b1f70)]:
  - @cq/ui@1.6.0
  - @cq/sources@1.4.0

## 1.30.0

### Minor Changes

- feat: make command aware of source, channel, and username ([`9325ec9`](https://github.com/jordanshatford/clip-queue/commit/9325ec9c5ed25ae45cbba4bf835ad398d1aeda8e))

### Patch Changes

- Updated dependencies [[`c936e2e`](https://github.com/jordanshatford/clip-queue/commit/c936e2e60781057922b6d42e21f1b38214ce84a6), [`8ed501e`](https://github.com/jordanshatford/clip-queue/commit/8ed501e9c197e39ef761c2a80e5711be809b3eac), [`00f8452`](https://github.com/jordanshatford/clip-queue/commit/00f8452d22dbcc303a7593eb6659f4dd0ac94fd9), [`ad204a1`](https://github.com/jordanshatford/clip-queue/commit/ad204a1f4de8a0e6557dd333914533b37c5432da)]:
  - @cq/sources@1.3.0
  - @cq/services@1.2.0
  - @cq/providers@1.5.1

## 1.29.1

### Patch Changes

- Updated dependencies [[`b31f466`](https://github.com/jordanshatford/clip-queue/commit/b31f46621bd34ea859bc9e057e36b95716530aa0)]:
  - @cq/sources@1.2.0

## 1.29.0

### Minor Changes

- feat: do not clear current clip on page refresh ([`212268f`](https://github.com/jordanshatford/clip-queue/commit/212268fccd769adc210e402f71b179c720ac703a))

- feat: display icon representing if provider is experimental ([`62de84c`](https://github.com/jordanshatford/clip-queue/commit/62de84c6b5dcc6df5ac8fcca27ed5cee5e8c33df))

- feat: use locale when displaying number input ([`f8f0461`](https://github.com/jordanshatford/clip-queue/commit/f8f046172df8f5468950c43bc889db3c93025bbe))

### Patch Changes

- Updated dependencies [[`6c5bd2d`](https://github.com/jordanshatford/clip-queue/commit/6c5bd2de475b24c4715a010b5a13d2d584291028)]:
  - @cq/providers@1.5.0

## 1.28.0

### Minor Changes

- feat: allow commands to know the source ([`94feabb`](https://github.com/jordanshatford/clip-queue/commit/94feabb6348603f5d07a0502025f9593e1a782c6))

### Patch Changes

- Updated dependencies [[`7bf7857`](https://github.com/jordanshatford/clip-queue/commit/7bf78574b19f5fb0b2e1f70367b89a865a9eb97c)]:
  - @cq/sources@1.1.0

## 1.27.0

### Minor Changes

- feat: use twitch chat clip source from sources package ([`a023b5c`](https://github.com/jordanshatford/clip-queue/commit/a023b5c58abaa4dca561b41724b5041dd2dc8192))

- feat: add status indicator for twitch chat ([`7340518`](https://github.com/jordanshatford/clip-queue/commit/73405187a75264fc9df914b6ab86bac16475d14a))

### Patch Changes

- Updated dependencies [[`1a92057`](https://github.com/jordanshatford/clip-queue/commit/1a920573cf96cb32542078ba0ad96684d21a63a8), [`eae755d`](https://github.com/jordanshatford/clip-queue/commit/eae755d581a03621089bee7f4be3d1d2e7ad5a71), [`7bd23da`](https://github.com/jordanshatford/clip-queue/commit/7bd23da6e1f7fd79318f3287609637027bd91588), [`e6d6d9e`](https://github.com/jordanshatford/clip-queue/commit/e6d6d9e9a991b7fc49ef581ec71f50ccae28ad21), [`cbd5a92`](https://github.com/jordanshatford/clip-queue/commit/cbd5a922c5e29f06f2c9cdcc512975ff39dd31b4), [`4937911`](https://github.com/jordanshatford/clip-queue/commit/4937911fb66a0ddbcf7b4698457099a50e8ed500), [`1ad3051`](https://github.com/jordanshatford/clip-queue/commit/1ad30518f1cd6ef3770694d53eb0561e7bca54fe), [`81211b2`](https://github.com/jordanshatford/clip-queue/commit/81211b2a6d9d07b5e6f9ff3f3ed3d2ce67569d95)]:
  - @cq/sources@1.0.0

## 1.26.0

### Minor Changes

- feat: display twitch logo on connected chat ([`6c6930f`](https://github.com/jordanshatford/clip-queue/commit/6c6930f031850add4fbba91e14d5a6c5ccf8cd55))

- feat: add theme select in preference settings ([`fc237cf`](https://github.com/jordanshatford/clip-queue/commit/fc237cfc0db15e4df88324c6cd39bba392e29590))

- feat: add icons to error and warning messages ([`a8e1f63`](https://github.com/jordanshatford/clip-queue/commit/a8e1f6314732527090c437cb40115476de6c4777))

### Patch Changes

- fix: buttons on clip card now take entire width ([`79d002e`](https://github.com/jordanshatford/clip-queue/commit/79d002eb9ff00591d5c6e6d3c20a99e7aa51e390))

- fix: only attempt to validate token if not logged in ([`62603ae`](https://github.com/jordanshatford/clip-queue/commit/62603ae493d0593f540c621b05b4f0490c9528f5))

- Updated dependencies [[`7ccd18d`](https://github.com/jordanshatford/clip-queue/commit/7ccd18d68d31729d8b741b7a1833063a88ecb0e8), [`d093b18`](https://github.com/jordanshatford/clip-queue/commit/d093b181299653ed90130646fc8c08ffc2f27202), [`da96b63`](https://github.com/jordanshatford/clip-queue/commit/da96b637d8e4edb390a54c49645368d887e57ac4)]:
  - @cq/services@1.1.1
  - @cq/ui@1.5.0
  - @cq/providers@1.4.1

## 1.25.0

### Minor Changes

- feat: add hindi language support ([`7e7eaae`](https://github.com/jordanshatford/clip-queue/commit/7e7eaae788be52db9bf74f030599c0e6efbba722))

- feat: add portuguese language support ([`cf21267`](https://github.com/jordanshatford/clip-queue/commit/cf21267f5a0ecefcaddc64a81f5619063d2870c2))

- feat: add japanese language support ([`520842f`](https://github.com/jordanshatford/clip-queue/commit/520842f0984c83879a3551462269931c822facbe))

- feat: add arabic language support ([`d9eddff`](https://github.com/jordanshatford/clip-queue/commit/d9eddff6cb4ffe535edb88f710b1c29c20d9fb6d))

- feat: add turkish language support ([`afd60a2`](https://github.com/jordanshatford/clip-queue/commit/afd60a283263b56f61335b7cc98dd0b3b385f025))

- feat: add korean language support ([`8b69691`](https://github.com/jordanshatford/clip-queue/commit/8b6969128e6c1ff0c056eb258c2db913c65d6c76))

- feat: allow more specific languages when inferring user language ([`a1346ba`](https://github.com/jordanshatford/clip-queue/commit/a1346ba9281780eeb66cdeb4d4316987885db532))

- feat: add russian language support ([`2712d7d`](https://github.com/jordanshatford/clip-queue/commit/2712d7dd4d4bf7543f95f5ff2e834609e2b67407))

- feat: add chinese language support ([`3f9806b`](https://github.com/jordanshatford/clip-queue/commit/3f9806b0a9b23d44ef0c7dba4d5ecd891dc91b55))

### Patch Changes

- fix: update html lang attribute to match selected language ([`cf50140`](https://github.com/jordanshatford/clip-queue/commit/cf5014022a33c572de7544f5964f7d9835cbdd4d))

## 1.24.1

### Patch Changes

- fix: translate command argument descriptions ([`43650a1`](https://github.com/jordanshatford/clip-queue/commit/43650a10c68f38e5c820ba049a65d4def4e09cd4))

## 1.24.0

### Minor Changes

- feat: add german language support ([`ea4b36f`](https://github.com/jordanshatford/clip-queue/commit/ea4b36f2205b575cc089988f1e24f2aa5dc0dc96))

- feat: add italian language support ([`54b2f36`](https://github.com/jordanshatford/clip-queue/commit/54b2f36e850fd28c84fc2b6c2925888ae4d3374e))

- feat: add spanish language support ([`974e0b3`](https://github.com/jordanshatford/clip-queue/commit/974e0b35611f4a8a35a86209a47b8544682357cf))

### Patch Changes

- fix: better handling of inferring language ([`c26fabe`](https://github.com/jordanshatford/clip-queue/commit/c26fabeafac2ca4c717d7a4b76056afdfe2230c3))

## 1.23.0

### Minor Changes

- feat: add french language support ([`feb6dfa`](https://github.com/jordanshatford/clip-queue/commit/feb6dfac885bfad856d1fe60a5233837a5ad02c9))

## 1.22.0

### Minor Changes

- feat: translate primary and surface color names ([`f4ed8ba`](https://github.com/jordanshatford/clip-queue/commit/f4ed8ba09129b50f8b2bf5596f23a237cb61d461))

### Patch Changes

- Updated dependencies [[`22327f0`](https://github.com/jordanshatford/clip-queue/commit/22327f0a7d7ac1f46d9e53791c35a7d122a2bf60), [`f4ed8ba`](https://github.com/jordanshatford/clip-queue/commit/f4ed8ba09129b50f8b2bf5596f23a237cb61d461)]:
  - @cq/player@1.1.0
  - @cq/ui@1.4.0

## 1.21.0

### Minor Changes

- feat: add ability to modify language in preference settings ([`2fa7279`](https://github.com/jordanshatford/clip-queue/commit/2fa727957750ec7850f9552615c48bc7c79f0d13))

## 1.20.0

### Minor Changes

- feat: add support for localization ([`8e42f28`](https://github.com/jordanshatford/clip-queue/commit/8e42f28d2165d7d69a4b449cb3123a9573740c40))

## 1.19.3

### Patch Changes

- Updated dependencies [[`8689bc2`](https://github.com/jordanshatford/clip-queue/commit/8689bc2a7efec1753208ec5861eb71d7819bb1ab)]:
  - @cq/providers@1.4.0
  - @cq/services@1.1.0

## 1.19.2

### Patch Changes

- Updated dependencies [[`ab0cad4`](https://github.com/jordanshatford/clip-queue/commit/ab0cad44f2eb26078fd170759cc5cdac01166eaf)]:
  - @cq/providers@1.3.0

## 1.19.1

### Patch Changes

- Updated dependencies [[`7f5b0db`](https://github.com/jordanshatford/clip-queue/commit/7f5b0db8419a211a11c60e11e6b0e827bd37cf68), [`5c72e98`](https://github.com/jordanshatford/clip-queue/commit/5c72e985fa779a208bf88e9507b266e1ac7a9502)]:
  - @cq/providers@1.2.0
  - @cq/services@1.0.2

## 1.19.0

### Minor Changes

- feat: redesign clip player visually ([`9de0acb6db64cc9d8515ee9d5b673ebd33e44913`](https://github.com/jordanshatford/clip-queue/commit/9de0acb6db64cc9d8515ee9d5b673ebd33e44913))

### Patch Changes

- Updated dependencies [[`e805270da2e59f454c4dc5af87789b815e1d4ba9`](https://github.com/jordanshatford/clip-queue/commit/e805270da2e59f454c4dc5af87789b815e1d4ba9), [`7736728eb30981f07b7a8e6e07e8e4da49836815`](https://github.com/jordanshatford/clip-queue/commit/7736728eb30981f07b7a8e6e07e8e4da49836815)]:
  - @cq/ui@1.3.0

## 1.18.0

### Minor Changes

- feat: redesign navbar using primevue menubar ([`464b48fe65f554853090e822aa64565b77d2cd7b`](https://github.com/jordanshatford/clip-queue/commit/464b48fe65f554853090e822aa64565b77d2cd7b))

### Patch Changes

- fix: only trigger theme change when value has changed ([`4a9df3e9f8db35f287e544b5d9ec5cb41e2b944d`](https://github.com/jordanshatford/clip-queue/commit/4a9df3e9f8db35f287e544b5d9ec5cb41e2b944d))

- fix: do not reset dark/light mode preference when saving preferences ([`33fb2727a0528f40b1daeb7940aeaf59b2f1aecd`](https://github.com/jordanshatford/clip-queue/commit/33fb2727a0528f40b1daeb7940aeaf59b2f1aecd))

- fix: crash when saving preference value in settings ([`4a9df3e9f8db35f287e544b5d9ec5cb41e2b944d`](https://github.com/jordanshatford/clip-queue/commit/4a9df3e9f8db35f287e544b5d9ec5cb41e2b944d))

- Updated dependencies [[`8f965385da023b91b5f83a85d7de1d30596e26ab`](https://github.com/jordanshatford/clip-queue/commit/8f965385da023b91b5f83a85d7de1d30596e26ab), [`55e89e5b948b94d7fa6ae8cdf7b1f97e3c83c7ca`](https://github.com/jordanshatford/clip-queue/commit/55e89e5b948b94d7fa6ae8cdf7b1f97e3c83c7ca)]:
  - @cq/ui@1.2.0

## 1.17.0

### Minor Changes

- feat: improve history selection, re-adding, and deletion ([`32b951003c8df3315dc3665bb6b869f53819347f`](https://github.com/jordanshatford/clip-queue/commit/32b951003c8df3315dc3665bb6b869f53819347f))

- remove: home from navigation menu ([`74ff036ed0e87de30cd5c3185ceee13b037761c6`](https://github.com/jordanshatford/clip-queue/commit/74ff036ed0e87de30cd5c3185ceee13b037761c6))

- feat: add ability to configure color preferences ([`055718c5f168104d6c65597bcab17845ff9c8a73`](https://github.com/jordanshatford/clip-queue/commit/055718c5f168104d6c65597bcab17845ff9c8a73))

### Patch Changes

- Updated dependencies [[`055718c5f168104d6c65597bcab17845ff9c8a73`](https://github.com/jordanshatford/clip-queue/commit/055718c5f168104d6c65597bcab17845ff9c8a73), [`d284cbf04a40830845b7cc8b0c61c1ae120a63e0`](https://github.com/jordanshatford/clip-queue/commit/d284cbf04a40830845b7cc8b0c61c1ae120a63e0), [`66b606865245d7671c8050cc34c7e4bc227e21e4`](https://github.com/jordanshatford/clip-queue/commit/66b606865245d7671c8050cc34c7e4bc227e21e4)]:
  - @cq/ui@1.1.0
  - @cq/providers@1.1.0

## 1.16.0

### Minor Changes

- feat: add sentry for error tracing ([`99f8a02c177dde3f7c8e9dd1eabfe9fb3370f84f`](https://github.com/jordanshatford/clip-queue/commit/99f8a02c177dde3f7c8e9dd1eabfe9fb3370f84f))

## 1.15.0

### Minor Changes

- remove: all global components and import instead ([`f03f0044fcc48ed8e2178b5ff3abcced112c9ae3`](https://github.com/jordanshatford/clip-queue/commit/f03f0044fcc48ed8e2178b5ff3abcced112c9ae3))

- feat: add player package to store the clip player component ([`a4482e5efc4ef57b291a33157819630d148d2f8e`](https://github.com/jordanshatford/clip-queue/commit/a4482e5efc4ef57b291a33157819630d148d2f8e))

### Patch Changes

- Updated dependencies [[`a4482e5efc4ef57b291a33157819630d148d2f8e`](https://github.com/jordanshatford/clip-queue/commit/a4482e5efc4ef57b291a33157819630d148d2f8e)]:
  - @cq/player@1.0.0

## 1.14.0

### Minor Changes

- feat: add providers package to store all clip providers ([`9ab147f98ea933709c6a3bcae547a83fb17a828e`](https://github.com/jordanshatford/clip-queue/commit/9ab147f98ea933709c6a3bcae547a83fb17a828e))

### Patch Changes

- Updated dependencies [[`9ab147f98ea933709c6a3bcae547a83fb17a828e`](https://github.com/jordanshatford/clip-queue/commit/9ab147f98ea933709c6a3bcae547a83fb17a828e)]:
  - @cq/providers@1.0.0

## 1.13.3

### Patch Changes

- feat: add ui package to store all ui components and presets ([`c1d1adf62c3d2a7732a9f542531aeb1ada9bac18`](https://github.com/jordanshatford/clip-queue/commit/c1d1adf62c3d2a7732a9f542531aeb1ada9bac18))

- Updated dependencies [[`c1d1adf62c3d2a7732a9f542531aeb1ada9bac18`](https://github.com/jordanshatford/clip-queue/commit/c1d1adf62c3d2a7732a9f542531aeb1ada9bac18)]:
  - @cq/ui@1.0.0

## 1.13.2

### Patch Changes

- Updated dependencies [[`f626c0e0ecdbf77aefbdb6509047f6fd9c548d75`](https://github.com/jordanshatford/clip-queue/commit/f626c0e0ecdbf77aefbdb6509047f6fd9c548d75)]:
  - @cq/services@1.0.1

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
