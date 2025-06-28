# @cq/web

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
