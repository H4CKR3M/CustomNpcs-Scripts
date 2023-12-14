/* v2.2 - PositionSaver Tool | ItemScript | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Right-Click to save a json of nearby mob positions to world data
 * 
 * LOAD AUTOMATICALLY - Requires: FUtil, HyperMobSpawner12
 */

var Config = {
    bannedTitles: [ "persist" ],
    bannedTags: [],
    yConstraints: { min: 0, max: 255 },
    range: 80,
    despawn: true,

    // NOT RECOMMENDED
    removeSpaces: false, 
    legacyMode: false
}

function init(e){
    e.item.setCustomName("§6§lSave Nearby Mob Positions §e[§3§l2§e]");
    e.item.setLore(GetLore(e));
    e.item.setTexture(293, "minecraft:diamond_hoe");
    e.item.setItemDamage(293);
    e.item.setDurabilityShow(false);
    e.item.setMaxStackSize(1);

    // Auto-Load Libraries
    if (typeof FUtil === 'undefined')
        TryLoad(e, "FUtil.js");
    if (Config.legacyMode)
        if (typeof HyperMobSpawner === 'undefined')
            TryLoad(e, "HyperMobSpawner12.js");
    else if (typeof HyperMobSpawn === 'undefined')
        TryLoad(e, "HyperMobSpawner12.js");
}

function interact(e){

    if (!Config.legacyMode && typeof HyperMobSpawn === 'undefined' && typeof HyperMobSpawner !== 'undefined'){
        e.API.getIWorlds()[0].broadcast("§4§lERROR §cLEGACY MODE was disabled, but you are clearly using an old version of HyperMobSpawner!!!!");
        e.API.getIWorlds()[0].broadcast("§7Recommended: Please enable §3Config.legacyMode§7 on this tool");
        return;
    }

    var ne = e.player.world.getNearbyEntities(e.player.getPos(), Config.range, 2);
    if (ne.length > 0){

        var data = Config.legacyMode ? "mobSpawner.mobLocations = [\n" : "HyperMobSpawn.clones = [\n";
        
        var numSaved = 0;
        for(var i = 0; i < ne.length; i++){
            if (ne[i].y > Config.yConstraints.min && ne[i].y < Config.yConstraints.max && !HasInvalidTitle(ne[i]) && !HasInvalidTag(ne[i])){
                numSaved++;
                var newLoc = Config.removeSpaces ? 
                    "{ x:" + ne[i].getX() + ", y:" + ne[i].getY() + ", z:" + ne[i].getZ() + ", prefab: \"" + GetStringWithoutSpaces(ne[i].getName()) + "\" },\n"
                    : "{ x:" + ne[i].getX() + ", y:" + ne[i].getY() + ", z:" + ne[i].getZ() + ", prefab: \"" + ne[i].getName() + "\" },\n";
                data += newLoc;
                if (Config.despawn){
                    ne[i].despawn();
                }
            }
        }
        data += "];";
        if (numSaved > 0){
            var fileName = WriteFile(e, e.player, data);
            e.API.getIWorlds()[0].broadcast("§2§lSaved positions for §6§l" + numSaved + "§2§l NPCs! §7" + fileName);
        }
        else{
            e.API.getIWorlds()[0].broadcast("§e[§6§l!§e]§e§l Saved §6§l0§e§l Nearby Mobs » Found §6§l0§e§l Valid NPCs");
            e.API.getIWorlds()[0].broadcast("§e[§6§l!§e]§8§o THIS IS NOT AN ERROR");
            e.API.getIWorlds()[0].broadcast("§7 » Outside yConstrant Range §3[§b§l" + Config.yConstraints.min + " §7- §b§l" + Config.yConstraints.max + "§3]");
            if (Config.bannedTitles.length > 0) e.API.getIWorlds()[0].broadcast("§7 » Has banned titles " + Config.bannedTitles);
            if (Config.bannedTags.length > 0) e.API.getIWorlds()[0].broadcast("§7 » Has banned tags " + Config.bannedTags);
            e.API.getIWorlds()[0].broadcast("§7 » Spawned from HyperMobSpawner");
        }
    }
    else{
        e.API.getIWorlds()[0].broadcast("§e[§6§l!§e]§e§l Saved §6§l0§e§l Nearby Mobs » Found No Nearby NPCs");
    }
}

function GetLore(e){
    var loreString = [ 
        "§e[§9Right-Click§e] §7» Saves Nearby NPC Positions~",
        "§8<world>/Pos_0000.txt",
        "§7",
        "§e[§9Ignore§e]",
        "§7» Mobs Spawned From HyperMobSpawners",
        
    ];
    var titleStr = "";
    for(var i = 0; i < Config.bannedTitles.length; i++){
        titleStr += "§3[§b" + Config.bannedTitles[i] + "§3] ";
    }
    if (titleStr != ""){
        loreString.push("§7» Banned Titles: " + titleStr);
    }

    loreString.push("§7");
    loreString.push("§7 Radius §3[§b§l" + Config.range + "§3]");
    loreString.push("§eY§7Range §3[§b§l" + Config.yConstraints.min + " §7- §b§l" + Config.yConstraints.max + "§3]");
    loreString.push("§7Remove Spaces §3[§b§l" + Config.removeSpaces + "§3]");
    if (Config.legacyMode){
        loreString.push("§6[§eLEGACY MODE ENABLED§6]");
    }
    if (Config.despawn){
        loreString.push("§4[§cDESPAWN MODE ENABLED§4]");
    }

    return loreString;
}

function TryLoad(e, fileName){
    var success = false;
    var source = new java.io.File(e.API.getWorldDir() + "/scripts/ecmascript");
    if (!source.exists()) {
        source.mkdir();
        return false;
    }
    if (source.isDirectory()) {
        var listFile = source.listFiles();
        for(var i = 0; i < listFile.length; i++){
            var f = listFile[i];
            if (!f.isDirectory() && f.getName() == fileName){
                try {
                    load(f); 
                    success = true;
                } catch (ex) {
                    ex.printStackTrace(java.lang.System.out);
                    break;
                }
            }
        }
    }
    if (!success){
        e.API.getIWorlds()[0].broadcast("§4§lERROR §cCould not initialize §3SNMP-2");
        e.API.getIWorlds()[0].broadcast("§7" + fileName + " not found in <world>/customnpcs/scripts/ecmascript/");
    }
}

function GetStringWithoutSpaces(string){
    return string.replace(/\s/g, '');
}

function HasInvalidTag(npc){
    for(var i = 0; i < Config.bannedTags.length; i++){
        if (Config.bannedTags[i] != "" && npc.hasTag(Config.bannedTags[i])){
            return true;
        }
    }
    return npc.hasTag(Config.legacyMode ? HyperMobSpawner.mobSpawner.summonID : HyperMobSpawn.P.summonID);
}

function HasInvalidTitle(npc){
    for(var i = 0; i < Config.bannedTitles.length; i++){
        if (Config.bannedTitles[i] != "" && npc.getDisplay().getTitle().toLowerCase() == Config.bannedTitles[i].toLowerCase()){
            return true;
        }
    }
    return false;
}

function WriteFile(e, player, data){
    var map = new java.io.File(e.API.getWorldDir().getParent());
    var newTime = java.time.LocalTime.now().getMinute()*60 + java.time.LocalTime.now().getSecond();
    var fileName = "Pos_" + newTime + "_" + player.getDisplayName() + ".txt";
    var f = new java.io.File(map.toPath() + "/" + fileName);
    try {
        
        var source = new java.io.File(map.toPath());
        if (!source.exists()) {
            source.mkdirs();
        }
        if(!f.exists()){
            f.createNewFile();
        }
        
        var pw = new java.io.PrintWriter(f);
        pw.println(data);
    } catch (ex) {
        ex.printStackTrace();
    } finally {
        pw.close();
    }
    return fileName;
}