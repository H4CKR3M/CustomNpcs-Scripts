# CustomNpcs-Scripts
Advanced Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

## Table of Contents
1. **JTunes** - Fully Fledged Background music using AudioJ2CK
2. **AudioJ2CK** - 2D Audio / No Input Lag
3. **ACInstaller** - Adventure Map automatically installs map content/resources/skins/sounds
4. **FUtil** - File System Editing
5. **StandardUtil12** - Vector Math at Your Fingertips
6. Legacy 1.7.10 Ports

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
