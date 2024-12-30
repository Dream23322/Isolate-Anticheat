# This file is for goofy utils that are annoying to do in javascript


# Add gamemode tags
tag @a[m=c] add gmc 
tag @a[m=s] add gms 
tag @a[m=a] add gma 
tag @a[m=spectator] add spec 

# Remove gamemode tags
tag @a[m=!c] remove gmc 
tag @a[m=!s] remove gms 
tag @a[m=!a] remove gma 
tag @a[m=!spectator] remove spec 

# remove tags
tag @a remove elytra

# add tags
tag @a[hasitem={item=elytra}] add elytra
tag @a[hasitem={item=wind_charge}] add wind_charge


# scoreboard handling
scoreboard players add @a[tag=right,scores={right=..1000}] right 1
scoreboard players add @a[tag=!moving,scores={last_move=..1000}] last_move 1