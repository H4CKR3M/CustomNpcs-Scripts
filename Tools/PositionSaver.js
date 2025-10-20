/* v3.0 - PositionSaver Tool | ItemScript | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Right-Click to save a json of nearby mob positions to world data
 * 
 * LOAD AUTOMATICALLY - Requires: HyperMobSpawner12
 */

var Config = {
    bannedTitles: [ "persist" ],
    bannedTags: [],
    yConstraints: { min: 0, max: 255 },
    range: 40,
    despawn: true,

    removeSpaces: false, 
}

var spawnerVersion = 0;

function init(e){
    e.item.setCustomName("§6Save Nearby Mob Positions §e[§4§l?§e]");
    e.item.setLore(GetLore(e));
    e.item.setTexture(293, "minecraft:diamond_hoe");
    e.item.setItemDamage(293);
    e.item.setDurabilityShow(false);
    e.item.setMaxStackSize(1);

    TryLoad("HyperMobSpawner12.js");

    // Determine Mob Spawner Version
    try {
        var dummy_oldVersion = HyperMobSpawner.mobSpawner.summonID;
        spawnerVersion = 1;
    } 
    catch (ex) {}
    if (spawnerVersion == 0){
        try {
            // @ts-ignore
            var dummy_newishVersionButStillOld = HyperMobSpawn.GetSummonID();
            spawnerVersion = 3;
        } catch (ex) {
            spawnerVersion = 2;
        }
    }

    // Adjust Settings based on mob spawner version
    switch(spawnerVersion){
        case 1:
            Config.legacyMode = true;
            HyperMobSpawn.GetSummonID = function () { return HyperMobSpawner.mobSpawner.summonID; }
            break;
        case 2:
            HyperMobSpawn.GetSummonID = function () { return HyperMobSpawn.P.summonID; }
            break;
        case 3:
            // @ts-ignore
            HyperMobSpawn.INTERNAL_Tick = function () { }; // <--- Erase the Auto-Hook
            break;
    }

    e.item.setCustomName("§6Save Nearby Mob Positions §e[§3§l" + spawnerVersion + "§e]");
}

function interact(e){

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

function TryLoad(filename) {
    var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
    var source = new java.io.File(API.getWorldDir() + "/scripts/ecmascript");
    if (!source.exists()) {
        source.mkdir();
        return false;
    }
    if (source.isDirectory()) {
        var listFile = source.listFiles();
        for (var i = 0; i < listFile.length; i++) {
            var f = listFile[i];
            if (!f.isDirectory() && f.getName() == filename) {
                try {
                    load(f);
                    return true;
                } catch (ex) {
                    ex.printStackTrace(java.lang.System.out);
                    break;
                }
            }
        }
    }
    return false;
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
    return npc.hasTag(HyperMobSpawn.GetSummonID());
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
