# Commands

Twitch Clip Queue provides a set of commands accessible through Twich chat for moderators and the streamer. The following is a list of commands and what they are used for:

> NOTE: the command prefix is customizable via the settings, for the sake of documenation, the default prefix (`!cq`) will be used.

## Queue Commands

`!cqopen`: Open the queue, allowing clips to be submitted via chat.

`!cqclose`: Close the queue, preventing any further clips submitted in chat from being added.

`!cqclear`: Clear the queue, removing all clips. These clips can be resubmitted.

`!cqsetlimit <number>`: Set the queue limit. This will ensure the amount of clips never exceeds the set limit.

`!cqremovelimit`: Remove the limit from the queue. This will allow infinite clips to be added to the queue.

`!cqprev`: Switch back to the previous clip.

> NOTE: if there is no previously viewed clip, this will end the viewing of the current clip anyways

`!cqnext`: Switch to the next clip in queue.

> NOTE: if there are no clips in the queue, this will end the viewing of the current clip anyways

## Moderation Commands

`!cqblockchannel <channel>`: Block clips of a given channel. Any clips submitted of this channel will be ignored.

> NOTE: If the channel is already blocked, then this does nothing.

`!cqunblockchannel <channel>`: Unblock clips of a given channel. Any further clips of this channel will be added to the queue.

> NOTE: if the channel was not previously blocked, then this does nothing.

`!cqblocksubmitter <submitter>`: Block clips submitted by a given user. Any clips submitted by this user will be ignored.

> NOTE: If the submitter is already blocked, then this does nothing.

`!cqunblocksubmitter <submitter>`: Unblock clips submitted by a given user. Any further clips submitted by this user will be added to the queue.

> NOTE: if the submitter was not previously blocked, then this does nothing.

## Caching and History Commands

`!cqpurgecache`: Purge all cached clips. Clips are cached to prevent needing to reuse the providers API many times for the same clip.

`!cqpurgehistory`: Purge all clips previously viewed allowing them to be resubmitted.
