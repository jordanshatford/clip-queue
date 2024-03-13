# Commands

Clip Queue provides commands accessible through Twitch chat for the streamer and moderators of the stream. The following is a list of available commands:

> NOTE: the command prefix can be customized in the settings. The default prefix is `!cq`.

## Queue Commands

`!cqopen`: Open the queue.

> NOTE: This does nothing if the queue is already open.

`!cqclose`: Close the queue.

> NOTE: This does nothing if the queue is already closed.

`!cqclear`: Remove all clips in the queue.

> NOTE: This does nothing if the queue is empty.

`!cqsetlimit <number>`: Set the queue size limit.

> NOTE: This does nothing if the `<number>` is not 1 or more.

`!cqremovelimit`: Remove the queue size limit.

> NOTE: This does nothing if the queue is not limited.

`!cqprev`: Switch to the previous clip.

> NOTE: If there is no previous clip, this will end the viewing of the current clip.

`!cqnext`: Switch to the next clip.

> NOTE: If there is no next clip, this will end the viewing of the current clip.

`!cqremovebysubmitter <submitter>`: Remove clips sent by the submitter.

> NOTE: If a clip has multiple submitters it will remove the submitter from that clip but the clip will stay in the queue.

`!cqremovebyprovider <provider>`: Remove clips from the provider.

> NOTE: This does nothing if the `<provider>` is not a valid provider.

`!cqenableprovider <provider>`: Enable the specified provider if it is valid.

> NOTE: This does nothing if the `<provider>` is already enabled or is not a valid provider.

`!cqdisableprovider <provider>`: Disable the specified provider if it is valid.

> NOTE: This does nothing if the `<provider>` is already disabled or is not a valid provider.

`!cqenableautomod`: Enable auto moderation.

> NOTE: This does nothing if auto moderation is already enabled.

`!cqdisableautomod`: Disable auto moderation.

> NOTE: This does nothing if auto moderation is already disabled.

## Other Commands

`!cqpurgecache`: Purge all cached clips.

`!cqpurgehistory`: Purge all historically watched clips.
