# @cq/sources

## 1.4.0

### Minor Changes

- feat: add source for the web application ([`cabddd5`](https://github.com/jordanshatford/clip-queue/commit/cabddd5d35a235178b498e284c5aa82fc4aea537))

### Patch Changes

- fix: better handling of current status when disconnect/connect ([`c06a9c1`](https://github.com/jordanshatford/clip-queue/commit/c06a9c1bdcddb3f1fa137ac69031126f123b1f70))

## 1.3.0

### Minor Changes

- feat: add method to get uuid for a submitter ([`c936e2e`](https://github.com/jordanshatford/clip-queue/commit/c936e2e60781057922b6d42e21f1b38214ce84a6))

- feat: add ability to connect to multiple channels ([`8ed501e`](https://github.com/jordanshatford/clip-queue/commit/8ed501e9c197e39ef761c2a80e5711be809b3eac))

- feat: simplify clip source class and do not require context ([`00f8452`](https://github.com/jordanshatford/clip-queue/commit/00f8452d22dbcc303a7593eb6659f4dd0ac94fd9))

### Patch Changes

- Updated dependencies [[`ad204a1`](https://github.com/jordanshatford/clip-queue/commit/ad204a1f4de8a0e6557dd333914533b37c5432da)]:
  - @cq/services@1.2.0

## 1.2.0

### Minor Changes

- feat: include source channel in events ([`b31f466`](https://github.com/jordanshatford/clip-queue/commit/b31f46621bd34ea859bc9e057e36b95716530aa0))

## 1.1.0

### Minor Changes

- feat: pass clip source with all clip source events ([`7bf7857`](https://github.com/jordanshatford/clip-queue/commit/7bf78574b19f5fb0b2e1f70367b89a865a9eb97c))

## 1.0.0

### Major Changes

- feat: add twitch chat source ([`cbd5a92`](https://github.com/jordanshatford/clip-queue/commit/cbd5a922c5e29f06f2c9cdcc512975ff39dd31b4))

### Minor Changes

- feat: add function to get all urls from text ([`1a92057`](https://github.com/jordanshatford/clip-queue/commit/1a920573cf96cb32542078ba0ad96684d21a63a8))

- feat: add basic event emitter class ([`7bd23da`](https://github.com/jordanshatford/clip-queue/commit/7bd23da6e1f7fd79318f3287609637027bd91588))

- feat: add base clip source class ([`e6d6d9e`](https://github.com/jordanshatford/clip-queue/commit/e6d6d9e9a991b7fc49ef581ec71f50ccae28ad21))

### Patch Changes

- fix: typing on disconnected source event ([`eae755d`](https://github.com/jordanshatford/clip-queue/commit/eae755d581a03621089bee7f4be3d1d2e7ad5a71))

- fix: better typing of clip source interface ([`4937911`](https://github.com/jordanshatford/clip-queue/commit/4937911fb66a0ddbcf7b4698457099a50e8ed500))

- fix: only get unique list of clip urls ([`1ad3051`](https://github.com/jordanshatford/clip-queue/commit/1ad30518f1cd6ef3770694d53eb0561e7bca54fe))

- fix: only disconnect twitch chat source if it is connected ([`81211b2`](https://github.com/jordanshatford/clip-queue/commit/81211b2a6d9d07b5e6f9ff3f3ed3d2ce67569d95))

## 0.1.0

### Minor Changes

- feat: initial package for clip sources ([`d1a4e7d`](https://github.com/jordanshatford/clip-queue/commit/d1a4e7df609f8a77ed53b2cf774edefb5c659550))
