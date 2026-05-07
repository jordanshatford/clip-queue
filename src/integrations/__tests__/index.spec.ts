import { describe, it, expect } from 'vitest'

import { IntegrationID, integrations } from '..'

const providers = integrations.flatMap((i) => i.providers)

// Helper to get integration ID of provider than handles a URL.
function getIntegrationId(url: string): IntegrationID | undefined {
  const matches = providers.filter((p) => p.hasClipSupport(url))

  // We should never have overlapping providers.
  if (matches.length > 1) {
    throw new Error('Multiple providers matched')
  }

  return matches[0]?.id ?? undefined
}

describe('integrations', () => {
  it.each([
    ['', undefined],
    ['https://google.ca', undefined],
    ['https://twitch.tv', undefined],
    ['https://twitch.tv/videos', undefined],
    ['https://twitch.tv/videos/', undefined],
    ['https://twitch.tv/videos/test', IntegrationID.TWITCH_VODS],
    ['https://www.twitch.tv/videos/test', IntegrationID.TWITCH_VODS],
    ['https://twitch.tv/channel/v', undefined],
    ['https://twitch.tv/channel/v/', undefined],
    ['http://www.twitch.tv/channel/v/test', IntegrationID.TWITCH_VODS],
    ['http://www.twitch.tv/channel/v/test?t=5m10s', IntegrationID.TWITCH_VODS],
    ['https://twitch.tv/channel/clip', undefined],
    ['https://twitch.tv/channel/clip/', undefined],
    ['https://m.twitch.tv/clip/testclip', IntegrationID.TWITCH_CLIPS],
    ['https://clips.twitch.tv', undefined],
    ['https://clips.twitch.tv/channel/testclip', IntegrationID.TWITCH_CLIPS],
    ['https://www.twitch.tv/channel/clip/testclip', IntegrationID.TWITCH_CLIPS],
    ['https://youtube.com/shorts', undefined],
    ['https://youtube.com/shorts/', undefined],
    ['https://youtube.com/shorts/testshort', IntegrationID.YOUTUBE_SHORTS],
    ['https://www.youtube.com/shorts/testshort', IntegrationID.YOUTUBE_SHORTS],
    ['https://youtube.com/', undefined],
    ['https://youtube.com/watch?v=testvideo', IntegrationID.YOUTUBE_VIDEOS],
    ['https://www.youtube.com/watch?v=testvideo', IntegrationID.YOUTUBE_VIDEOS],
    ['https://www.youtube.com/watch?v=testvideo&t=123', IntegrationID.YOUTUBE_VIDEOS],
    ['https://youtu.be', undefined],
    ['https://youtu.be/testvideo', IntegrationID.YOUTUBE_VIDEOS],
    ['https://youtu.be/testvideo?t=123', IntegrationID.YOUTUBE_VIDEOS],
    ['https://kick.com', undefined],
    ['https://kick.com/channel?clip=clip_ABC', IntegrationID.KICK_CLIPS],
    ['https://kick.com/channel/clip', undefined],
    ['https://kick.com/channel/clip/', undefined],
    ['https://www.kick.com/channel/clip/clip_ABC', IntegrationID.KICK_CLIPS],
    ['https://kick.com/channel/clip/clip_ABC', IntegrationID.KICK_CLIPS],
    ['https://kick.com/test?clip=clip_01HQ7ZWTEKKJP16Y34SDFF2SBC', IntegrationID.KICK_CLIPS],
    ['https://kick.com/channel/videos', undefined],
    ['https://kick.com/channel/videos/', undefined],
    [`https://kick.com/channel/videos/test-id`, IntegrationID.KICK_VODS],
    [`https://www.kick.com/channel/videos/test-id`, IntegrationID.KICK_VODS],
    [`https://www.kick.com/channel/videos/test-id?t=123`, IntegrationID.KICK_VODS],
    ['https://vimeo.com', undefined],
    ['https://www.vimeo.com/test', IntegrationID.VIMEO],
    ['https://vimeo.com/test', IntegrationID.VIMEO],
    ['https://vimeo.com/test#t=1m21s', IntegrationID.VIMEO],
    ['https://vimeo.com/test#t=1m0s&end=2m1s', IntegrationID.VIMEO],
    ['https://vod.sooplive.com', undefined],
    ['https://vod.sooplive.com/player/test', IntegrationID.SOOP],
    ['https://vod.sooplive.com/player/test?change_second=123', IntegrationID.SOOP],
    ['https://streamable.com', undefined],
    ['https://streamable.com/test', IntegrationID.STREAMABLE],
    ['https://www.streamable.com/test', IntegrationID.STREAMABLE],
    ['https://dai.ly', undefined],
    ['https://dai.ly/testvideo', IntegrationID.DAILYMOTION],
    ['https://www.dailymotion.com/video/testvideo', IntegrationID.DAILYMOTION],
    ['https://dailymotion.com', undefined],
    ['https://dailymotion.com/video/', undefined],
    ['https://dailymotion.com/video/testvideo', IntegrationID.DAILYMOTION],
    ['https://medal.tv', undefined],
    ['https://medal.tv/games/testgame/clips', undefined],
    ['https://medal.tv/games/testgame/clips/', undefined],
    ['https://medal.tv/clips/testclip', IntegrationID.MEDAL],
    ['https://medal.tv/games/testgame/clips/testclip', IntegrationID.MEDAL],
    ['https://www.medal.tv/games/testgame/clips/testclip', IntegrationID.MEDAL],
    ['https://www.rumble.com/testid-some-test-title.html', IntegrationID.RUMBLE],
    ['https://rumble.com', undefined],
    ['https://rumble.com/testid-some-test-title.html', IntegrationID.RUMBLE],
    ['https://rumble.com/testid-some-test-title.html?start=60', IntegrationID.RUMBLE],
    ['https://rumble.com/embed', undefined],
    ['https://rumble.com/embed/', undefined],
    ['https://rumble.com/embed/testvideo', IntegrationID.RUMBLE],
    ['https://rumble.com/embed/testvideo/?start=10', IntegrationID.RUMBLE],
    ['https://rumble.com/shorts', undefined],
    ['https://rumble.com/shorts/', undefined],
    ['https://www.rumble.com/shorts/testshort', IntegrationID.RUMBLE],
    ['https://rumble.com/shorts/testshort', IntegrationID.RUMBLE],
  ])(
    'expects that url %s is handled by provider %s',
    (url: string, expected: IntegrationID | undefined) => {
      expect(getIntegrationId(url)).toEqual(expected)
    },
  )
})
