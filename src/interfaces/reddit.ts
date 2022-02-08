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
