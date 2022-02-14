import type { TwitchClip, TwitchGame } from "@/services/twitch"

const gamesKey = "cached-games"
const clipsKey = "cached-clips"

let twitchGameCache: Record<string, TwitchGame> = {}
let twitchClipCache: Record<string, TwitchClip> = {}

function init(): void {
  const games = localStorage.getItem(gamesKey)
  if (games) {
    twitchGameCache = JSON.parse(games)
  }
  const clips = localStorage.getItem(clipsKey)
  if (clips) {
    twitchClipCache = JSON.parse(clips)
  }
}

function addGame(game: TwitchGame): void {
  if (game?.id) {
    twitchGameCache[game.id] = game
    writeToLocalStorage(gamesKey, twitchGameCache)
  }
}

function getGame(id: string): TwitchGame {
  return twitchGameCache?.[id] ?? undefined
}

function addClip(clip: TwitchClip): void {
  if (clip?.id) {
    twitchClipCache[clip.id] = clip
    writeToLocalStorage(clipsKey, twitchClipCache)
  }
}

function getClip(id: string): TwitchClip {
  return twitchClipCache?.[id] ?? undefined
}

function writeToLocalStorage(key: string, value: Record<string, TwitchGame | TwitchClip>): void {
  localStorage?.setItem(key, JSON.stringify(value))
}

export const cache = {
  init,
  addGame,
  getGame,
  addClip,
  getClip,
}
