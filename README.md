# CustomNpcs-Scripts
Advanced Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

## Table of Contents
1. **JTunes**     - Fully Fledged Background music using AudioJ2CK
2. **AudioJ2CK**  - 2D Audio / No Input Lag
3. **FUtil**      - File System Editing
4. Legacy 1.7.10 Ports

## JTunes
Place WAV files in `<.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds/audiojack`

Audio player utilizing the power of AudioJ2CK to play seamless background/boss music. Anywhere!

1. Load in PlayerScript
2. Call `JTunes.Login(e);` and `JTunes.Tick(e);` - in player login/tick respectively
3. Edit Songs/Triggers in JTunes.js

### Boss Music

Start / Stop Boss music using world Tempdata
Starting boss music automatically stops the background music and resumed when boss music stops
```js
world.getTempdata().put("JBOSS", "my_song_name);
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

## FUtil
```js
FUtil.CopyDirectory(sourcePath, destPath);
FUtil.CopyFile(sourcePath, destPath);
FUtil.DeleteDirectory(folder);
FUtil.Exists(path);
FUtil.ExistsInDirectory(directoryPath, filename);
FUtil.IsExtension(filename, extension);
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

## DOCUMENTATION 1.7.10

### AudioJ7CK 
Place WAV files in <.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds

1. Load script in the Init event area of your object (npc, block, or player)
2. Use only one of the following commands:  
* `npc.getTempData("audio").Play("wavFileName");` from anywhere.
* `Audio.Play("wavFileName");` from Init event area ONLY.

*NOTE: Adjust Volume:* `Play("wavFileName", audioGain)`  
*NOTE: remaining functions written at top of AudioJ7CK.js*
