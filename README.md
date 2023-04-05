# CustomNpcs-Scripts
Advanced Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

## DOCUMENTATION

### AudioJ2CK
Place WAV files in <.minecraft/SERVER_Root>/customnpcs/assets/customnpcs/sounds/audiojack

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

### FUtil
```js
FUtil.CopyDirectory(sourcePath, destPath);
FUtil.CopyFile(sourcePath, destPath);
FUtil.DeleteDirectory(folder);
FUtil.Exists(path);
FUtil.ExistsInDirectory(directoryPath, filename);
FUtil.IsExtension(filename, extension);
```
Visual Novel-Related Methods
```js
FUtil.OpenImageFullscreen(filename, labelText, scaleW, ScaleH);
FUtil.OpenImageNewWindow(filename, labelText, width, height);
FUtil.PlayVideoSingleplayer_WindowsOnly(filename);
```
```js
FUtil.Encrypt(string);
FUtil.Decrypt(stringBase64);
FUtil.UnzipDirectory(zipPath, destFolderPath);
FUtil.Unzip(zipPath);
FUtil.IsDedicatedServer();
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
