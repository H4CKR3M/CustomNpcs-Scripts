# CustomNpcs-Scripts
Scripts for Audio / Utilities / Trinkets / CombatCircle &amp; more

**LICENSE**: Permission to modify/redistribute scripts as a part of your map only.  
If you can, please link this github page in your map credits.

##-------------------------------- DOCUMENTATION --------------------------------

###==== AudioJ2CK ====
Place WAV files in .minecraft/customnpcs/assets/customnpcs/sounds/audiojack

1. Call Audio.Init(e); in the init(e) of your npc/block/player  
2. Don't forget to call Audio.Logout(e); in your playerscript logout event.  
3. Call any of the below:  

```
Audio.Play("wavFileName");  
Audio.Loop("wavFileName");  
Audio.Stop("wavFileName");  
```

*NOTE: remaining functions written at top of AudioJ2CK.js*

* **DO NOT WRITE** Audio.P.XXX (The P stands for private).




##----------------------------- DOCUMENTATION 1.7.10 ----------------------------

###==== AudioJ7CK ====
Place WAV files in .minecraft/customnpcs/assets/customnpcs/sounds

1. Load script in the Init event area  
2. Use only one of the following commands:  
* ```npc.getTempData("audio").Play("wavFileName");``` from anywhere on the npc/block/player  
* ```Audio.Play("wavFileName");``` from Init event area ONLY  
 
*NOTE: remaining functions written at top of AudioJ2CK.js*

