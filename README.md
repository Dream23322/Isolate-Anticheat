# Isolate Anticheat
The most advanced minecraft bedrock edition anticheat for pvp style servers

# What is Isolate?
Isolate Anticheat is the most advanced minecraft bedrock edition anticheat, it has the best fly, killaura, speed, reach and exploit checks in an anticheat. It was made because there are issues in scythe that seem to not be getting fixed.
Its also made with copious amounts of:
**TEA**
![Alt text](image.png)

# Main checks!
__**Fly**__

A - Checks for horion vanilla velocity

B - Vertical fly

C - Horizontal Fly

D - Velocity

E - Velocity (2)

F - Fall 

G - Fall



**__Speed__**

A - Unatural speed

**Motion**

A - Horizontal

B - Jump

**Scaffold**

A - Tower

B - Angle check

C - Invalid keypresses

# Full Check list for Isolate Anticheat
*\* indicates that the check requires Beta APIs to be enabled in world settings.*<br />
  AutoClicker -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for high CPS.\*<br />

  AutoTool -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player switches their slot right after they start breaking a block.\*<br />

  AutoShield -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player equips a shield while moving.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks if a player equips a shield while using an item.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks if a player equips a shield while swinging their hand.<br />

  AutoTotem -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player equips a totem while moving.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks if a player equips a totem while using an item.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks if a player equips a totem while swinging their hand.<br />

  BadEnchants -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for enchantment levels exceeding vanilla limits.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for negative enchantment levels.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks if an item is enchanted with an enchant that cant be applied to the item.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Checks if an item has a lore.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => Checks if an item has duplicated enchantments.\*<br />

  BadPackets -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1) => Checks for invalid player head rotations.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3) => Checks for self-hurt.\*<br />

  Command Block Exploit -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Clears animal buckets/beehives.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Replaces beehives and beenests with air.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Kill all spawned in command block minecarts.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Kills all NPC's. (to enable use /function settings/npc)<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => Instant despawn time for command block minecarts.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(F) => Prevents the placement of beehives, beenests and movingblocks.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(G) => Additional killing check.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(H) => Additional item clearing check.\*<br />

  FastUse -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for using/throwing items at a very fast rate.\*

  Fly -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for fly-like motion..\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for vertical fly.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks for invalid speed and velocity while in the air.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Velocity check 2.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => Checks for being in air but not falling.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(F) => Checks for certain speeds in the air.\*<br />

  Illegal Items -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for illegal items in player inventories.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Clears illegal dropped items.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks for items that are stacked over 64.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Additional item clearing check.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => Cancel placement of illegal items.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(F) => Checks if an item has a name longer than 32 characters.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(G) => Checks if a player used fireworks rocket with flight duration greater than 3.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(H) => Checks if a player places an invalid piston.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(I) => Checks if a player places a chest with items already inside it.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(J) => Checks if a player places a sign with text already inside it.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(K) => Checks if a player places a chest boat/minecart with items already inside it\*.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(L) => Checks for keep on death items.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(M) => Checks for unexpected item in offhand.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(N) => Checks for placing a shulker box with illegal items.\*<br />

  InstaBreak -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player breaks an unbreakable block whilst in survival.\*<br />

  InvalidSprint -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for sprinting while having the blindness effect.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for sprinting while using an item.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks for sprinting while sneaking.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Checks for sprinting while using an elytra.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => Checks for sprinting while riding an entity.<br />

  InventoryMods-><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for using an item while having a chest open.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for attacking players while having a chest open.<br />

  Killaura -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for attacking the killaura bot.<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for no swing. (Instantly detects toolbox killaura)<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks for multi-aura.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Checks for attacking while sleeping.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(E) => (Coming Soon) Checks if a player hits another entity without having them on screen <br />

  Namespoof -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player's name is longer than 16 characters.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks for invalid characters in the player's name.\*<br />

  NoSlow -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks for high movement speeds while using or eating an item.\*

  Nuker -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if a player breaks more than 3 blocks in a single tick.\*

  Reach -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Check if someone hits a player outside a 5 block radius.\*<br />

  Spammer -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Checks if someone sends a message while moving.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(B) => Checks if someone sends a message while swinging their hand.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(C) => Checks if someone sends a message while using an item.\*<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(D) => Checks if someone sends a message while having a chest opened.\*<br />

  Scaffold -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Check for tower-like behavior.\*<br />

  Xray -><br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(A) => Alerts staff if a player finds a diamond or ancient debris.


