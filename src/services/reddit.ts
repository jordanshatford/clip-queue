import axios from "axios";
import config from "@/assets/config";
import { Subreddit, SubredditPost } from "@/interfaces/reddit";

const { baseURL, maxPostsToCheck } = config.Reddit;

export default class Reddit {
  public static async getSubredditPosts(subreddit: string, amount = maxPostsToCheck): Promise<SubredditPost[]> {
    const { data } = await axios.get<{ data: Subreddit }>(`${baseURL}/r/${subreddit}/.json?limit=${amount}&sort=hot`);
    return data.data.children;
  }
}
