# Isolate Anticheat Settings

This is designed to help you understand the settings for modules in Isolate Anticheat so it can work better for your server.

This will show a brief description of nearly every setting in the anticheat.

## Quick Find

Allows you to find what you are looking for faster.

[Click Here](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#quick-finder)

## Anticheat Settings

This can be found in the UI (run the command !ui). Go to Configure Settings / Anticheat Settings / *

---

### General

**General Anticheat Settings**

Auto Reset Warns

> This will automatically reset a players warns after a certain time, this can help stop false kicks.

Hive Regen System

> This makes it so when you break Redstone ore you get a small amount of absorption. This is the same as in The Hive Skywars.

Smart Cheat Notifications

> Sends an urgent message to staff after a player reaches a certain amount of violations.

Smart Notification Only

> This will turn off normal flags and only notify Isolate OP's when a player reaches a certain amount of violations.

Theme

> Changes the theme of the anticheat, colours.

Flag Style

> Changes the violation counter on the flag message. [x5] or a loading bar.

Debug Info on Flag

> Shows debug information from the check on flag. Can be useful when reporting false flags on the discord.

Command Prefix

> Changes the prefix for Isolate commands (Do not change it to / it will not work)

Chat Ranks (EXP)

> Shows a rank for players when they send a message (probably broken)

Testing Mode

> Instead of kicking a player when they reach max violations, it sends a title message saying that they would have been kicked. This is good for testing the anticheat or getting it set up on your server.

Advanced CPS (EXP)

> Attempts to get a more accurate CPS count for autoclicker checks.

---

### Punishment

**Punishment Anticheat Settings**

These settings control how the automatic punishment system of Isolate Anticheat works.

Auto Kick

> Toggles automatic kicking
> 
> If enabled, when a module has its punishment set to "kick" and the maximum violations are reached, it will kick the player with a message.

Auto Ban

> Toggles automatic banning.
> 
> If enabled, when a module has its punishment set to "kick" and the maximum violations are reached, it will ban the player.

Kicks Before Ban

> If the player gets auto-kicked this many times, it will ban them for 7 days.

Only Auto-Punish Reported Player

> The anticheat will only kick or ban players that have been reported with !report

---

### Lagbacks

**Lagback Anticheat Settings**

These settings control how the player gets lagged back when a player fails a check.

Disabled

> If true, the anticheat won't lagback players.

Percent Before Lagback

> If the player gets this % of the max violations for a check, it will begin to lagback, below that it won't.

---

### Report

**Report Anticheat Settings**

These change what happen when a player gets reported

Enabled

> Is smart reporting enabled
> 
> What is smart report? It looks at anticheat data for a player when they get reported and can kick or ban them if they are suspected to be cheating.

Info Check

> Looks at a player anticheat logs and decides if they are cheating

Kick/Ban

> If disabled, the punishment will be a kick, if enabled the punishment will be a ban.

Minimum Kicks

> The minimum amount of anticheat kicks the player has to have for the info check to return as a cheater.

---

### Performance

**Performance Anticheat Settings**

These settings change how Isolate Anticheat performs on your server

Fast Maths

> If enabled, it will use custom maths which is faster than the default Javascript maths. This can be less precise but in 99% of cases, it doesn't matter.

---

# Module Settings

These settings change how modules Work

### Global

Enabled

> If the module is active or not

Description

> A brief description of the module, there is no need to change this

Punishment

> What happens when the max VL is reached
> 
> Options:
> 
> - Ban
>   
> - Kick
>   
> - Mute
>   
> - None
>   

MinVlBeforePunishment

> The minimum amount of violations before the player is autopunished.

AP (Allowed Platforms)

> What platforms the check runs on.
> 
> If the AP is set to:
> 
> - 1 - It will only check Desktop
>   
> - 2 - It will check Desktop and Console
>   
> - 3 - It will check Desktop, Console and Mobile
>   

---

## Misc Checks

Checks that don't really have a category

### Spammer

- SpammerA
  
  > This check has no unique settings
  
- SpammerB
  
  > This check has no unique settings
  
- SpammerC
  
  > This check has no unique settings
  
- SpammerD
  
  > This check has no unique settings
  

### NameSpoof

- NameSpoofA
  
  - minNameLength
    
    > The minimum length the player's name has to be.
    
  - maxNameLength
    
    > The maximum length a players name can be
    
- NameSpoofB
  
  - Regex
    
    > It is recommended that this isn't edited
    

### AutoTool

- AutoToolA
  
  - startBreakDelay
    
    > Minimum Delay
    

## Packet Checks

No its not for packet client lol.

### Exploit

- ExploitA
  
  > This check has no unique settings
  
- ExploitB
  
  > This check has no unique settings
  

### Crasher

- CrasherA
  
  > This check has no unique settings
  

### BadPackets

> Note: These settings are confusing because they aren't ordered correctly or the check has been removed but not from the config. I will fix this at some point

- BadPacketsB
  
  > Issue with config. This should be MotionA settings
  
- BadPacketsG
  
  > This check has no unique settings
  
- BadPacketsE
  
  - min_packets
    
    > The minimum amount of packets registered to flag the check
    
- BadPacketsC
  
  > This check has no unique settings + Not Working
  
- BadPacketsF
  
  > This check has no unique settings
  
- BadPacketsH
  
  > This check has no unique settings
  
- BadPacketsI
  
  - angle
    
    > Minimum Angle
    
- BadPacketsJ
  
  > This check has no unique settings
  
- BadPacketsK
  
  > This check has no unique settings
  

### Timer

- TimerA
  
  - timer_level
    
    > The max timer amount before flagging
    > 
    > So if the player seems to be using timer above the amount its cheats
    
  - timer_level_low
    
    > The same as timer_level but for low timer.
    
  - strict
    
    > This causes the timer check to be more strict on players with the tag "strict"
    > 
    > This tag is added after a player is reported or auto-kicked by the anticheat.
    
  - Safe
    
    > What situations stop the timer check from running on a player
    
    - Swimming
      
      > If the player is swimming, the check won't run
      
    - Placing
      
      > If the player has placed a block, then check won't run
      
  - Mode
    
    > What way the check will decide how much timer you are using.
    
    - Average
      
      > Gets the average timer, and if that is out of the bounds set by the threath
      
    - All
      
      > Every single part of the timer history that is recorded has to be out of bounds
      

## Combat Checks

Checks which detect combat cheats such as an autoclicker

### Reach

- ReachA
  
  - reach
    
    > The minimum reach for the check to flag.
    
  - dynamicReach
    
    > In some envionmental cases, such as being in water, it can be benifital to change the max reach value
    
  - smartReach
    
    > Similar to dynamicReach, but is for stuff like sprinting, sneaking, effects, etc
    
  - dynamicData
    
    > Ignore this
    
  - entities_blacklist
    
    > If this check false flags when hitting a certain entity,
    > 
    > 1. Report it on the discord
    >   
    > 2. Add that entity to this list
    >   
    
- ReachB
  
  > These are the same settings as ReachA
  

### Aim

> Heads up, a lot of these settings are outdated and don't actually control anything in the check, if this is the case I will put "This check has no unique settings"

- **Aim-Global**
  
  - NeedHit
    
    > This means the check can only flag if the player is in combat.
    
- AimA
  
  > This check has no unique settings
  
- AimB
  
  > This check has no unique settings
  
- AimC
  
  > This check has no unique settings
  
- AimD
  
  - buffer
    
    > How many times the check has to silent flag before it flags
    
- AimE
  
  - total
    
    > If all parts of the check add up above this amount it will flag
    
  - experimental
    
    > Actives an experimental part of the check which is designed to catch more aim cheats but, they haven't been tested as much
    
- AimF
  
  - buffer
    
    > The number of times the check has to silent flags before it flags
    
- AimG
  
  > This check has no unique settings
  
- AimH
  
  - minAvg

    > The minimum average delta for the check to work

  - maxStDev

    > If the players standard deviation is below this amount, the check will flag.
  
- AimI
  
  > The unique settings in this check don't change anything!
  

### Autoclicker

- **Autoclicker Global**
  
  - checkCPSAfter
    
    > This is the timer used to count CPS, it is recommended that it is not changed.
    
- AutoclickerA
  
  - maxCPS
    
    > The max CPS that a player can click. Anything higher than this will flag the checkl.
    
- AutoclickerB
  
  - minCPS
    
    > The minimum CPS a player has to click before the check will work on them. This is to stop false flags, anything below 10 is a really bad idea.
    
  - maxDeviation
    
    > The naming on this is a bit weird, but if the difference between a player current cps and their last CPS is less than this amount, flag them for cheating.
    
- AutoclickerC
  
  - minCPS
    
    > The minimum CPS a player has to click before the check will work on them. Anything below 6 is a bad idea.
    
  - buffer
    
    > The number of times a player has to silent flag this check before it flags.
    
  - experimental
    
    > This checks for semi rounded cps, while it can catch more autoclickers, it also has a higher chance of false flagging.
    
- AutoclickerD
  
  - minCPS
    
    > The minimum CPS a player has to click before the check will work on them. Anything below 7 is a bad idea.
    
  - spikeAmount
    
    > If a few of the players CPS deviate from the average cps by this amount, flag
    
  - buffer
    
    > The amount the check has to silent flag a player before they flag the check.
    
- AutoclickerE
  
  - minCPS
    
    > The minimum amount of cps a player has to click before the check works on them. Anything below 7 is a bad idea.
    
  - buffer
    
    > The minimum amount of times the player has to flag a certain part of the check before it counts.
    

### Killaura

- KillauraA
  
  > This check has no unique settings
  
- KillauraB
  
  > These settings should not be changed
  
- KillauraC
  
  - entities
    
    > The minimum amount of entities hit in one tick to flag the check
    
- KillauraD
  
  > Do not use this check
  
- KillauraE
  
  > This check can false a decent bit.
  
  - minSprint
    
    > The minimum amount of ticks a player has to be sprinting during the timer for the check to flag (If this value is to be changed, only increase it)
    
- KillauraF
  
  - hits
    
    > The amount of hits out of 100 that register for the check to flag.
    
  - timeMS
    
    > The time boundry. If the timer has reached this amount the data will reset.
    

### Hitbox

- HitboxA
  
  - buffer
    
    > The amount of hits out of 10/20 hits that are invalid (attacked entity is off screen)
    
  - minDistance
    
    > To stop false flags, we make sure that there is a decent gap between the players. The default value has been tested and works well so I do not recommend changing it.
    

## Movement

### NoSlow

- NoSlow A/B
  
  - speed
    
    > The minimum speed to flag under conditions
    
  - maxSpeed
    
    > This is to stop false flags with damage or other forms of knockback
    

### Sprint

- SprintA
  
  > This check has no unique settings

- SprintB

  > This check has no unique settings

### Speed

- SpeedA
  
  - speed
    
    > The minimum speed required to flag the check
    
  - velocity
    
    > The minimum velocity required for the check to work on the player
    
  - checkForSprint
    
    > Does the check look for sprinting
    
  - checkForJump
    
    > Does the check look for jumping
    
- SpeedB
  
  > This check has no unique settings
  
- SpeedC
  
  - velocity
    
    > The minimum amount of velocity required for the check to work, this is to try stop false flags with teleporting
    
  - max_bps_h
    
    > The max horizontal BPS a player can travel
    
  - max_bps_v
    
    > The max vertical BPS a player can travel
    
- SpeedD
  
  > This check has no unique settings
  
- SpeedE
  
  - bpt
    
    > The max average blocks per tick the player can have before flagging the check. This can dynamically change within the check to acount for stuff such as sprinting or speed effect
    
  - maxPredict
    
    > The max amount the check can predict actal BPS. This is to stop false flags with teleporting
    

### Fly

- FlyA
  
  > This check has no unique settings
  
- FlyB
  
  > This check has no unique settings
  
- FlyC
  
  > This check has no unique settings
  
- FlyD
  
  - Dist
    
    > The minimum distance a player should fall, do not change this value.
    

### Motion

- MotionA
  
  > The settings for this check are still linked into the badpackets check for some reason.
  
- MotionB
  
  > This check has no unique settings
  


### Prediction

The prediction check tries to predict a players position and velocity.

The check currently isnt too accurate so please, be careful when changing these settings

- deviationOGF
  
  > The maximum deviation for the Off Ground Friction prediction check.
  
- ogfBuffer
  
  > The amount of time the Off Ground Friction prediction check has to silent flag before it actually flags.
  
- minOffGroundTicksOGF

  > The minimum ticks the player has to be off ground before the Off Ground Friction prediction will work.

- deviationMain

  > The maximum deviation for the main prediction check.

- lagback

  > This currently doesnt do anything

- correctPosition

  > Bad lagback, dont use

- correctVelocity

  > Dont use.

## World Checks

### Nuker

- NukerA
  
  - maxBlocks
    
    > The max amount of blocks a player can break in 1 tick. If you are on a survival world, increase this to above 20.
    
- NukerB
  
  - angle
    
    > The max angle a player can break a bed at
    
- NukerC
  
  > Dont change anything here
  
- NukerD
  
  > This check has no unique settings
  

### Scaffold

- ScaffoldA
  
  > This check has no unique settings
  
- ScaffoldB
  
  > This check has no unique settings
  
- ScaffoldC
  
  > This check has no unique settings (Settings that don't do anything)
  
- ScaffoldD
  
  > This check has no unique settings
  
- ScaffoldE
  
  - speed
    
    > Max speed a player can place a block at
    
- ScaffoldF
  
  - blocksPerSecond
    
    > Max blocks a player can place in one tick
    

### Instabreak

- InstabreakA
  
  > This check has no unique settings
  

### Tower

- Tower A/B
  
  > This check has no unique settings
  

### Reach

- ReachC
  
  > Keep this check disabled.
  

### Total Checks

> Don't edit anything here.

---

# Quick Finder

---

## [Anticheat Settings](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#anticheat-settings)

- [General](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#general)
  
- [Punishment](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#punishment)
  
- [Lagback](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#lagbacks)
  
- [Report](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#report)
  
- [Performance](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#performance)
  

## [Module Settings](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#module-settings)

- [Global](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#global)
  
- [Misc Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#misc-checks)
  
  - [Spammer](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#misc-checks)
    
  - [Namespoof](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#misc-checks)
    
  - [Autotool](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#misc-checks)
    
- [Packet Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#packet-checks)
  
  - [Exploit](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#exploit)
    
  - [Crasher](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#crasher)
    
  - [BadPackets](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#badpackets)
    
  - [Timer](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#badpackets)
    
- [Combat Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#combat-checks)
  
  - [Reach](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#reach)
    
  - [Aim](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#aim)
    
  - [Autoclicker](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#autoclicker)
    
  - [Killaura](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#killaura)
    
  - [Hitbox](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#hitbox)
    
- [Movement Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#movement)
  
  - [NoSlow](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#noslow)
    
  - [Sprint](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#sprint)
    
  - [Speed](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#speed)
    
  - [Fly](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#fly)
    
  - [Motion](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#motion)
    
  - [Prediction](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#prediction)
    
- [World Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#world-checks)
  
  - [Nuker](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#nuker)
    
  - [Scaffold](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#scaffold)
    
  - [Instabreak](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#instabreak)
    
  - [Tower](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#tower)
    
  - [Reach](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#reach-1)
    
- [Total Checks](https://github.com/Dream23322/Isolate-Anticheat/blob/main/assets/howtoconfig.md#reach-1)
  

---

### Made by:

4urxra - Isolate Anticheat

note: this took forever, like 2 hr of just typing.
