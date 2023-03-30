# CustomNpcs-Scripts
Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

## -------------------------------- DOCUMENTATION --------------------------------

### ==== AudioJ2CK ====
Place WAV files in .minecraft/customnpcs/assets/customnpcs/sounds/audiojack

1. Load script anywhere (npc, block, or player)
2. Call `Audio.Init(e);` inside the init(e) event of your object
3. Don't forget to call `Audio.Logout(e);` in your playerscript logout event.  
4. Call any of the below:  

```
Audio.Play("wavFileName");  
Audio.Loop("wavFileName");  
Audio.Stop("wavFileName");  
```

*NOTE: remaining functions written at top of AudioJ2CK.js*

* **DO NOT WRITE** Audio.P.XXX (The P stands for private).




## ----------------------------- DOCUMENTATION 1.7.10 ----------------------------

### ==== AudioJ7CK ====
Place WAV files in .minecraft/customnpcs/assets/customnpcs/sounds

1. Load script in the Init event area of your object (npc, block, or player)
2. Use only one of the following commands:  
* ```npc.getTempData("audio").Play("wavFileName");``` from anywhere.
* ```Audio.Play("wavFileName");``` from Init event area ONLY.
 
*NOTE: remaining functions written at top of AudioJ2CK.js*

