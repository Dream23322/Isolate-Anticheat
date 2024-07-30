# Installing

You install Isolate Anticheat like any other behaviour pack, just make sure the scripting API is on!

# Commands

You can get a list of commands by running the `!help` command in-game.

**__How to ban someone?__**

You ban someone using the command (or ui)

Here is the formatting:
```
!ban <player:required> <time:optional> <reason:optional>
```
Here is an example:
```
!ban LurkingMouse83248 7d Cheating/Hacking
```

**__How to unban someone?__**

Use the `!unban` command

**__How to mute someone?__**

Use the `!mute` command

# UI

You can get the UI via an item (`!ui`) or by doing /function ui

# Configing

The hardest but best part about Isolate.

**WARNING: This can be hard and if after reading this you still don't understand, please join the discord for more help**

This can be done in the UI aswell but I will use commands here.

**__Disabling a module__**

Here is the formatting to disable a module

```
!module <check:required>+<checkType:required> enabled false
```
Here is an example:
```
!module speedE enabled false
```
**__Changing Punishment Settings__**

Here are the different punishment settings:

punishment | `str` | "kick"/"mute"/"ban" - Changes the punishment type, punishment will happen after the players violations exceed minVlBeforePunishment

minVlBeforePunishment | `int` | 10 - Changes the amount of violations before punishment happens

banLength | `str` | "7d"/"1m"/"1y" - Changes the length of the punishment