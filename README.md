# CustomNpcs-Scripts
Advanced Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

* Want to see all of these scripts in action? Check out [METAL WEAPON: RE:COIL](https://www.planetminecraft.com/project/metal-weapon-3-re-coil/)

## Table of Contents
1. **JTunes** - Fully Fledged Background music using AudioJ2CK
2. **AudioJ2CK** - 2D Audio / No Input Lag
3. **HyperSpawnpoint12** - Better Spawnpoints w/ Optional Spectator Mechanic
4. **HyperMobSpawner12** - Soulslike Enemy Respawning
5. **ACInstaller** - Adventure Map automatically installs map content/resources/skins/sounds
6. **FUtil** - File System Editing
7. **StandardUtil12** - Vector Math at Your Fingertips
8. Legacy 1.7.10 Ports

## JTunes
A fully fleshed out audio system utilizing the power of AudioJ2CK for 1.12.2+ Play seamless background/boss music, *anytime, anywhere!*

### Setup
Place WAV files in `<.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds/audiojack`
1. Load AudioJ2CK and JTunes in playerscript
2. Call `JTunes.Login(e);` and `JTunes.Tick(e);` - in player login/tick respectively
3. Edit Songs/Triggers in JTunes.js

### Boss Music

Start / Stop Boss music using world Tempdata. NOTE: Starting boss music automatically stops the background music and resumes it after you stop the boss music
```js
world.getTempdata().put("JBOSS", "my_song_name");
world.getTempdata().put("JBOSS", null);
```

## AudioJ2CK
Place WAV files in `<.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds/audiojack`

1. Load script anywhere (npc, block, or player)
2. Call `Audio.Logout(e);` inside your playerscript logout event.  
3. Call any of the below:  

```js
Audio.Play("wavFileName");
Audio.Play("wavFileName", audioGain);
Audio.Loop("wavFileName");
Audio.Loop("wavFileName", audioGain);
Audio.Stop("wavFileName");
Audio.StopAll();
Audio.IsPlaying("wavFileName");
```
## HyperSpawnpoint12
Location-Based Spawnpoints with an optional Spectator Mechanic (for Singleplayer or Multiplayer)

Requires:
* [**HyperSpawnpoint12.js**](https://github.com/H4CKR3M/CustomNpcs-Scripts/blob/main/HyperSpawnpoint12.js)
* [**HSpawnpointPlayer.js**](https://github.com/H4CKR3M/CustomNpcs-Scripts/blob/main/HSpawnpointPlayer.js)
* [**HSpawnpointOrigin.js**](https://github.com/H4CKR3M/CustomNpcs-Scripts/blob/main/HSpawnpointOrigin.js)

### 1. Basic Setup

1. First we'll need to modify the playerscript. Open the playerscript (npc scripted right-click the air).
2. Load `HyperSpawnpoint12.js` and `HSpawnpointPlayer.js` in the playerscript.
3. Paste the following:
```js
// Requires: HSpawnpointPlayer, HyperSpawnpoint12

function login(e){
    HSpawnpointPlayer.Login(e);
}

function logout(e){
    HSpawnpointPlayer.Logout(e);
}
```

4. Next, Place a Scripted Block at the World Origin `/setworldspawn` I like to make this a black box that the player starts in. Don't forget to type `/gamerule spawnRadius 0` in-game.
5. Load `HyperSpawnpoint12.js` and `HSpawnpointOrigin.js` on the block.
6. Paste the following:
```js
// Requires: HSpawnpointOrigin, HyperSpawnpoint12

function tick(e){
    HSpawnpointOrigin.Tick(e);
}
```

7. Next, let's make our first spawnpoint! First, place down another scripted block far away from the World Origin.
8. Load `HyperSpawnpoint12.js` on the second block.
9. Paste the following:
```js
/* Basic Spawnpoint | ScriptedBlock | Minecraft 1.12.2 (05Jul20)
 * Requires: HyperSpawnpoint12
 */

var spawnpoint;

function init(e){
    spawnpoint = HyperSpawn.hyperSpawnpoint;
    spawnpoint.pos = { x:e.block.x+0.5, y:e.block.y+2, z:e.block.z+0.5};
    spawnpoint.block = e.block;
    spawnpoint.world = e.block.world;
}

function tick(e){
    spawnpoint.SaveNearbyPlayers();
}
```

10. The default location the player is sent to if they have **NOT** touched a spawnpoint can be set in `HyperSpawnpoint12.js` at the top of the file. It's labeled: `defaultStart: { x:-79.5, y:90.5, z:93.5 }`
* You can also tweak the default spawnpoint range in `HyperSpawnpoint12.js`

### 2. Advanced Setup

So you have your spawnpoints working, but you want more control over player rotation, yaw, etc... Well, you're in luck! Each spawnpoint can be tweaked individually. Let's see what a more advanced version of your spawnpoint code *(See 1. Basic Setup, Step 9.)* might look like:
```js
/* Advanced Spawnpoint | ScriptedBlock | Minecraft 1.12.2 (05Jul20)
 * Requires: HyperSpawnpoint12
 */

var spawnpoint;

function init(e){
    spawnpoint = HyperSpawn.hyperSpawnpoint;
    spawnpoint.pos = { x:e.block.x+0.5, y:e.block.y+2, z:e.block.z+0.5};
    spawnpoint.yaw = 180;
    spawnpoint.pitch = 0;
    spawnpoint.range = 5;
    spawnpoint.block = e.block;
    spawnpoint.world = e.block.world;
    e.block.model = "minecraft:sea_lantern";
}

function tick(e){
    spawnpoint.SaveNearbyPlayers();
}
```

### 3. Enabling/Disabling Spectator Mode [Advanced]

On multiplayer, if **player1** is killed, they will be switched to spectator mode. Only after **player2** reaches a new spawnpoint, will **player1** be revived. This behavior can be toggled ON/OFF.

* To **ENABLE** the spectator mechanic, open `HyperSpawnpoint12.js` and change `ID:` to anything. For example: `ID: "ID"` would be fine, or `ID: "world1"` etc...
* To **DISABLE** the spectator mechanic, open `HyperSpawnpoint12.js` and change set ID to none `ID: "none"`

But what does setting the `ID` actually do? Well, setting it to `"none"` completely disables the spectator mechanic. Players will respawn instantly when they are killed. Setting the `ID` to something else will assign that spawnpoint to a group. All players interacting with spawnpoints of the same `ID` will respawn when touching other spawnpoints of the same group. If you're unsure what `ID` to use, and you still want to use the spectator mechanic, just set the `ID` to ID in `HyperSpawnpoint12.js`. Like this: `ID: "ID"`

### 4. ACInstaller Support [Advanced]

You can modify the spawnpoint origin code *(See HyperSpawnpoint12, 1. Basic Setup )* to teleport the player out of the world spawn only after installing skins/textures/sounds to the player's world. The below code can be used to achieve this. Don't forget to load `FUtil`, `ACInstaller`, `HSpawnpointOrigin`, `HyperSpawnpoint12`
* *Remember! We're pasting this script on the scripted block at the World Origin `/setworldspawn`*
```js
// Requires: FUtil, ACInstaller, HSpawnpointOrigin, HyperSpawnpoint12

var counter = 0;
var needsRestart = false;
var waitTime = 5;

function tick(e){
    if (needsRestart){
        if (counter % 5 == 0)
            ACI.Say(e, "§6YOU MUST FULLY §f§lRESTART MINECRAFT§6 TO FINISH!");
        counter++;
        return;
    }
    else if (ACI.IsInstalled(e)){
        HSpawnpointOrigin.Tick(e);
        return;
    }

    if (counter >= waitTime){
        if (counter == waitTime){
            ACI.Install(e);
            if (!FUtil.IsDedicatedServer(e.API))
                needsRestart = true;
        }
    }
    counter++;
}
```

### 5. ACInstaller Support with DLOAD [Very Advanced]

If you're feeling up to it, the origin code can be modified a third time to support DLOAD (a DLC Installer/Loader for Minecraft Maps). I won't go too far into the details here, suffice it to say the code waits for DLOAD to finish installing any DLC the player might need, before warping the player out of the world origin. Don't forget to load `FUtil`, `ACInstaller`, `HSpawnpointOrigin`, `HyperSpawnpoint12`

```js
// Requires: FUtil, ACInstaller, HSpawnpointOrigin, HyperSpawnpoint12

var counter = 0;
var needsRestart = false;
var waitTime = 5;
var loadCompleteKey = "DLOAD_COMPLETE";

function tick(e){
    if (needsRestart){
        if (counter % 5 == 0)
            ACI.Say(e, "§6YOU MUST FULLY §f§lRESTART MINECRAFT§6 TO FINISH!");
        counter++;
        return;
    }
    else if (ACI.IsInstalled(e)){
        HSpawnpointOrigin.Tick(e);
        return;
    }

    // WAIT for Dload to finish
    if (e.block.world.getTempdata().has(loadCompleteKey) && e.block.world.getTempdata().get(loadCompleteKey) == true){
        if (counter >= waitTime){
            if (counter == waitTime){
                ACI.Install(e);
                if (!FUtil.IsDedicatedServer(e.API))
                    needsRestart = true;
            }
        }
        counter++;
    }
}
```

## HyperMobSpawner12
An easy to use despawning/respawning system for enemies! Here's how it works, if the player dies, all enemies are despawned/respawned **lag-free**!

Requires:
* [**HyperMobSpawner12.js**](https://github.com/H4CKR3M/CustomNpcs-Scripts/blob/main/HyperMobSpawner12.js)
* Requires the use of HyperSpawnpoint12 *(See HyperSpawnpoint12, 1. Basic Setup)*

Example:
1. Save an npc named **npc1** and an npc named **npc2** to tab 1 in the mob cloner (Server)
2. Place down a scripted block (this will be our mob spawner)
3. Load `HyperMobSpawner12` on the block.
4. Paste the following:
```js
/* v1.0 - HMobSpawner | ScriptedBlock | Minecraft 1.12.2 (05Jul20)
 * Requires: HyperMobSpawner12
 */

var mobSpawner;

function init(e){
    mobSpawner = HyperMobSpawner.mobSpawner;
    mobSpawner.pos = { x:e.block.x, y:e.block.y+2, z:e.block.z};
    mobSpawner.mobSpawnerID = "UniqueID";
    mobSpawner.range = 20;
    mobSpawner.block = e.block;
    mobSpawner.world = e.block.world;
    e.block.model = "minecraft:redstone_lamp";
    
    mobSpawner.mobLocations = [
        { x:100.5, y:75, z:100.5, prefab: "clone1" },
        { x:110.5, y:75, z:100.5, prefab: "clone1" },
        { x:120.5, y:75, z:100.5, prefab: "clone2" },
        { x:130.5, y:75, z:100.5, prefab: "clone1" },
        { x:140.5, y:75, z:100.5, prefab: "clone2" },
        ];
        
}

function tick(e){
    mobSpawner.CheckDespawnMobs();
    mobSpawner.CheckNearbyPlayers();
}
```

5. See the `mobSpawner.mobSpawnerID` parameter? Every mobSpawner needs a unique ID, don't forget!
* NOTE: Spawners with the same `mobSpawnerID` will be treated as the same spawner.
* NOTE: You can place as many spawners as you want in the world, just give each of them a unique `mobSpawnerID`
* NOTE: Spawners also have a `hyperSpawnpointID`. This should be the same as the ID written in `HyperSpawnpoint12.js`

You can change the clone tab *(default is 1)* in `HyperMobSpawner12.js` under `mobSummonTab`

### Saving Mob Positions in Bulk
I know what you're thinking, isn't it a pain in the rear to write down the coordinates for every single mob? **Yes, it is.** Thankfully, we have a tool for that! *Drum roll please* Introducing the `SaveNearbyPositions2` tool. *Not a very catchy name...*

* **Tools/SaveNearbyPositions2**

Setup:
1. Load `SaveNearbyPositions2.js` on a scripted item.
* Mob positions & clone name as saved to your minecraft /world directory. From there you can open the txt file and copy the mob positions to your mob spawner. Magic!


## ACInstaller
All files stored in <world>/customnpcs/CONTENT/customnpcs will be automatically copied to the global folder <.minecraft>/customnpcs/

Example:
1. Add skins/sounds/etc... to your <.minecraft>/customnpcs/etc... folder
2. Copy <.minecraft>/customnpcs to your <world>/customnpcs/CONTENT folder (make the CONTENT folder if it does not exist)
3. Run `ACI.Install()` when a player joins your world

```js
ACI.Install();
ACI.IsInstalled();
ACI.Say(msg);
```

Example: Locks out players until they fully restarted Minecraft [required for sounds])
```js
// Requires: FUtil, ACInstaller
// Place this in a ScriptedBlock at spawn

var counter = 0;
var needsRestart = false;
var waitTime = 5;

function tick(e){
    if (needsRestart){
        if (counter % 5 == 0)
            ACI.Say("§6YOU MUST FULLY §f§lRESTART MINECRAFT§6 TO FINISH!");
        counter++;
        return;
    }
    else if (ACI.IsInstalled()){
        
        // The player restarted Minecraft -AND- they have the content installed!
        // Write your own "teleport outside of spawn" code here!!!
        // TODO - do someting!

        return;
    }

    if (counter >= waitTime){
        if (counter == waitTime){
            ACI.Install();
            if (!FUtil.IsDedicatedServer())
                needsRestart = true;
        }
    }
    counter++;
}
```

## FUtil
```js
FUtil.CopyDirectory(sourcePath, destPath);
FUtil.CopyFile(sourcePath, destPath);
FUtil.DeleteDirectory(folder);
FUtil.Exists(path);
FUtil.ExistsInDirectory(directoryPath, filename);
FUtil.IsExtension(filename, extension);
FUtil.ReadFile(filepath);
FUtil.Encrypt(string);
FUtil.Decrypt(stringBase64);
FUtil.UnzipDirectory(zipPath, destFolderPath);
FUtil.Unzip(zipPath);
FUtil.IsDedicatedServer();
```
**Resource Methods**  »  Images, mp4 files, etc... must be placed in `<world_name>/customnpcs/`
```js
FUtil.OpenImageFullscreen(filename, labelText, scaleW, ScaleH);
FUtil.OpenImageNewWindow(filename, labelText, width, height);
FUtil.PlayVideoSingleplayer_WindowsOnly(filename);
FUtil.RunExecutable(filename);
FUtil.CopyToDesktop(filename);
```
**Examples**
```js
// Copy current world to .minecraft and name it "Example World"
function init(e){
  var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
  FUtil.CopyDirectory(API.getWorldDir().getParent(), API.getGlobalDir().getParent()+"/Example World");
}
```
```js
// Show image on screen | The image path is <world_name>/customnpcs/image.png
function init(e){
  FUtil.OpenImageFullscreen("test.png", "Test", 16, 9);
}
```
```js
// Copy image from <world_name>/customnpcs/wow_this_map_so_meta.png to desktop
function init(e){
  FUtil.CopyToDesktop("wow_this_map_so_meta.png");
}
```

## StandardUtil12
A set of useful library functions for use in 1.12/1.16. Many of my scripts require this file to be loaded. To use simply write `Utilities.` from anywhere npc/player/block/etc. A vector `v` can be anything with the following data structure: `{ x:0, y:0, z:0 }`. That includes custom data structures as well as literally just passing in npc, player, entity, etc.
### Vector Math
```js
Utilities.Add(v1, v2);
Utilities.Diff(v1, v2);
Utilities.Dot(v1, v2);
Utilities.Cross(v1, v2);
Utilities.Mult(v, integer);
Utilities.Angle(z, x);
Utilities.ToDegrees(angle);
Utilities.ToRadians(degrees);
Utilities.IsBetween(v, v1, v2);
Utilities.Zero();
Utilities.Normalize(v);
Utilities.Magnitude(v);
Utilities.GetDistance(source, target); // inputs can be an ENTITY or a VECTOR
Utilities.GetDistance2D(source, target); // (x/z axis only)
Utilities.RotateAboutX(v, degrees);
Utilities.RotateAboutY(v, degrees);
Utilities.RotateAboutZ(v, degrees);
Utilities.GetForward(entity); // 3D
Utilities.GetEntityForwardVector(entity); // 2D
Utilities.GetDirectionTowardsTarget(source, target); // inputs can be an ENTITY or a VECTOR

Utilities.FaceRotation(entity, vec);
Utilities.CanAnyoneSeeMe(npc, range); // [1.16 ONLY]
Utilities.IsTargetWatchingMe(entity, target, viewAngle, maxDistance);
Utilities.GetSafeLocationNearEntity(entity, rMin, rMax);
Utilities.IsEnemyNearby(player, range);
Utilities.IsTeleportPosSafe(world, v); // avoid walls
Utilities.GetRandomRadius(min, max); // returns random positive/negative number
Utilities.SortNumeric(ar);
Utilities.Clamp(num, min, max);
Utilities.IndexOfNth(str, char, index)
```
### Item-Related
```js
Utilities.RemoveItems(player, itemID, numToRemove);
Utilities.GetEntityTags(entityItem); // returns a tagObj for use in HasTag()
Utilities.GetItemTags(itemStack); // returns a tagObj for use in HasTag()
Utilities.HasTag(tagObj, tagName);
Utilities.IsWearingFullSet(player, tag);
Utilities.IsWearing(player, slot, tag); // Slot - 0:boots, 1:pants, 2:body, 3:head
```
### Audio-Related
Does not use/require AudioJ2CK, but can be used in conjunction with it.
```js
Utilities.PlayAt(x, y, z, soundName);
Utilities.Play(entity, soundName); // can be an NPC (will play nearby) or a player (will only play to them)
Utilities.Stop(entity, soundName);
```

## DOCUMENTATION 1.7.10

### AudioJ7CK 
Place WAV files in <.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds

1. Load script in the Init event area of your object (npc, block, or player)
2. Use only one of the following commands:  
* `npc.getTempData("audio").Play("wavFileName");` from anywhere.
* `Audio.Play("wavFileName");` from Init event area ONLY.

*NOTE: Adjust Volume:* `Play("wavFileName", audioGain)`  
*NOTE: remaining functions written at top of AudioJ7CK.js*

### StandardUtil [1.7.10 Version]
```js
Utilities.AddVectors(v1, v2);
Utilities.Angle(z, x);
Utilities.Normalize(vec, newMagnitude); // just give 1 as newMagnitude
Utilities.RotateAboutY(v, degrees);
Utilities.GetDistance(source, target); // inputs can be an ENTITY or a VECTOR
Utilities.GetDirectionTowardsTarget(source, target); // inputs can be an ENTITY or a VECTOR
Utilities.GetRandomRadius(min, max); // returns random positive/negative number
Utilities.GetSafeLocationNearEntity(entity, rMin, rMax);
Utilities.IsTeleportPosSafe(world, v); // avoid walls
Utilities.PlaySound(soundName, entity); // can be an NPC (will play nearby) or a player (will only play to them)

// Harms the given entity with "fake instant harming"
// (ALWAYS) Avoids 1.7.10 Crash: "Applying potion effect when entity dies throws a Concurrent Modification Exception"
Utilities.Harm(entity, potency); 

// HACK: (Usually) Avoids a crash caused by applying a potion effect when an npc dies
Utilities.Effect(entity, effect, duration, strength);
```
