import type { OEmbedResponse } from '@/integrations/misc'

export const mockYouTubeOEmbed: OEmbedResponse = {
  title: 'testyoutube',
  author_name: 'testyoutubeauthor',
  author_url: 'https://youtube.com/author/test',
  type: 'video',
  height: '',
  width: '',
  version: '',
  provider_name: 'YouTube',
  provider_url: 'https://youtube.com',
  thumbnail_height: '',
  thumbnail_width: '',
  thumbnail_url: 'https://youtube.com/test/thumbnail',
  html: '',
}

export const mockRumbleOEmbed: OEmbedResponse = {
  title: 'testrumble',
  author_name: 'testrumbleauthor',
  author_url: 'https://rumble.com/author/test',
  type: 'video',
  height: '',
  width: '',
  version: '',
  provider_name: 'Rumble',
  provider_url: 'https://rumble.com',
  thumbnail_height: '',
  thumbnail_width: '',
  thumbnail_url: 'https://rumble.com/test/thumbnail',
  html: '<iframe src="https://rumble.com/embed/url">',
}

export const mockOEmbed: OEmbedResponse = {
  title: 'testoembed',
  author_name: 'testoembedauthor',
  author_url: 'https://oembed.com/author/test',
  type: 'video',
  height: '',
  width: '',
  version: '',
  provider_name: 'OEmbed',
  provider_url: 'https://oembed.com',
  thumbnail_height: '',
  thumbnail_width: '',
  thumbnail_url: 'https://oembed.com/test/thumbnail',
  html: '<iframe src="https://test-src-iframe.com/">',
}
