import axios from "axios"

const BASE_URL = "https://api.reddit.com"

export interface SubredditPost {
  data: {
    author: string
    url: string
    stickied: boolean
  }
}

export interface Subreddit {
  children: SubredditPost[]
}

export async function getSubredditPosts(subreddit: string, numPosts = 100): Promise<SubredditPost[]> {
  try {
    const { data } = await axios.get<{ data: Subreddit }>(`${BASE_URL}/r/${subreddit}/.json?limit=${numPosts}&sort=hot`)
    return data.data.children
  } catch (e) {
    console.error({ e })
    return []
  }
}

export default {
  getSubredditPosts,
}
