import type { OEmbedVideoResponse } from '../../../shared/oembed'

export const mockYouTubeOEmbed: OEmbedVideoResponse = {
  title: 'testyoutube',
  author_name: 'testyoutubeauthor',
  author_url: 'https://youtube.com/author/test',
  type: 'video',
  height: 0,
  width: 0,
  version: '',
  provider_name: 'YouTube',
  provider_url: 'https://youtube.com',
  thumbnail_height: 0,
  thumbnail_width: 0,
  thumbnail_url: 'https://youtube.com/test/thumbnail',
  html: '',
}

export const mockRumbleOEmbed: OEmbedVideoResponse = {
  title: 'testrumble',
  author_name: 'testrumbleauthor',
  author_url: 'https://rumble.com/author/test',
  type: 'video',
  height: 0,
  width: 0,
  version: '',
  provider_name: 'Rumble',
  provider_url: 'https://rumble.com',
  thumbnail_height: 0,
  thumbnail_width: 0,
  thumbnail_url: 'https://rumble.com/test/thumbnail',
  html: '<iframe src="https://rumble.com/embed/url">',
}

export const mockOEmbed: OEmbedVideoResponse = {
  title: 'testoembed',
  author_name: 'testoembedauthor',
  author_url: 'https://oembed.com/author/test',
  type: 'video',
  height: 0,
  width: 0,
  version: '',
  provider_name: 'OEmbed',
  provider_url: 'https://oembed.com',
  thumbnail_height: 0,
  thumbnail_width: 0,
  thumbnail_url: 'https://oembed.com/test/thumbnail',
  html: '<iframe src="https://test-src-iframe.com/">',
}
