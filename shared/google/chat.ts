// import axios from 'axios';
// import {Subject} from 'rxjs';

// const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
// const SEARCH_QUOTA_USAGE = 100;
// const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
// const VIDEOS_LIST_QUOTA_USAGE = 1;
// const LIVE_CHAT_MESSAGES_URL = 'https://www.googleapis.com/youtube/v3/liveChat/messages';
// const LIVE_CHAT_MESSAGES_LIST_QUOTA = 5; // This was determined to be correct via experimentation on 10/7/20
// const LIVE_CHAT_MESSAGE_QUOTA_PER_ITEM = 0; // This *should* be 0, but it's here in case it's not.
// const MAX_MAX_RESULTS = 2000;
// const MIN_REQUEST_DELAY = 5000;

// export class YouTubeLiveChat {
//   public estimatedQuotaUsed = 0;

//   private static subjectCache: {[index: string]: Subject<YouTubeLiveChatMessage>} = {};

//   constructor(private apiKey: string) {}

//   public async searchChannelForLiveVideoIds(channelId: string) {
//     const resp = await axios.get(SEARCH_URL, {params: {
//         eventType: 'live',
//         part: 'id',
//         channelId,
//         type: 'video',
//         key: this.apiKey,
//     }});
//     this.estimatedQuotaUsed += SEARCH_QUOTA_USAGE;
//     const respData = resp.data as YouTubeSearchResponse;
//     return respData.items.map((i) => i.id.videoId);
//   }

//   public async getLiveChatIdFromVideoId(id: string) {
//     const resp = await axios.get(VIDEOS_URL, {params: {
//         part: 'liveStreamingDetails',
//         id,
//         key: this.apiKey,
//     }});
//     this.estimatedQuotaUsed += VIDEOS_LIST_QUOTA_USAGE;
//     const respData = resp.data as YouTubeVideoListResponse;
//     if (respData.items.length === 1) {
//       return respData.items[0].liveStreamingDetails.activeLiveChatId;
//     } else if (respData.items.length === 0) {
//       return null;
//     } else {
//       throw new Error(`How are there ${respData.items.length} videos with the same ID (${id}) ?!?!`);
//     }
//   }

//   private async fetchLiveChats(liveChatId: string, pageToken?: string, maxResults?: number) {
//     const resp = await axios.get(LIVE_CHAT_MESSAGES_URL, {params: {
//         liveChatId,
//         pageToken,
//         maxResults: maxResults || MAX_MAX_RESULTS,
//         part: 'id,snippet,authorDetails',
//         profileImageSize: 16,
//         key: this.apiKey,
//     }});
//     const respData = resp.data as YouTubeLiveChatResponse;
//     this.estimatedQuotaUsed += LIVE_CHAT_MESSAGES_LIST_QUOTA;
//     this.estimatedQuotaUsed += respData.items.length * LIVE_CHAT_MESSAGE_QUOTA_PER_ITEM;
//     return respData;
//   }

//   public listen(liveChatId: string) {
//     if (!YouTubeLiveChat.subjectCache[liveChatId]) {
//       YouTubeLiveChat.subjectCache[liveChatId] = new Subject<YouTubeLiveChatMessage>();
//       const resultsFetchLoop = (result: YouTubeLiveChatResponse) => {
//         if (YouTubeLiveChat.subjectCache[liveChatId].isStopped) {
//           return;
//         }
//         if (!result) {
//           YouTubeLiveChat.subjectCache[liveChatId].error({
//             code: null,
//             message: 'Unkonwn error occurred - no result object was given',
//           } as YouTubeErrorObject);
//         } else if (result.error) {
//           YouTubeLiveChat.subjectCache[liveChatId].error(result.error);
//         } else {
//           let chatEndedFlag = false;
//           for (const message of result.items) {
//             YouTubeLiveChat.subjectCache[liveChatId].next(message);
//             if (message.snippet.type === 'chatEndedEvent') {
//               chatEndedFlag = true;
//             }
//           }
//           if (result.offlineAt || chatEndedFlag) {
//             this.stop(liveChatId);
//             return;
//           }
//           setTimeout(() => {
//             this.fetchLiveChats(liveChatId, result.nextPageToken).then(resultsFetchLoop);
//           }, Math.max(result.pollingIntervalMillis, MIN_REQUEST_DELAY));
//         }
//       };
//       this.fetchLiveChats(liveChatId, undefined, 1).then(resultsFetchLoop);
//     }
//     return YouTubeLiveChat.subjectCache[liveChatId];
//   }

//   public stop(liveChatId: string) {
//     if (YouTubeLiveChat.subjectCache[liveChatId]) {
//       YouTubeLiveChat.subjectCache[liveChatId].complete();
//       delete YouTubeLiveChat.subjectCache[liveChatId];
//     }
//   }
// }

// export interface YouTubeSearchResponse {
//   kind: 'youtube#searchListResponse';
//   etag: string;
//   regionCode: string;
//   pageInfo: {
//     totalResults: number,
//     resultsPerPage: number,
//   };
//   error?: YouTubeErrorObject;
//   items: {
//     kind: 'youtube#searchResult',
//     etag: string,
//     id: {
//       kind: 'youtube#video',
//       videoId: string,
//     },
//   }[];
// }

// export interface YouTubeVideoListResponse {
//   kind: 'youtube#videoListResponse';
//   etag: string;
//   pageInfo: {
//     totalResults: number,
//     resultsPerPage: number,
//   };
//   error?: YouTubeErrorObject;
//   items: {
//     kind: 'youtube#video',
//     etag: string,
//     id: string,
//     liveStreamingDetails: {
//       actualStartTime: string,
//       scheduledStartTime: string,
//       concurrentViewers: string, // WHY?!?!?
//       activeLiveChatId: string,
//     },
//   }[];
// }

// export interface YouTubeLiveChatResponse {
//   kind: 'youtube#liveChatMessageListResponse';
//   etag: string;
//   nextPageToken: string;
//   pollingIntervalMillis: number;
//   offlineAt: string;
//   pageInfo: {
//     totalResults: number,
//     resultsPerPage: number,
//   };
//   error?: YouTubeErrorObject;
//   items: YouTubeLiveChatMessage[];
// }

// export interface YouTubeLiveChatMessage {
//   kind: 'youtube#liveChatMessage';
//   etag: string;
//   id: string;
//   snippet: YouTubeNoExtraBodyEvent | YouTubeSuperStickerEvent | YouTubeSuperChatEvent | YouTubeUserBannedEvent | YouTubeMessageDeletedEvent | YouTubeTextMessageEvent;
//   authorDetails: {
//     channelId: string
//     channelUrl: string
//     displayName: string
//     profileImageUrl: string,
//     isVerified: boolean,
//     isChatOwner: boolean,
//     isChatSponsor: boolean,
//     isChatModerator: boolean,
//   };
// }

// interface YouTubeChatSnippet {
//   liveChatId: string;
//   authorChannelId: string;
//   publishedAt: string;
//   hasDisplayContent: boolean;
// }

// export interface YouTubeTextMessageEvent extends YouTubeChatSnippet {
//   type: 'textMessageEvent';
//   displayMessage: string;
//   textMessageDetails: {
//     messageText: string,
//   };
// }

// export interface YouTubeMessageDeletedEvent extends YouTubeChatSnippet {
//   type: 'messageDeletedEvent';
//   messageDeletedDetails: {
//     deletedMessageId: string;
//   };
// }

// export interface YouTubeUserBannedEvent extends YouTubeChatSnippet {
//   type: 'userBannedEvent';
//   userBannedDetails: {
//     bannedUserDetails: {
//       channelId: string;
//       channelUrl: string;
//       displayName: string;
//       profileImageUrl: string;
//     };
//     banType: 'permanent' | 'temporary';
//     banDurationSeconds?: number;
//   };
// }

// export interface YouTubeSuperChatEvent extends YouTubeChatSnippet {
//   type: 'superChatEvent';
//   superChatDetails: {
//     amountMicros: number;
//     currency: string;
//     amountDisplayString: string;
//     userComment: string;
//     tier: number;
//   };
// }

// export interface YouTubeSuperStickerEvent extends YouTubeChatSnippet {
//   type: 'superStickerEvent';
//   superStickerDetails: {
//     superStickerMetadata: {
//       stickerId: string;
//       altText: string;
//       language: string;
//     }
//     amountMicros: number;
//     currency: string;
//     amountDisplayString: string;
//     userComment: string;
//     tier: number;
//   };
// }

// export interface YouTubeNoExtraBodyEvent extends YouTubeChatSnippet {
//   type: 'chatEndedEvent' | 'newSponsorEvent' | 'sponsorOnlyModeEndedEvent' | 'sponsorOnlyModeStartedEvent' | 'tombstone';
// }

// export interface YouTubeErrorObject {
//   code: number;
//   message: string;
//   errors: {
//     message: string;
//     domain: string;
//     reason: string;
//   }[];
// }
