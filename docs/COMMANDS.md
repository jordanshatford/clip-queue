# Commands

Clip Queue provides a set of commands accessible through Twich chat for moderators and the streamer. The following is a list of commands and what they are used for:

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

## Remove Clip Commands

`!cqremovebysubmitter <submitter>`: Remove any clips that are in the queue and have been submitted by the given submitter.

> NOTE: if the submitter exists on multiple providers it will remove all of those clips. If a clip has multiple submitters it will remove the submitter from that clip.

`!cqremovebychannel <channel>`: Remove any clips in the queue that are of the given channel.

> NOTE: if the channel exists on multiple providers it will remove clips from all of the providers.

`!cqremovebyprovider <provider>`: Remove any clips in the queue that are from a given provider.

> NOTE: if the provider specified is invalid this will be ignored.

## Caching and History Commands

`!cqpurgecache`: Purge all cached clips. Clips are cached to prevent needing to reuse the providers API many times for the same clip.

`!cqpurgehistory`: Purge all clips previously viewed allowing them to be resubmitted.
