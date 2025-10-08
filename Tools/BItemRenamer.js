/* v6.0 - Better Item Renamer | ItemScript | Minecraft 1.12.2 (05Jul20) | Written by Rimscar
 * Requires: StandardUtil12, DigitalTrinkets12 [2.0+]
 *
 * Supports BItemRenamer config versions [1.4 -> 6.0+]
 * 
 * Right-Click Use, Left-Click Change Mode
 */

var BItemRenamer = (function(){
    return {

        Init: function Init(e, OPTIONAL_config){ BItemRenamer.P.Init(e, OPTIONAL_config); },
        Interact: function Interact(e){ BItemRenamer.P.Interact(e); },
        Attack: function Attack(e){ BItemRenamer.P.Attack(e); },
        GetGroupIDs: function GetGroupIDs(){ return this.P.validGroupIDs; },
        GetConfigSlot: function GetConfigSlot() { return this.P.config.slot.toUpperCase(); },

        /* (OPTIONAL) CUSTOM EVENT: OnInit() <---- Name a function OnReset and it will be called after BItemRename.init */
        /* (OPTIONAL) CUSTOM EVENT: OnInteract() <---- Name a function OnTargetFound and it will be called after BItemRename.interact */
        /* (OPTIONAL) CUSTOM EVENT: OnAttack() <---- Name a function OnTargetFound and it will be called after BItemRename.attack */

        P: {
            /* Set to "" if you don't want a custom theme - Custom Themes are located at the bottom of this file */
            theme: "", // MONOSPACE_ANALOG_2

            /* MAP CONFIG */
            sayCreateCommandInChat: false,
            debugDigitizer: false,
            hideWarnings: false,
            legacy_hideAttackSpeed: false,
            legacy_convertOldItems: false,

            /* These should be consistant across all the maps you make (not just the current one) */
            validGroupIDs: [ 
                // TRINKETS / WEAPONS
                "METALWEAPON", "ARCLENS", "TROPIC3", "ICE2", "MW", "MW5", "DGWS", "LITC", "SEAOFDIE", "SEAOFDYE", "ONGARDE",

                // OTHER
                "TELEPORTER", "MAINHAND1",

                // ORBS
                "TROPICORB", "CROWORB", "ICEORB",

                // GADGETS
                "MW5Gadget",

                // DEPRECATED
                "METALWEAPONO", "ARMOR1",

                // Online-Related
                "DAILY", "ACHIEVEMENT", "DLC"
             ],

            /* Item Types - Suffix appended to the first line of the lore description (if config has matching tagItemType) */
            itemTypes: [
                { TAG: "TRINKET", LORE: " §c[Trinket]" },
                { TAG: "ORB", LORE: " §b[Orb]" },
                { TAG: "LENS", LORE: " §e[Lens]" },
                { TAG: "CONSUMABLE", LORE: " §e[Consumable]" },
                { TAG: "ARMOR", LORE: "" },
                
                { TAG: "OUTFIT", LORE: " §f[§5Outfit§f]" },
                { TAG: "GIFT", LORE: " §f[§eGift§f]" },
                { TAG: "CARD", LORE: " §8[§fCard§8]" },
                { TAG: "LIGHTKNIFE", LORE: " §b[§fLight Knife§b]" },
                { TAG: "KNIFE", LORE: " §f[§eKnife§f]" },
                { TAG: "SWORD", LORE: " §f[§7Sword§f]" },
                { TAG: "AXE", LORE: " §7[§8Axe§7]" },
                { TAG: "GREATBLADE", LORE: " §7[§4Greatblade§7]" },
                { TAG: "BOW", LORE: " §8[§2Bow§8]" },
                { TAG: "LANCE", LORE: " §8[§3Lance§8]" },
                { TAG: "WAND", LORE: " §d[§5Wand§d]" },
            ],

/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------- DO NOT TOUCH ------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */

            config: null,
            libKey: "BIR_lib",
            version: 6,

            /* The SCRIPTED and an (OFFHAND or MAINHAND) tag is REQUIRED for use with Better Trinkets */
            tagScripted: "SCRIPTED",
            tagSlotNames: [ "MAINHAND", "OFFHAND", "FEET", "LEGS", "CHEST", "HEAD", "INVENTORY" ],

            Init: function Init(e, OPTIONAL_config){
                e.item.setDurabilityShow(false);
                e.item.setMaxStackSize(1);

                // Use Given config [Legacy] or just get it automatically
                if (OPTIONAL_config != null){
                    this.config = OPTIONAL_config;
                }
                else{
                    if (typeof config == 'undefined'){

                        // LEGACY SUPPORT [v1.X]
                        if (typeof Config == 'undefined')
                            throw("\n\nMissing a config\nDid you forget to write var config = {} on your scripted item???\n\n");
                        else
                            this.config = Config;
                    }
                    else
                        this.config = config;
                }

                // HACK: We can't grab e.player from init
                var world = e.API.getIWorlds()[0];

                var libraries = typeof Utilities != 'undefined' && typeof DigitalTrinkets12 != 'undefined';

                // This is an item script. Efficiency doesn't matter. Just try loading them automatically.
                if (!libraries){
                    this.TryLoad("StandardUtil12.js");
                    this.TryLoad("FUtil.js");
                    this.TryLoad("DigitalTrinkets12.js");
                }

                this.VerifyConfigIntegrity(this.config);
                
                // Did the load work?
                libraries = typeof Utilities != 'undefined' && typeof DigitalTrinkets12 != 'undefined';

                // Run without Required Libraries
                if (!libraries){
                    if (!world.getTempdata().has(this.libKey))
                        world.getTempdata().put(this.libKey, 0);
                }

                // Name the item for the first time (or if player decides to /rename [THE RENAMER TOOL] for god knows what reason)
                var mode = "r";
                switch(this.GetMode(e)){
                    case "r":
                    case "a":
                    case "d":
                    case "da":
                    case "cn":
                    case "cl":
                        mode = this.GetMode(e);
                        break;
                } 
                
                this.OnSwapMode(e, mode);

                if (typeof OnInit === "function"){
                    OnInit();
                }
            },

            TryLoad: function TryLoad(fileName){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var source = new java.io.File(API.getWorldDir() + "/scripts/ecmascript");
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
                            } catch (ex) {
                                ex.printStackTrace(java.lang.System.out);
                                break;
                            }
                        }
                    }
                }
            },

            Interact: function Interact(e){
                switch(this.GetMode(e)){
                    case "r":
                        this.RenameOffhandItem(e);
                        break;
                    case "a":
                        this.Apply(e);
                        break;
                    case "d":
                        this.Digitize(e, e.player.getOffhandItem(), DigitalTrinkets12.GetDataKey(), this.debugDigitizer);
                        break;
                    case "da":
                        this.DigitizeAll(e);
                        break;
                    case "cn":
                        this.CreateNew(e);
                        break;
                    case "cl":
                        this.CreateFromDigitized(e);
                        break;
                } 

                if (typeof OnInteract === "function"){
                    OnInteract();
                }
            },

            Attack: function Attack(e){

                // Run without Required Libraries
                var libraries = typeof Utilities != 'undefined' && typeof DigitalTrinkets12 != 'undefined';
                if (!libraries){
                    var newMode = this.GetMode(e) == "r" ? "cn" : "r";

                    var time = new Date().getTime();
                    if (300*1000 + e.player.world.getTempdata().get(this.libKey)-time <= 0){
                        this.Message(e, "w", "§6§lMissing required libraries.");
                        if (typeof Utilities === 'undefined')
                            this.Message(e, "w", "You forgot to include the StandardUtil12 script");
                        if (typeof DigitalTrinkets12 === 'undefined')
                            this.Message(e, "w", "You forgot to include the DigitalTrinkets12 script");
                        this.Message(e, "w", "Only §aRename §eand §6Create New §eare enabled!");
                        if (this.GetMode(e) == "r")
                            this.Message(e, "w", "...");
                        e.player.world.getTempdata().put(this.libKey, time);
                    }
                    this.OnSwapMode(e, newMode);
                    return;
                }

                var newMode = "";
                switch(this.GetMode(e)){
                    case "r": newMode = "a"; break;
                    case "a": newMode = "d"; break;
                    case "d": newMode = "da"; break;
                    case "da": newMode = "cn"; break;
                    case "cn": newMode = "cl"; break;
                    case "cl": newMode = "r"; break;
                } 
                if (newMode == ""){
                    this.Error(e, "Mode was \"\" Empty... idk how! See BItemRenamer.P.Attack() method")
                }
                this.OnSwapMode(e, newMode);

                if (typeof OnAttack === "function"){
                    OnAttack();
                }
            },

            OnSwapMode: function OnSwapMode(e, mode){
                switch(mode){
                    case "r":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §aItem Renamer: " + this.config.name.replaceAll('&', '§'));
                        e.item.setTexture(2257, "minecraft:record_cat");
                        e.item.setItemDamage(2257);
                        break;
                    case "a":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §fLore Applicator");
                        e.item.setTexture(2264, "minecraft:record_strad");
                        e.item.setItemDamage(2264);
                        break;
                    case "d":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §3Digitizer");
                        e.item.setTexture(2267, "minecraft:record_wait");
                        e.item.setItemDamage(2267);
                        break;
                    case "da":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §5§lFull Inventory Digitizer");
                        e.item.setTexture(2261, "minecraft:record_mall");
                        e.item.setItemDamage(2261);
                        break;
                    case "cn":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §6New Trinket Creator [§7" + this.config.name.replaceAll('&', '§') + "§6]");
                        e.item.setTexture(2256, "minecraft:record_13");
                        e.item.setItemDamage(2256);
                        break;
                    case "cl":
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §c§lCreate Trinket From §3§lDigitized");
                        e.item.setTexture(2259, "minecraft:record_chirp");
                        e.item.setItemDamage(2259);
                        break;
                } 
            },

            RenameOffhandItem: function RenameOffhandItem(e){
                var offhand = e.player.getOffhandItem();
                if (offhand != null && offhand.getName() != "minecraft:air"){
                    this.Message(e, "r", "Renamed off hand item: " + this.config.name.replaceAll('&', '§'));
                    
                    offhand.setCustomName(this.ThematicMan.GetName(this.config.name.replaceAll('&', '§')));
                    
                    for(var i = 0; i < this.config.lore.length; i++)
                        this.config.lore[i] = this.config.lore[i].replaceAll('&', '§');
                    offhand.setLore(this.config.lore);
                }
                else
                    this.Message(e, "e", "Umm... shouldn't you like, put something in your off hand first?");
            },

            Apply: function Apply(e){
                if (!e.player.getWorld().getTempdata().has(DigitalTrinkets12.GetDataKey()) && this.config.digitizedTrinketOverride == ""){
                    this.Message(e, "e", "No Digitized Trinket in memory, store a trinket using the Digitizer!");
                    return;
                }
            
                var offhand = e.player.getOffhandItem();
                if (offhand != null && offhand.getName() != "minecraft:air"){
                    var digitizedString = e.player.getWorld().getTempdata().has(DigitalTrinkets12.GetDataKey()) && this.config.digitizedTrinketOverride == "" ? e.player.getWorld().getTempdata().get(DigitalTrinkets12.GetDataKey()) : this.config.digitizedTrinketOverride;
                    var digitizedArray = digitizedString.split(DigitalTrinkets12.GetDelimiter());
                    var newName = digitizedArray[0];
                    var newLore = [];
            
                    for(var i = 1; i < digitizedArray.length; i++){
                        var digitizedLine = digitizedArray[i];
                        if (digitizedLine[0] == 1){
                            newLore.push(digitizedLine.substring(1, digitizedLine.length));
                        }
                    }
            
                    offhand.setCustomName(newName);
                    offhand.setLore(newLore);
            
                    this.Message(e, "a", "Renamed off hand item: " + newName);
                }
                else
                    this.Message(e, "e", "Put something in your off hand!");
            },

            Digitize: function Digitize(e, itemStack, storedDataKey, showDebugger){
                if (itemStack != null && itemStack.getName() != "minecraft:air"){
                    this.Message(e, "d", "Digitized: " + itemStack.getDisplayName());
                    DigitalTrinkets12.DigitizeDebug(itemStack, storedDataKey, showDebugger);
                }
                else
                    this.Message(e, "e", "Put something in your off hand!");
            },

            DigitizeAll: function DigitizeAll(e){
                if (this.config.tagItemType == "")
                    this.Message(e, "da", "Digitizing all items regardless of tag...");
                else
                    this.Message(e, "da", "Digitizing all items with " + this.config.tagItemType + " tag...");

                var inventoryItems = e.player.getInventory().getItems();
                var count = 0;
                for(var i = 0; i < inventoryItems.length; i++){
                    var item = inventoryItems[i];
                    var tagObj = Utilities.GetItemTags(item);
                    var hasValidTag = this.config.tagItemType == "" ? item.getName() != "minecraft:air" : tagObj != null && Utilities.HasTag(tagObj, this.config.tagItemType);
                    if (hasValidTag){
                        var isAnItemRenamer = item.getName() == "customnpcs:scripted_item" && item.getDisplayName().length > 11
                            && item.getDisplayName()[0].charCodeAt(0) == 167 && item.getDisplayName()[1].charCodeAt(0) == 98
                            && item.getDisplayName()[2].charCodeAt(0) == 91 && item.getDisplayName()[3].charCodeAt(0) == 167
                            && item.getDisplayName()[4].charCodeAt(0) == 51 && item.getDisplayName()[8].charCodeAt(0) == 167
                            && item.getDisplayName()[9].charCodeAt(0) == 98 && item.getDisplayName()[10].charCodeAt(0) == 93
                            && item.getDisplayName()[11].charCodeAt(0) == 32;
                        if (!isAnItemRenamer && this.IsValidItem(item)){
                            count++;
                            this.Digitize(e, item, DigitalTrinkets12.GetDataKey() + i, false);
                        }
                    }
                }
                if (this.config.tagItemType == "")
                    this.Message(e, "da", "Finished Digitizing " + count + " items.");
                else
                    this.Message(e, "da", "Finished Digitizing " + count + " " + this.config.tagItemType + ".");
            },

            IsValidItem: function IsValidItem(itemStack){
                for(var i = 0; i < this._invalidItems.length; i++){
                    if (itemStack.getName() == this._invalidItems[i])
                        return false;
                }
                return true;
            },
            _invalidItems: [ "customnpcs:npcscripter", "customnpcs:npcwand", "customnpcs:npcmobcloner", 
                "customnpcs:npcsoulstoneempty" ],

            CreateNew: function CreateNew(e){
                if (e.player.getInventory().getSlot(8) == e.item){
                    this.Message(e, "e", "Hey! What do you think you're doing? This Item doesn't work in hotbar slot nine!");
                    return;
                }
                var tagString = "";
                var dmgValue = this.config.dmgValue;
                var hideFlagsTag = 0;

                // User Error on item name
                try { e.player.world.createItem(this.config.ID, 1, 1); }
                catch(err){
                    this.Error(e, "Unknown Item with ID: " + this.config.ID + " ! \nMaybe you misspelled it? \n\nOr if this is MC 1.16+, change createItem(string, int, int) to createItem(string, int)");
                }
            
                // Rarity Tag + Lore
                var rarityTag = "";
                var firstLineLore = "";
                var itemTypeLore = "";
                for(var i = 0; i < this.itemTypes.length; i++){
                    if (this.config.tagItemType == this.itemTypes[i].TAG && this.itemTypes[i].LORE != ""){
                        itemTypeLore = this.ThematicMan.GetItemTypeLore(this.itemTypes[i]);
                        break;
                    }
                }
                
                var hasRarity = this.config.rarity != '' && this.config.rarity != ' ';
                if (hasRarity){
                    switch(this.config.rarity.toUpperCase()){
                        case 'C':
                            rarityTag = "COMMON";
                            break;
                        case 'U':
                            rarityTag = "UNCOMMON";
                            break;
                        case 'R':
                            rarityTag = "RARE";
                            break;
                        case 'L':
                            rarityTag = "LEGENDARY";
                            break
                        case 'E':
                            rarityTag = "EXOTIC";
                            break;
                        default:
                            this.Error(e, "Invalid Rarity! Rarity must be C, U, R, L, or E\nGod, were you born yesterday? It's not that hard!");
                    }
                    firstLineLore = this.ThematicMan.GetRarityLore(this.config.rarity.toUpperCase(), itemTypeLore);
                }
                else if (this.config.tagItemType != "" && this.config.tagItemType != "ARMOR") {
                    this.Error(e, "Hey dumbass! \nYou can't leave the Rarity blank if you're using the " + this.config.tagItemType + " item type.\n\nEither Change the Config.tagItemType to ' ' empty or add a rarity value. Rarity values must be either C, U, R, L, or E");
                }

                var atLeastOneItemType = false;
                for(var i = 0; i < this.itemTypes.length; i++){
                    if (this.config.tagItemType == this.itemTypes[i].TAG){
                        atLeastOneItemType = true;
                    }
                }
                if (!atLeastOneItemType && this.config.tagItemType != ""){
                    var allItemTypes = "§7";
                    for (var i = 0; i < this.itemTypes.length; i++) {
                        allItemTypes += this.itemTypes[i].TAG + "§6, §7";
                    }
                    this.Error(e, "Alright, pal. What kind of tagItemType is '" + this.config.tagItemType + "'?\nSounds like you made it up! Either leave tagItemType blank or give me a real one."
                        + "\nExamples include: " + allItemTypes + "§6\nOr... you know, you could always add some more - Open BItemRenamer.js and check the top of the config, I think it's called §7itemType§6? Can't miss it.")

                }
            
                var atLeastOneValid = false;
                var tagGroupIDListString = "";
                for(var i = 0; i < this.validGroupIDs.length; i++){
                    if (this.config.tagGroupID == this.validGroupIDs[i])
                        atLeastOneValid = true;
                    tagGroupIDListString += this.validGroupIDs[i] + " "
                }

                if (!atLeastOneValid && this.config.scripted){
                    var primary = this.config.tagItemType == "" ? "item" : this.config.tagItemType;
                    this.Error(e, "Invalid tagGroupID!\nThe ID ' " + this.config.tagGroupID + " ' is not a valid tagGroupID for this " + primary + "\n\n"
                     + "§7§oHmm? What is a valid tagGroupID?\n§7§oI DON'T KNOW!, WHY DON'T YOU CHECK THE LIST THAT YOU WROTE!!!\n§7§oI am not a babysitter!\n\n"
                     + "§7But.... uhhh... wait. Here they are: \n" + tagGroupIDListString);
                }
            
                if (this.config.tag == "" && this.config.scripted)
                    this.Error(e, "HEEEEYYYYYYYY!\nYou absolutely CAN NOT leave the config.tag empty!\nThis is a scripted item (scripted = true)\nGive it a unique name, like BURGERGUN or... I don't know, coming up with this stuff is your job, not mine!!!!");
            
                if (this.config.hasOwnProperty('hideFlagOverride') && this.config.hideFlagOverride > 64){
                    this.Error(e, "Bad hideFlagsOverride! Must be a number between -1 and 64 (-1 means override is disabled, FYI) ~");
                }

                // Verification for User Error
                var newAttributesArray = [];
                if (this.config.attributes.list.length > 0 && this.config.attributes.enabled){
                    for(var i = 0; i < this.config.attributes.list.length; i++){
                        var slot = this.config.attributes.list[i].Slot.toLowerCase();
                        var slotID = 0;
                        switch(slot){
                            case "mainhand":
                                slotID = 0;
                                break;
                            case "offhand":
                                slotID = 1;
                                break;
                            case "feet":
                                slotID = 2;
                                break;
                            case "legs":
                                slotID = 3;
                                break;
                            case "chest":
                                slotID = 4;
                                break;
                            case "head":
                                slotID = 5;
                                break;
                            default:
                                this.Error(e, "Bad Attribute slot! " + this.config.attributes.list[i].Slot + " is not a valid slot!");
                        }
            
                        switch(this.config.attributes.list[i].Name){
                            case "maxHealth":
                            case "followRange":
                            case "knockbackResistance":
                            case "movementSpeed":
                            case "attackDamage":
                            case "attackSpeed":
                                break;
                            default:
                                this.Error(e, "Bad Attribute name! " + this.config.attributes.list[i].Name + " is not a valid name!");
                        }
            
                        // Add the generic keyword
                        var newAttribute = {
                            Amount: this.config.attributes.list[i].Amount,
                            Slot: slotID,
                            Name: "generic." + this.config.attributes.list[i].Name,
                        }
                        newAttributesArray.push(newAttribute);
                    }

                    // Automatically Hide Attributes
                    hideFlagsTag += 2;
                }
                else if (this.config.tagItemType == "ARMOR"){ // If ARMOR, then always hide flags
                    hideFlagsTag += 2;
                }

                var hasSlotTag = this.config.slot != '' && this.config.slot != ' ';
                if (this.configVersion < 2 && !this.legacy_convertOldItems){
                    hasSlotTag = false;
                }
                var handTag = "";
                if (hasSlotTag){
                    var foundOneValidSlotName = false;
                    var slotAbbrev = this.config.slot.toUpperCase();
                    for(var i = 0; i < this.tagSlotNames.length; i++){
                        if (slotAbbrev == this.tagSlotNames[i][0]){

                            if ((slotAbbrev == 'F' || slotAbbrev == 'L' || slotAbbrev == 'C' || slotAbbrev == 'H') && this.config.tagItemType != "ARMOR"){
                                this.Error(e, "Aren't you forgetting something?\nYou're looking for slot " + slotAbbrev + ", right? Then you need to set the tagItemType to ARMOR");
                            }
                            if ((slotAbbrev != 'F' && slotAbbrev != 'L' && slotAbbrev != 'C' && slotAbbrev != 'H') && this.config.tagItemType == "ARMOR"){
                                this.Error(e, "Geez, what now?\nOh, your tagItemType is ARMOR, ok... that's fine.\nWhat isn't is the slot!\nIt has to be either F, L, C or H\n"
                                    + "You know?\nAs in Feet, Legs, Chest, or Head? Understand?"
                                );
                            }
                            foundOneValidSlotName = true;
                            handTag = this.tagSlotNames[i];
                            break;
                        }
                    }
                    if (!foundOneValidSlotName)
                        this.Error(e, "Bad slot name, idiot! " + this.config.slot + " is not a valid slot name! Valid names include: O, M\n*hmph*... what WOULD you do without me...");
                }
                if (this.config.unbreakable)
                    hideFlagsTag += 4;
                if (this.config.hasOwnProperty('enchantments') && this.config.enchantments.hide){
                    hideFlagsTag += 1;
                }

                var nullCode = "NULL001596";
                
                // Apply Tags
                tagString += this.config.tagItemType != "" ? tagString += this.config.tagItemType + ":1b" : nullCode;
                if (rarityTag != "") tagString += "," + rarityTag + ":1b";
                if (this.config.unbreakable) tagString += ",Unbreakable:1";
                var tagGroupIDExtension = this.config.tagItemType == "ORB" && !this.legacy_convertOldItems ? "ORB" : ""; // [NOTE] Legacy Support
                if (this.config.tagGroupID != "") tagString += "," + this.config.tagGroupID + tagGroupIDExtension + ":1b";
                if (this.config.tag != "") tagString += "," + this.config.tag + ":1b";
                var isLeather = this.config.ID == "minecraft:leather_helmet" || this.config.ID == "minecraft:leather_chestplate" || this.config.ID == "minecraft:leather_leggings" || this.config.ID == "minecraft:leather_boots";
                if (this.config.color != "" && isLeather) {
                    var colorHex = this.config.color;
                    if (this.config.color[0] == "#")
                        colorHex = this.config.color.substring(1, this.config.color.length);
                    tagString += ",display:{color:" + parseInt(colorHex, 16) + "}"
                }
                for(var i = 0; i < this.config.tagsBonus.length; i++){
                    if (this.config.tagsBonus[i][this.config.tagsBonus[i].length-1] == "}") tagString += "," + this.config.tagsBonus[i]; // MC tags {} do not use :1b
                    else tagString += "," + this.config.tagsBonus[i] + ":1b";
                }
                if (this.config.scripted) tagString += "," + this.tagScripted + ":1b";
                if (hasSlotTag) tagString += "," + handTag + ":1b";
                if (this.config.skull != "" && this.config.ID == "minecraft:skull"){
                    var headTag = this.config.skull;
                    headTag = headTag.substring(headTag.indexOf("SkullOwner"));
                    headTag = headTag.substring(0, headTag.length - 1);
                    tagString += "," + headTag;
                    dmgValue = 3;
                }
                if (this.config.hasOwnProperty('hideFlagOverride') && this.config.hideFlagOverride > 0) // Ignore automatic hideFlags and specify it manually
                    tagString += ",HideFlags:" + this.config.hideFlagOverride;
                else if (hideFlagsTag != 0)
                    tagString += ",HideFlags:" + hideFlagsTag;
                if (this.config.hasOwnProperty('enchantments') && this.config.enchantments.list.length > 0 && this.config.enchantments.enabled){
                    tagString += "," + DigitalTrinkets12.P.GetEnchantmentTag(this.config.enchantments.list);
                }
                tagString = tagString.replaceAll(nullCode + ',','');
                tagString = tagString.replaceAll(nullCode,'');
            
                var newLore = [];
                if (firstLineLore != "") newLore.push(firstLineLore);
                if (this.config.lore.length > 0 && (this.config.tagItemType != "" || rarityTag != ""))
                    if (rarityTag != "" && this.config.lore.length > 0){
                        var blankDescriptionLoreLine = this.ThematicMan.GetBlankDescriptionLoreLine();
                        if (blankDescriptionLoreLine != null)
                            newLore.push(blankDescriptionLoreLine);
                    }
                for(var i = 0; i < this.config.lore.length; i++)
                    newLore.push(this.ThematicMan.GetDescriptionLore(this.config.lore[i].replaceAll('&', '§')));

                for (var i = 0; i < newLore.length; i++) {
                    if (Utilities.StringIncludes(newLore[i], ':'))
                        this.Message(e, 'w', "Watch out, this item has a colon ':' in it's lore!\nThis will probably cause an error with BTManager.");
                }

                // OPTIONAL: "Effect" Lore
                if (this.config.effectLore.length > 0){
                    if (this.config.tagItemType != "" || rarityTag != "") {
                        if (rarityTag != "" && this.config.effectLore.length > 0) {
                            var blankEffectLoreLine = this.ThematicMan.GetBlankEffectLoreLine();
                            if (blankEffectLoreLine != null) {
                                newLore.push(blankEffectLoreLine);
                            }
                        }
                    }
                    var effectSlotLore = this.ThematicMan.GetEffectSlotLore(this.config.slot.toUpperCase());
                    if (effectSlotLore != "") {
                        newLore.push(effectSlotLore);
                    }
                    for (var i = 0; i < this.config.effectLore.length; i++) {
                        newLore.push(this.ThematicMan.GetEffectLore(this.config.effectLore[i].replaceAll('&', '§')));
                    }
                }

                // Only add attributes if a slot was specified -- (or if the item is not scripted at all)
                var useFakeAttributeLore = false;
                var hasAnyAttributeText = this.config.attributes.lore.length > 0 || (this.config.attributes.enabled && this.config.attributes.list.length > 0 && !this.config.attributes.hide) || (this.config.unbreakable && !this.config.hideUnbreakable);
                if (hasSlotTag || !this.config.scripted) {
                    useFakeAttributeLore = hideFlagsTag != 0 && this.config.attributes.enabled && !this.config.attributes.hide;
                    if (this.config.attributes.lore.length > 0 || useFakeAttributeLore){
                        var blankAttributeLine = this.ThematicMan.GetBlankAttributeLoreLine();
                        if (blankAttributeLine != null)
                            newLore.push(blankAttributeLine);
                        var attributeSlotLore = this.ThematicMan.GetAttributeSlotLore(this.config.slot.toUpperCase());
                        if (attributeSlotLore != "" && hasAnyAttributeText){
                            newLore.push(this.ThematicMan.GetAttributeSlotLore(this.config.slot.toUpperCase()));
                        }
                    }
                    for(var i = 0; i < this.config.attributes.lore.length; i++){
                        var fakeAttributeLore = this.config.attributes.lore[i].replaceAll('&', '§');
                        newLore.push(this.ThematicMan.GetFakeAttributeLore(fakeAttributeLore));
                    }

                    if (useFakeAttributeLore && !this.config.attributes.hide){
                        for(var i = 0; i < this.config.attributes.list.length; i++){
                            var loreLine = this.ThematicMan.GetAttributeLore(this.config.attributes.list[i].Name, this.config.attributes.list[i].Amount);
                            if (loreLine != ""){
                                newLore.push(loreLine);
                            }
                        }
                    }
                }
                if (!hasSlotTag && this.config.scripted){
                    this.Message(e, "w", "Param §3scripted§e was §9true§e, but §3slot§e was left blank\n§7§oSo... I'm just going to hide the attributes! Ummm, Ok?"
                     + "\n§7§oIf this was unintentional, please specify a slot \n§7§oEither §7'§bM§7'§o for §3Mainhand§7§o or §7'§bO§7'§o for §3Offhand"
                     + "\n§7§oI mean, it's not like I WANT to help you or anything...")
                }
                if (this.config.unbreakable && !this.config.hideUnbreakable){
                    newLore.push(this.ThematicMan.GetUnbreakableLore());
                }
                var lastLine = this.ThematicMan.GetLastLine();
                if (lastLine != null){
                    newLore.push(lastLine);
                }
                var newName = this.ThematicMan.GetName(this.config.name.replaceAll('&', '§'));

                this.MakeItemEntity(e, newName, newLore, this.config.ID, dmgValue, tagString, newAttributesArray, this.config.hideFlagOverride);
                this.Message(e, "c", "Taadaa!~ Item Created: " + newName);
            },

            MakeItemEntity: function MakeItemEntity(e, newName, newLore, itemID, dmgValue, tagString, attributeArray, bHideflagsOverride){
                // HACK #1: We cannot use createItem because it does not support custom tags
                // HACK #2: Minecraft hideFlags tag (hiding all) breaks if used in replace item
                var command = "/replaceitem entity " + e.player.getDisplayName() + " slot.hotbar.8 " + itemID + " 1 " + dmgValue + " {" + tagString + "}";
                if (this.sayCreateCommandInChat)
                    e.player.world.broadcast("§7§o" + command)
                e.API.executeCommand(e.player.world, command);
                var itemStack = e.player.getInventory().getSlot(8);
            
                itemStack.setCustomName(newName);
                itemStack.setLore(newLore);
                for(var i = 0; i < attributeArray.length; i++){
                    itemStack.setAttribute(attributeArray[i].Name, attributeArray[i].Amount, attributeArray[i].Slot);
                }
            },

            CreateFromDigitized: function CreateFromDigitized(e){
                if (e.player.getInventory().getSlot(8) == e.item){
                    this.Message(e, "e", "Is this deja vu? I already told you this item doesn't work in hotbar slot 9!!");
                    return;
                }
            
                if (!e.player.getWorld().getTempdata().has(DigitalTrinkets12.GetDataKey()) && this.config.digitizedTrinketOverride == ""){
                    this.Message(e, "e", "There's No Digitized Trinket in memory.\nI'm not a genie. What do you expect me to do? \nStore a trinket using the Digitizer first or write something on the digitizedTrinketOverride line. Ok?~");
                    return;
                }
            
                var digitizedString = e.player.getWorld().getTempdata().has(DigitalTrinkets12.GetDataKey()) && this.config.digitizedTrinketOverride == "" ? e.player.getWorld().getTempdata().get(DigitalTrinkets12.GetDataKey()) : this.config.digitizedTrinketOverride;
                DigitalTrinkets12.Give(e.player, digitizedString);
            },

            GetMode: function GetMode(e) { 
                // x stands for... well if means something went wrong
                if (e.item.getDisplayName().length < 13){
                    return "x"
                }

                // convert from color code on item name -> to nickname given to each mode (r for renamer, d for digitizer, etc...)
                var loreColor = e.item.getDisplayName()[13];
                switch(loreColor){
                    case "a": 
                        return "r";
                    case "f":
                        return "a";
                    case "3":
                        return "d";
                    case "5":
                        return "da";
                    case "6":
                        return "cn";
                    case "c":
                        return "cl";
                } 
            },

            VerifyConfigIntegrity: function VerifyConfigIntegrity(conf){
                this.configVersion = conf.version == null ? conf.itemName != null ? 1 : 2 : Math.max(conf.version, 4);

                // UNSUPPORTED ERROR
                if (this.configVersion >= (Math.floor(this.version)+1)) {
                    this.GlobalError("Config version §4§l" + conf.version + "§6 is unsupported.\nBItemRenamer supports config files §2§l1§6-§2§l" + this.version);
                }

                // LEGACY SUPPORT [Tested with config v1.4 - v1.8] -> CONVERT TO v4.0
                if (this.configVersion >= 1 && this.configVersion < 2){
                    conf.name = conf.itemName;
                    conf.ID = conf.itemID;
                    conf.unbreakable = false;
                    conf.skull = conf.summonHead;
                    conf.slot = 'O';
                    conf.attributesEnabled = conf.addAttributes;
                    conf.tagGroupID = conf.tagID;
                    conf.tagsBonus == null ? [] : conf.tagsBonus;
                    conf.tagItemType = conf.primaryTag == null ? "TRINKET" : conf.primaryTag;
                    conf.scripted = this.legacy_convertOldItems ? true : false;

                    if (conf.dmgValue == null){
                        conf.dmgValue = 0;
                    }
                    this.debugDigitizer = conf.debugDigitizer;
                    if (conf.validIDs != null && !this.legacy_convertOldItems){
                        for(var i = 0; i < conf.validIDs.length; i++){
                            this.validGroupIDs.push(conf.validIDs[i]);
                        }
                    }
                }

                // LEGACY SUPPORT [Tested with config v4.0] -> CONVERT TO v5.0
                if (this.configVersion < 5) {
                    if (conf.attributes.lore != null)
                        this.GlobalError("SOMETHING WENT WRONG! THIS IS NOT A VERSION §4§l" + conf.version + "§6 CONFIG!\nTry changing config.version to §2§l5");
                    conf.enchantments = conf.enchantments != null ? conf.enchantments : { enabled: false, hide: true, list: [] };
                    conf.hideFlagOverride = conf.hideFlagOverride != null ? conf.hideFlagOverride : -1;
                    conf.hideUnbreakable = conf.hideUnbreakable != null ? conf.hideUnbreakable : false;
                    conf.color = conf.color != null ? conf.color : "";
                    var tmpAttributesList = conf.attributes;
                    var tmpAttributesLore = conf.attributeLore;
                    var tmpAttributesEnabled = conf.attributesEnabled;
                    conf.attributes = {
                        enabled: tmpAttributesEnabled,
                        hide: false,
                        list: tmpAttributesList,
                        lore: tmpAttributesLore
                    }
                }

                // LEGACY SUPPORT -> CONVERT TO v6.0
                if (this.configVersion < 6){
                    conf.effectLore = [];
                }

                // Latest Config Requirements
                if (conf.name == null)
                    this.GlobalError("config.name was null - needs a name [string] parameter\n\nExample:\n &6My &2Cool &c&oSword");
                if (conf.lore == null)
                    this.GlobalError("config.lore was null - needs a lore [list string] parameter\n\nExample:\n [\"Lore line 1\"],[\"Lore line 2\"]");
                if (conf.ID == null)
                    this.GlobalError("config.ID was null - needs an ID [string] ID\n\nExample:\n minecraft:air");
                if (conf.dmgValue == null)
                    this.GlobalError("config.dmgValue was null - needs a dmgValue [int] ID\n\nExample:\n 0");
                if (conf.unbreakable == null)
                    this.GlobalError("config.unbreakable was null - needs a unbreakable [boolean] ID\n\nExample:\n false");
                if (conf.skull == null)
                    this.GlobalError("config.skull was null - needs a skull [string] ID\n\nExample:\n take the /give command for a player head\nThen remove the /give part like so:\n\n" + 
                    "{display:{Name:\"Christmas Light (red)\"},SkullOwner:{Id:\"c535f43f-8adb-4007-9088-118f6acdc7ec\",Properties:{textures:[{Value:\"eyJ0ZXh0dXJlcyI6eyJTS0lOIjp7InVybCI6Imh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvNzlmZjg4ODY3YmI0MTk2OWJiMTg3OTM1ODZkMmJjZmFiZmM5ZjljM2NmNTFiYjlmZmM2ODk0ZjRlNTZhNjgifX19\"}]}}}\n\n"
                    + "If not using a skull leave this string empty like so: Skull: \"\"");
                if (conf.rarity == null)
                    this.GlobalError("config.rarity was null - needs a rarity [char] ID\n\nExample:\n 'C' for common\nLeave empty string ' ' to have no rarity");
                if (conf.slot == null)
                    this.GlobalError("config.slot was null - needs a slot [char] ID\n\nExample:\n 'M' for mainhand\n'O' for offhand" + 
                        "\nLeave empty string ' ' to have no slot");
                if (conf.attributes == null)
                    this.GlobalError("config.attributes is missing - add this code to config.\n\nExample:\n\n"
                        + "attributes: {\n    enabled: true, hide: true, list: [\n        { Slot: \"mainhand\", Amount: -2.4, Name: \"attackSpeed\" },\n        { Slot: \"mainhand\", Amount: 8, Name: \"attackDamage\" },\n    ], lore: [\n        \" &9+1 Style Point\"\n    ]\n},");
                if (conf.attributes.lore == null)
                    this.GlobalError("config.attributes.lore was null - needs a attributes.lore [list string] parameter\n\nExample:\n [\"+1 Super Attack DMG\", \"-2 &6Super Speed\"]"
                        + "\nLeave empty string ' ' to have no attribute lore (like atk dmg, etc...)");
                if (conf.attributes.enabled == null)
                    this.GlobalError("config.attributes.enabled was null - needs a config.attributes.enabled [boolean] ID\n\nExample:\n false or true");
                if (conf.attributes.list == null)
                    this.GlobalError("config.attributes.list was null - needs a attribute.list [obj] ID\n\nExample:\n\n" + "attributes.list: [\n" + 
                    "{ Slot: \"mainhand\", Amount: -3, Name: \"attackSpeed\" },\n" + 
                    "{ Slot: \"mainhand\", Amount: 10, Name: \"attackDamage\" },\n" + 
                "],");
                if (conf.tag == null)
                    this.GlobalError("config.tag was null - needs a tag [string] parameter\n\nExample:\n MYWEAPON");
                if (conf.tagGroupID == null)
                    this.GlobalError("config.tagGroupID was null - needs a tagGroupID [string] parameter\n\nExample:\n METALWEAPON");
                if (conf.tagItemType == null)
                    this.GlobalError("config.tagItemType was null - needs a tagItemType [string] parameter\n\nExample:\n Leave empty string ' ' or \nTRINKET or ORB");
                if (conf.scripted == null)
                    this.GlobalError("config.scripted was null - needs a scripted [boolean] parameter\n\nExample:\n true");
                if (conf.tagsBonus == null)
                    this.GlobalError("config.tagsBonus was null - needs a tagsBonus [string list] parameter\n\nExample:\n [ HEAVY, CURSED, ENCHANTED ]");
                if (conf.color == null)
                    this.GlobalError("config.color was null - needs a color [string HEX] parameter\n\nExample:\n \"FF0000\"");
                if (conf.digitizedTrinketOverride == null)
                    this.GlobalError("config.digitizedTrinketOverride was null - needs a digitizedTrinketOverride [string] parameter\n" 
                    + "\n\nExample: Leave empty string ' ' to avoid using an override" +
                    "\nOR this parameter takes a digital trinket string (see: DigitalTrinkets12) and manufactures it using the \"Create From Digitized\" mode");
                if (conf.enchantments == null)
                    this.GlobalError("config.attributes was null - needs a attributes [obj] ID\n\nExample:\n\n" + "enchantments: { enabled: false, hide: true, list: [\n" +
                        "{ ID: 10, Lvl: 1 }, \n" + "],");
                if (conf.hideFlagOverride == null)
                    this.GlobalError("config.hideFlagOverride was null - needs a hideFlagOverride [int] parameter\n\nExample:\n -1\nEntering -1 disables this override\n"
                        + "using 62 for example overrides the automatic hideflags engine with 62... in case you want to set things manually");
                
                // INVALID CHARACTERS
                var invalidChars = ['\"'];
                if (typeof DigitalTrinkets12 != 'undefined'){
                    invalidChars.push(DigitalTrinkets12.GetDelimiter());
                }
                var loreStr = conf.lore.toString(); // HACK: required conversion
                for(var i = 0; i < invalidChars.length; i++){
                    if (loreStr.indexOf(invalidChars[i]) !== -1){
                        this.GlobalError("config.lore contains an invalid character: §b" + invalidChars[i] + "§6\nPlease delete this character §b" + invalidChars[i] + " §6from the lore.");
                    }
                }
            },

            GlobalError: function GlobalError(message){
                var world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorlds()[0];
                var ap = world.getAllPlayers();
                if (ap.length > 0){
                    var e = {
                        API: Java.type("noppes.npcs.api.NpcAPI").Instance(),
                        player: ap[0] 
                    }
                    this.Error(e, message);
                }
            },

            // Used for User error in config
            Error: function Error(e, message){
                this.Message(e, "se", "");
                this.Message(e, "e", "\n§6" + message);
                throw("\n\n[B]ItemRenamer: " + message + "\n\n");
            },

            /* Rename r, apply a, Digitize d, DigitizeAll da, Create c, Error e, ScriptError se */ 
            Message: function Message(e, mode, text){
                var prefix = "[\"\",{\"text\":\"[\",\"color\":\"aqua\"},{\"text\":\"B\",\"bold\":true,\"color\":\"dark_aqua\"},{\"text\":\"]\",\"color\":\"aqua\"},{\"text\":\":\",\"bold\":true,\"color\":\"dark_gray\"},{\"text\":\" ";
                switch(mode){
                    case "w":
                        if (!this.hideWarnings)
                            this.Tellraw(e, prefix + "§6[!]§e: " + text + "\",\"color\":\"yellow\"}]");
                        break;
                    case "r":
                        this.Tellraw(e, prefix + text + "\",\"color\":\"green\"}]");
                        break;
                    case "a":
                        this.Tellraw(e, prefix + text + "\",\"color\":\"white\"}]");
                        break;
                    case "d":
                        this.Tellraw(e, prefix + text + "\",\"color\":\"dark_aqua\"}]");
                        break;
                    case "da":
                        this.Tellraw(e, prefix + text + "\",\"color\":\"blue\"}]");
                        break;
                    case "c":
                        this.Tellraw(e, prefix + text + "\",\"color\":\"gold\"}]");
                        break;
                    case "e":
                        this.Tellraw(e, prefix + "§4§lERROR§c: " + text + "\",\"color\":\"gold\"}]");
                        break;
                    case "se":
                        this.Tellraw(e, prefix + "§4§lERROR§c: §8§lConfig Failed! Check the script console!\",\"color\":\"dark_red\"}]");
                        break;
                    default:
                        this.Error("Message(e, mode, text) must be given a valid mode. '" + mode + "' is not a valid mode.\nValid modes include: r, a, d, da, c, e, se \n\nRename r, apply a, Digitize d, DigitizeAll da, Create c, Error e, ScriptError se");
                } 
            },

            Tellraw: function Tellraw(e, tellraw){
                e.API.executeCommand(e.player.world, "/tellraw " + e.player.getDisplayName() + " " + tellraw);
            },

            // Theme Manager
            ThematicMan: {

                GetName: function GetName(name) { return this.P.GetName(name); },
                GetDescriptionLore: function GetDescriptionLore(loreLine) { return this.P.GetDescriptionLore(loreLine); },
                GetEffectLore: function GetEffectLore(loreLine) { return this.P.GetEffectLore(loreLine); },
                GetBlankDescriptionLoreLine: function GetBlankDescriptionLoreLine() { return this.P.GetBlankDescriptionLoreLine(); },
                GetBlankEffectLoreLine: function GetBlankEffectLoreLine() { return this.P.GetBlankEffectLoreLine(); },
                GetBlankAttributeLoreLine: function GetBlankAttributeLoreLine() { return this.P.GetBlankAttributeLoreLine(); },
                GetFakeAttributeLore: function GetFakeAttributeLore(loreLine) { return this.P.GetFakeAttributeLore(loreLine); },
                GetAttributeLore: function GetAttributeLore(name, amount){ return this.P.GetAttribute(name, amount); },
                GetUnbreakableLore: function GetUnbreakableLore(){ return this.P.GetUnbreakable(); },
                GetLastLine: function GetLastLine(){ return this.P.GetLastLine(); },
                GetItemTypeLore: function GetItemTypeLore(itemType) { return this.P.GetItemTypeLore(itemType); },
                GetRarityLore: function GetRarityLore(rarity, itemTypeLore){ return this.P.GetRarityLore(rarity, itemTypeLore); },
                GetEffectSlotLore: function GetEffectSlotLore(slot){ return this.P.GetEffectSlot(slot); },
                GetAttributeSlotLore: function GetAttributeSlotLore(slot){ return this.P.GetAttributeSlot(slot); },
                GetTheme: function GetTheme(themeID) { return this.P.GetTheme(themeID); },
                
                P: {

                    GetName: function GetName(name){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetName')){
                                return theme.GetName(name);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetName(name)\n\n" + ex);
                        }
                        return name.replaceAll('&', '§');
                    },

                    GetDescriptionLore: function GetDescriptionLore(loreLine){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetDescriptionLore')){
                                return theme.GetDescriptionLore(loreLine);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetDescriptionLore(loreLine)\n\n" + ex);
                        }
                        return loreLine.replaceAll('&', '§');
                    },

                    GetEffectLore: function GetEffectLore(loreLine){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetEffectLore')){
                                return theme.GetEffectLore(loreLine);
                            }
                        }
                        catch(ex) {
                            throw ("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetEffectLore(loreLine)\n\n" + ex);
                        }
                        return " " + loreLine.replaceAll('&', '§');
                    },

                    GetBlankDescriptionLoreLine: function GetBlankDescriptionLoreLine(){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetBlankDescriptionLoreLine')){
                                return theme.GetBlankDescriptionLoreLine();
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetBlankDescriptionLoreLine()\n\n" + ex);
                        }
                        return "§7";
                    },

                    GetBlankEffectLoreLine: function GetBlankEffectLoreLine(){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetBlankEffectLoreLine')){
                                return theme.GetBlankEffectLoreLine();
                            }
                        }
                        catch(ex) {
                            throw ("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetBlankEffectLoreLine()\n\n" + ex);
                        }
                        return "§7";
                    },

                    GetBlankAttributeLoreLine: function GetBlankAttributeLoreLine(){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetBlankAttributeLoreLine')){
                                return theme.GetBlankAttributeLoreLine();
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetBlankAttributeLoreLine()\n\n" + ex);
                        }
                        return "§7";
                    },

                    GetFakeAttributeLore: function GetFakeAttributeLore(loreLine){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetFakeAttributeLore')){
                                return theme.GetFakeAttributeLore(loreLine);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetFakeAttributeLore(loreLine)\n\n" + ex);
                        }
                        return loreLine;
                    },

                    GetAttribute: function GetAttribute(attributeID, amount){

                        // Use a custom theme
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('attributes')){
                                for(var i = 0; i < theme.attributes.length; i++){
                                    if (theme.attributes[i].ID == attributeID){
                                        return theme.attributes[i].Get(amount);
                                    }
                                }
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nfor attribute: \"" + attributeID + "\" in theme.Get(amount)\n\n" + ex);
                        }
    
                        // Use default (Minecraft Style) theme
                        var prefix = amount > 0 ? "§9 +" : "§c ";
                        switch (attributeID){
                            case "maxHealth":
                                return prefix + amount + " Max Health";
                            case "followRange":
                                return ""; // this stat doesn't do anything, why would I bother filling it out?
                            case "knockbackResistance":
                                return prefix + amount + " Knockback Resistance";
                            case "movementSpeed":
                                return prefix + amount + " Speed";
                            case "attackDamage":
                                // SPECIAL FIX: if attack damage is -1, it means we do 0 damage, 
                                // so just write 0 cause the lore looks nicer when it says 0 (as opposed to -1)
                                var atkAmount = amount == -1 ? 0 : amount;
                                return prefix + atkAmount + " Attack Damage";
                            case "attackSpeed":
                                // Looks bad (normal sword attack speed is -2.4) so this is disabled by default.
                                // I recommend writing your own custom attack speed lore in the lore section, like +1 or +2
                                if (this.legacy_hideAttackSpeed)
                                    return "";
                                return prefix + amount + " Attack Speed";
                        }
                    },
                    GetUnbreakable: function GetUnbreakable(){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetUnbreakable')){
                                return theme.GetUnbreakable();
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetUnbreakable()\n\n" + ex);
                        }
                        return BItemRenamer.P.config.slot != '' ? "§9Unbreakable" : "§9Unbreakable";
                    },
                    GetItemTypeLore: function GetItemTypeLore(itemType){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetItemTypeLore')){
                                return theme.GetItemTypeLore(itemType.TAG);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetItemTypeLore()\n\n" + ex);
                        }
                        return itemType.LORE;
                    },
                    GetLastLine: function GetLastLine(){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetLastLine')){
                                return theme.GetLastLine();
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetLastLine()\n\n" + ex);
                        }
                        return null;
                    },
                    GetRarityLore: function GetRarityLore(rarity, itemTypeLore){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetRarityLore')){
                                return theme.GetRarityLore(rarity, itemTypeLore);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetRarityLore()\n\n" + ex);
                        }
                        var firstLineLore = "";
                        switch(rarity){
                            case 'C':
                                firstLineLore = "§a§o* Common" + itemTypeLore;
                                break;
                            case 'U':
                                firstLineLore = "§2§o* Uncommon" + itemTypeLore;
                                break;
                            case 'R':
                                firstLineLore = "§d§o* Rare" + itemTypeLore;
                                break;
                            case 'L':
                                firstLineLore = "§6§l§o* Legendary" + itemTypeLore;
                                break
                            case 'E':
                                firstLineLore = "§4§l§o* §4§l§oEXOTIC" + itemTypeLore;
                                break;
                        }
                        return firstLineLore;
                    },
                    GetEffectSlot: function GetEffectSlot(slot){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetEffectSlot')){
                                return theme.GetEffectSlot(slot);
                            }
                        }
                        catch(ex) {
                            throw ("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetEffectSlot(slot)\n\n" + ex);
                        }
                        
                        switch(slot){
                            case 'O':
                                return "§7When in off hand:";
                            case 'M':
                                return "§7When in main hand:";
                            case 'F':
                                return "§7When on feet:";
                            case 'L':
                                return "§7When on legs:";
                            case 'C':
                                return "§7When on body:";
                            case 'H':
                                return "§7When on head:";
                        }
                        return "";  
                    },
                    GetAttributeSlot: function GetAttributeSlot(slot){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null){
                                if (theme.hasOwnProperty('GetSlot'))
                                    return theme.GetSlot(slot);
                                if (theme.hasOwnProperty('GetAttributeSlot'))
                                    return theme.GetAttributeSlot(slot);
                            }
                        }
                        catch(ex) {
                            throw ("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetAttributeSlot(slot)\n\n" + ex);
                        }
                        
                        switch(slot){
                            case 'O':
                                return "§7When in off hand:";
                            case 'M':
                                return "§7When in main hand:";
                            case 'F':
                                return "§7When on feet:";
                            case 'L':
                                return "§7When on legs:";
                            case 'C':
                                return "§7When on body:";
                            case 'H':
                                return "§7When on head:";
                        }
                        return "";  
                    },

                    GetTheme: function GetTheme(themeID){
                        if (themeID != ""){
                            for(var i = 0; i < BItemRenamer.Themes.length; i++){
                                if (BItemRenamer.Themes[i].ID == themeID){
                                    return BItemRenamer.Themes[i];
                                }
                            }
                        }
                        return null;
                    }
                }
            },

            

        },

        Themes: [
            {
                /* A very festive theme - by Rimscar */
                ID: "HOLIDAY",
                attributes: [
                    {
                        ID: "attackDamage",
                        Get: function Get(num){
                            return "§c ➢ DMG§4 » §c§l" + num;
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(num){
                            var spd;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = 5;
                            return "§a ➢ SPD§2 » §a§l" + spd;
                        }
                    },
                ],
                GetUnbreakable: function GetUnbreakable(){
                    return "§8 ➢ §7§lUnbreakable";
                },
                GetSlot: function GetSlot(slot){
                    if (slot == 'O')
                            return "§7§lOffhand";
                        else
                            return "§b❄§f★§3❅§f★§b❄§f★§3❅§f★§b❄§f★§3❅§f★§b❄";
                },
                GetName: function GetName(name){
                    var isProbablyWeapon = false;
                    if (BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled){
                        for(var i = 0; i < BItemRenamer.P.config.attributes.list.length; i++){
                            if (BItemRenamer.P.config.attributes.list[i].Name == "attackDamage" && BItemRenamer.P.config.attributes.list[i].Amount > 1){
                                isProbablyWeapon = true;
                            }
                        }
                    }
                    return isProbablyWeapon ? "§b«» " + name + " §b«»" : "§6§l✫ " + name + " §6§l✫";
                },
            },
            {
                /* Theme by Rimscar */
                ID: "METALWEAPON",
                attributes: [
                    {
                        ID: "attackDamage",
                        Get: function Get(num){
                            return "§c  ➢ DMG§4 » §c§l" + num;
                        }
                    },
                    {
                        ID: "maxHealth",
                        Get: function Get(num){
                            return "§d  ➢ VIT§5 » §d§l" + (num*.5); // in hearts
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(num){
                            var spd;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = 5;
                            return "§b  ➢ SPD§3 » §b§l" + spd;
                        }
                    },
                ],
                GetUnbreakable: function GetUnbreakable(){
                    return "§8  ➢ §7UNB";
                },
                GetSlot: function GetSlot(slot){
                    if (slot == 'O')
                        return "§7§lOffhand";
                    else
                        return "§3 ═══════════»";
                },
                GetName: function GetName(name){
                    var isProbablyWeapon = false;
                    if (BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled){
                        for(var i = 0; i < BItemRenamer.P.config.attributes.list.length; i++){
                            if (BItemRenamer.P.config.attributes.list[i].Name == "attackDamage" && BItemRenamer.P.config.attributes.list[i].Amount > 1){
                                isProbablyWeapon = true;
                            }
                        }
                    }
                    if (isProbablyWeapon){
                        return " §b§l" + name;
                    }
                    else{
                        return name.length < 5 || name[4] == "█" || name[3] == "█" ? "§b§l" + name : "§b█ " + name + " §b█"
                    }
                },
            },
            {
                /* A very good theme - by Rimscar */
                ID: "NOT_GIANT_WHOOP",
                attributes: [
                    {
                        ID: "attackDamage",
                        Get: function Get(num) {
                            return " §cATK§4  » §c§l" + num;
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(num) {
                            var spd;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = 5;
                            return " §aSPD§2  » §a§l" + spd;
                        }
                    },
                    {
                        ID: "maxHealth",
                        Get: function Get(num) {
                            var spd;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = 5;
                            return " §dVIT§5§l  §5» §d§l" + spd;
                        }
                    },
                ],
                GetUnbreakable: function GetUnbreakable() {
                    return "§8 §7Unbreakable";
                },
                GetSlot: function GetSlot(slot) {
                    if (slot == 'O')
                        return "§7§lOffhand";
                    else
                        return "§7- - - - - - - - -";
                },
                GetName: function GetName(name) {
                    var isProbablyWeapon = false;
                    if (BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled) {
                        for (var i = 0; i < BItemRenamer.P.config.attributes.list.length; i++) {
                            if (BItemRenamer.P.config.attributes.list[i].Name == "attackDamage" && BItemRenamer.P.config.attributes.list[i].Amount > 1) {
                                isProbablyWeapon = true;
                            }
                        }
                    }
                    return isProbablyWeapon ? "§4⚔ §c§l" + name : "§6✆ §e§l" + name;
                },
                GetItemTypeLore: function GetItemTypeLore(itemTypeTag) {
                    var itemTypeStr = "";
                    switch (itemTypeTag) {
                        case "TRINKET":
                            itemTypeStr = "§4 [§c TALISMAN §4]";
                            break;
                        case "ORB":
                            itemTypeStr = "§b [§9 ORB §b]";
                            break;
                        case "LENS":
                            itemTypeStr = "§6 [§e LENS §6]";
                            break;
                        case "CONSUMABLE":
                            itemTypeStr = "§6 [§e FOOD §6]";
                            break;
                        default:
                            throw ("\nThe heck is this? ---> " + itemTypeTag + " ???\nSorry, but the item type '" + itemTypeTag + "' is not part of the NOT_GIANT_WHOOP theme."
                                + "\n 1. go to BItemRenamer.Themes\n 2. find the 'NOT_GIANT_WHOOP' theme\n 3. and add the new item type '" + itemTypeTag + "' to the GetItemTypeLore() function.\n\n")
                    }
                    return itemTypeStr;
                },
                GetRarityLore: function GetRarityLore(rarity, itemTypeLore) {
                    var rarityName = "";
                    switch (rarity) {
                        case 'C':
                            rarityName = "§a§o * Surf"
                            break;
                        case 'U':
                            rarityName = "§2§o * Peasant";
                            break;
                        case 'R':
                            rarityName = "§d§o * Commoner";
                            break;
                        case 'L':
                            rarityName = "§6§l§o * Noble";
                            break
                        case 'E':
                            rarityName = "§4§l§o * Royal";
                            break;
                    }
                    return rarityName + " " + itemTypeLore
                },
                GetDescriptionLore: function GetDescriptionLore(loreLine) {
                    return "§l §e▼ §8" + loreLine;
                },
                GetFakeAttributeLore: function GetFakeAttributeLore(loreLine) {
                    return "§l §e► §8" + loreLine;
                },
            },
            {
                /* An updated version of monospace, from 'Sea of Die' - a theme by Rimscar */
                ID: "MONOSPACE_ANALOG_2",
                maxDMG: 10,
                maxHP: 20,
                progressBarLength: 8,
                colors: ['8','7','f'],
                attributes: [
                    {
                        ID: "attackDamage",
                        Get: function Get(num){
                            var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                            var c1 = "§" + theme.colors[0];
                            var c2 = "§" + theme.colors[1];
                            return "§l " + c1 + "▌╚ " + c2 + "DMG" + c1 + " » " + theme.GetProgressBar(num, theme.maxDMG);
                        },
                    },
                    {
                        ID: "maxHealth",
                        Get: function Get(num){
                            var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                            var c1 = "§" + theme.colors[0];
                            var c2 = "§" + theme.colors[1];
                            return "§l " + c1 + "▌╚§l " + c2 + "VIT§l " + c1 + "» " + theme.GetProgressBar(num, theme.maxHP);
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(num){
                            var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                            var c1 = "§" + theme.colors[0];
                            var c2 = "§" + theme.colors[1];
                            var spd;
                            var maxSpeed = 5;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = maxSpeed;
                            return "§l " + c1 + "▌╚ " + c2 + "SPD " + c1 + "» " + theme.GetProgressBar(spd, maxSpeed-1);
                        }
                    },
                    {
                        ID: "movementSpeed",
                        Get: function Get(num){
                            var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                            var c1 = "§" + theme.colors[0];
                            var c2 = "§" + theme.colors[1];
                            var bar = "";
                            if (num < 0){
                                // NOTE: unable to move is -0.1
                                var maxSpeedDebuff = 5;
                                var spd;
                                if (num > 0.005) spd = 0; // not noticable
                                else if (num > -0.01) spd = 1; // barely perceptible
                                else if (num > -0.015) spd = 1.5; // noticable
                                else if (num > -0.02) spd = 3.5; // very noticeable debuff
                                else if (num > -0.05) spd = 4; // SNAIL PACE
                                else if (num > -0.08) spd = 4.5; // XD
                                else spd = maxSpeedDebuff;
                                bar = theme.GetProgressBar(spd, maxSpeedDebuff, true);
                            }
                            else{
                                var spd;
                                var maxSpeed = 5;
                                if (num < 0.02) spd = 0;
                                else if (num <= 0.05) spd = 1; // (slight) speed buff
                                else if (num <= 0.08) spd = 2; // Speed I
                                else if (num <= 0.1) spd = 3.5; // very fast
                                else if (num <= 0.13) spd = 4; // very very fast
                                else if (num <= 0.15) spd = 4.5; // joke spd
                                else spd = maxSpeed;
                                bar = theme.GetProgressBar(spd, maxSpeed);
                            }
                            return "§l " + c1 + "▌╚ " + c2 + "MOV" + c1 + " » " + bar;
                        },
                    },
                ],
                GetUnbreakable: function GetUnbreakable(){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];
                    var hasAttributes = BItemRenamer.P.config.attributes.lore.length || (BItemRenamer.P.config.attributes.enabled && !BItemRenamer.P.config.attributes.hide && BItemRenamer.P.config.attributes.list.length > 0);
                    if (BItemRenamer.P.config.tagItemType == "ARMOR" && !hasAttributes)
                        return "§l " + c1 + "▌╚ ○ " + c2 + "UNB ︻╦╤─";
                    else
                        return "§l " + c1 + "▌╚         ▐ »" + c2 + "UNB ︻╦╤─§l " + c1 + "▌";
                },
                GetEffectSlot: function GetEffectSlot(slot){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    if (slot == 'O')
                        return theme.GetDescriptionLore("") + c1 + "§8[§7OFF▬HND§8]";
                    else if (BItemRenamer.P.config.tagItemType == "CONSUMABLE"){
                        return theme.GetDescriptionLore("") + c1 + "§8[§7RHT▬CLK§8]";
                    }
                    return "§l " + c1 + "▌";
                },
                GetAttributeSlot: function GetAttributeSlot(slot) {
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌";
                },
                GetName: function GetName(name){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];
                    var isProbablyWeapon = false;
                    var isArmor = BItemRenamer.P.config.tagItemType == "ARMOR";
                    if (BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled){
                        for(var i = 0; i < BItemRenamer.P.config.attributes.list.length; i++){
                            if (BItemRenamer.P.config.attributes.list[i].Name == "attackDamage" && BItemRenamer.P.config.attributes.list[i].Amount > 1){
                                isProbablyWeapon = true;
                            }
                        }
                    }
                    var prefix = "";
                    if (isProbablyWeapon){
                        prefix = " " + c2 + "[" + c1 + "§l⚔" + c2 + "]"
                    }
                    else if (isArmor){
                        prefix = " " + c2 + "[" + c1 + "§l✦" + c2 + "]" //❂
                    }
                    return c2 + "◘" + c1 + "◙" + c2 + "◘" + prefix + " " + c1 + "§l" + name + " " + c2 + "▼▼▼ »";
                },
                GetDescriptionLore: function GetDescriptionLore(loreLine){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];
                    return "§l " + c1 + "▌ • " + c2 + loreLine;
                },
                GetEffectLore: function GetEffectLore(loreLine){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];

                    var LoreLineNoColors = loreLine.replace(/§./g, '');
                    if (loreLine.length == 0 || theme.IsLowerCase(LoreLineNoColors[0]))
                        return theme.GetDescriptionLore("") + "§l  " + c2 + loreLine;
                    else
                        return theme.GetDescriptionLore("") + c2 + "» " + loreLine;
                },
                GetBlankDescriptionLoreLine: function GetBlankDescriptionLoreLine(){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    return "§l " + c1 + "▌";
                },
                GetBlankEffectLoreLine: function GetBlankEffectLoreLine(){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    return "§l " + c1 + "▌";
                },
                GetFakeAttributeLore: function GetFakeAttributeLore(loreLine) {
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];
                    return "§l " + c1 + "▌ " + c2 + loreLine;
                },
                GetBlankAttributeLoreLine: function GetBlankAttributeLoreLine() {
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    if (BItemRenamer.P.config.lore.length > 0)
                        return "§l  " + c1 + " • ═░░░═══  ▀  ▀  ▀";
                    else
                        return "§l " + c1 + "▌";
                },
                GetLastLine: function GetLastLine(){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];

                    var hasAttributes = BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled;
                    if (BItemRenamer.P.config.tagItemType == "ARMOR")
                        return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌"; //          armor
                    else if (BItemRenamer.P.config.tagItemType == "CONSUMABLE")
                        return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌"; //              consumable
                    else if (BItemRenamer.GetConfigSlot() == 'O' && !hasAttributes)
                        return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌"; //              offhand (trinket??)
                    else if (hasAttributes)
                        return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌"; //          weapon ??
                    else
                        return "§l " + c1 + "▌≡≡≡≡≡≡≡≡≡≡≡≡≡≡▌";
                },
                GetItemTypeLore: function GetItemTypeLore(itemTypeTag){
                    var itemTypeStr = "";
                    switch(itemTypeTag){
                        case "TRINKET":
                            itemTypeStr = "TNKT";
                            break;
                        case "ORB":
                            itemTypeStr = "ORB";
                            break;
                        case "LENS":
                            itemTypeStr = "LENS";
                            break;
                        case "CONSUMABLE":
                            itemTypeStr = "CNSB";
                            break;
                        default:
                            throw ("\nThe heck is this? ---> " + itemTypeTag + " ???\nSorry, but the item type '" + itemTypeTag + "' is not part of the MONOSPACE_ANALOG_2 theme."
                                + "\n 1. go to BItemRenamer.Themes\n 2. find the 'MONOSPACE_ANALOG_2' theme\n 3. and add the new item type '" + itemTypeTag + "' to the GetItemTypeLore() function.\n\n")
                    }
                    return itemTypeStr;
                },
                GetRarityLore: function GetRarityLore(rarity, itemTypeLore){
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];

                    var rarityLoreLine = "§l " + c1 + "▌ »»» " + c2 + "§n" + itemTypeLore + "" + c1 + " ○ ╚§n";
                    switch(rarity){
                        case 'C':
                            rarityLoreLine += "COMN";
                            break;
                        case 'U':
                            rarityLoreLine += "UCMN";
                            break;
                        case 'R':
                            rarityLoreLine += "RARE";
                            break;
                        case 'L':
                            rarityLoreLine += "LGND";
                            break
                        case 'E':
                            rarityLoreLine += "EXTC";
                            break;
                    }
                    return rarityLoreLine += c1 + "╝";
                },
                GetProgressBar: function GetProgressBar(num, maxValue, OPTIONAL_invertColors){
                    if (OPTIONAL_invertColors == null) { OPTIONAL_invertColors = false; }

                    num = Math.abs(num);
                    maxValue = Math.abs(maxValue);
                    var theme = BItemRenamer.P.ThematicMan.GetTheme("MONOSPACE_ANALOG_2");
                    var c1 = "§" + theme.colors[0];
                    var c2 = "§" + theme.colors[1];
                    var c3 = "§" + theme.colors[2];

                    var c1Copy = c1;
                    var c2Copy = c2;

                    if (OPTIONAL_invertColors){
                        var tmp = c1;
                        c1 = c2;
                        c2 = tmp;
                        c3 = tmp;
                    }

                    var numPercentage = (Math.min(num, maxValue)) / maxValue;
                    var numNormalized = Math.ceil(numPercentage * this.progressBarLength);
                    var recolorIndicator = Math.floor(numNormalized*(num >= maxValue ? 1 : 0.75));
                    var progBar = c3;
                    for(var i = 0; i < recolorIndicator; i++)
                        progBar += "█";
                    progBar += c2;
                    var recolorIndicatorRemaining = numNormalized - recolorIndicator;
                    for(var i = 0; i < recolorIndicatorRemaining; i++)
                        progBar += "▓";
                    progBar += c1;
                    var numRemaining = this.progressBarLength-numNormalized;
                    for(var i = 0; i < numRemaining; i++){
                        progBar += "▒";
                    }
                    return c1Copy + "▐" + c2 + progBar + c1Copy + "▌";
                },
                IsLowerCase: function IsLowerCase(char) {
                    return /^[a-z]$/.test(char);
                },
            },
            {
                /* Theme by Livinshadow - from "On Garde" */
                ID: "ONGARDE",
                attributes: [
                    {
                        ID: "attackDamage",
                        Get: function Get(num) {
                            return "§6 ┃ §8STR§6  » §8§l" + num; //✟
                        }
                    },
                    {
                        ID: "maxHealth",
                        Get: function Get(num) {
                            return "§6 ┃ §6VIT§6§l  §6» §6§l" + (num * .5); // in hearts
                        }
                    },
                    {
                        ID: "movementSpeed",
                        Get: function Get(num) {
                            return "§6 ┃ §8MOV§6  » §8§l" + (num * 10); // spd * 10 looks better
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(num) {
                            var spd;
                            if (num <= -3.5) spd = 0; // questionable life choices
                            else if (num <= -3) spd = 1; // axe
                            else if (num <= -2.4) spd = 2; // normal sword
                            else if (num <= -1) spd = 3; // dagger
                            else if (num <= 50) spd = 4; // almost no hit delay
                            else spd = "∞"; // 5
                            return "§6 ┃ §7SPD§6  » §7§l" + spd;
                        }
                    },
                ],
                GetUnbreakable: function GetUnbreakable() {
                    // return "§6Unbreakable";
                    return "§6 ┃ §4UNB";
                },
                GetName: function GetName(name) {
                    var isProbablyWeapon = false;
                    var isArmor = BItemRenamer.P.config.tagItemType == "ARMOR";
                    var isTrinket = BItemRenamer.P.config.tagItemType == "TRINKET";

                    if (BItemRenamer.P.config.attributes.length > 0 && BItemRenamer.P.config.attributesEnabled) {
                        for (var i = 0; i < BItemRenamer.P.config.attributes.length; i++) {
                            if (BItemRenamer.P.config.attributes[i].Name == "attackDamage" && BItemRenamer.P.config.attributes[i].Amount > 1) {
                                isProbablyWeapon = true;
                            }
                        }
                    } if (isProbablyWeapon) {
                        return "§7✠ " + name + "§7 ✠";
                    } else if (isArmor) {
                        return "§7✠ " + name + "§7 ✠";
                    } else if (isTrinket) {
                        return "§6✝ §8§l" + name + "§6 ✝";
                    } else {
                        return "§6✞ §8§l" + name + "§6 ✞";
                        // return name.length < 5 || name[4] == "§7✠" || name[3] == "§7✠" ? "§7" + name : "§7✠ " + name + " §7✠"
                    }
                },
                GetRarityLore: function GetRarityLore(rarity, itemTypeLore) {
                    var rarityName = "";
                    switch (rarity) {
                        case 'C':
                            rarityName = "§2 ►§o Hayseed"
                            break;
                        case 'U':
                            rarityName = "§b ►§o Garde";
                            break;
                        case 'R':
                            rarityName = "§6 ►§o Royal";
                            break;
                        case 'L':
                            rarityName = "§4 ►§l§o Heirloom";
                            break
                    }
                    return rarityName + " " + itemTypeLore
                },
                GetItemTypeLore: function GetItemTypeLore(itemTypeTag) {
                    var itemTypeStr = "";
                    switch (itemTypeTag) {
                        case "TRINKET":
                            itemTypeStr = "§4 [§c TALISMAN §4]";
                            break;
                        case "CONSUMABLE":
                            itemTypeStr = "§6 [§e FOOD §6]";
                            break;
                        case "OUTFIT":
                            itemTypeStr = "§f [§5 Outfit §f]";
                            break;
                        case "GIFT":
                            itemTypeStr = "§f [§e Gift §f]";
                            break;
                        case "CARD":
                            itemTypeStr = "§8 [§f Card §8]";
                            break;
                        case "LIGHTKNIFE":
                            itemTypeStr = "§6 [§e §b [§f Light Knife §b]";
                            break;
                        case "KNIFE":
                            itemTypeStr = "§f [§e Knife §f]";
                            break;
                        case "SWORD":
                            itemTypeStr = "§f [§8 Sword §f]";
                            break;
                        case "AXE":
                            itemTypeStr = "§7 [§8 Axe §7]";
                            break;
                        case "GREATBLADE":
                            itemTypeStr = "§7 [§4 Greatblade §7]";
                            break;
                        case "BOW":
                            itemTypeStr = "§8 [§2 Bow §8]";
                            break;
                        case "LANCE":
                            itemTypeStr = "§8 [§3 Lance §8]";
                            break;
                        case "WAND":
                            itemTypeStr = "§d [§5 Wand §d]";
                            break;
                        default:
                            throw ("\nThe heck is this? ---> " + itemTypeTag + " ???\nSorry, but the item type '" + itemTypeTag + "' is not part of the ONGARDE theme."
                                + "\n 1. go to BItemRenamer.Themes\n 2. find the 'ONGARDE' theme\n 3. and add the new item type '" + itemTypeTag + "' to the GetItemTypeLore() function.\n\n")
                    }
                    return itemTypeStr;
                },
                GetDescriptionLore: function GetDescriptionLore(loreLine) {
                    return "§7 " + loreLine;
                },
                GetEffectSlot: function GetEffectSlot(slot) {
                    if (slot == 'O')
                        return "§cWhen in off hand:";
                    else if(slot == 'M')
                        if (BItemRenamer.P.config.tagItemType == "CONSUMABLE")
                            return "§4[§fRHT▬CLK§4]";
                        else
                            return "§cWhen in main hand:";
                    return "";
                },
                GetEffectLore: function GetEffectLore(loreLine) {
                    return "§6 ┃§8 " + loreLine;
                },
                GetBlankAttributeLoreLine: function GetBlankAttributeLoreLine() {
                    if (BItemRenamer.P.config.lore.length > 0)
                        return "";
                    else
                        return "§6 ┃";
                },
                GetAttributeSlot: function GetAttributeSlot(slot) {
                    var hasAttributes = BItemRenamer.P.config.attributes.list.length > 0 && BItemRenamer.P.config.attributes.enabled;
                    if (slot == 'M' && hasAttributes)
                        return "§cWhen in main hand:";
                    else
                        return "§6 ┃§c ⫘⫘⫘⫘⫘⫘⫘⫘";
                },
                GetFakeAttributeLore: function GetFakeAttributeLore(loreLine) {
                    return "§6 ┃§8 " + loreLine;
                },
            },
            {
                /* A very boring theme */
                ID: "EXAMPLE",
                attributes: [
                    {
                        ID: "movementSpeed",
                        Get: function Get(amount){
                            var prefix = amount > 0 ? "§b +" : "§3 ";
                            return prefix + amount + " Speed";
                        }
                    },
                    {
                        ID: "attackDamage",
                        Get: function Get(amount){
                            var prefix = amount > 0 ? "§b +" : "§3 ";
                            return prefix + amount + " Attack Damage";
                        }
                    },
                    {
                        ID: "attackSpeed",
                        Get: function Get(amount){
                            var prefix = amount > 0 ? "§b +" : "§3 ";
                            return prefix + amount + " Attack Speed";
                        }
                    },
                ],
            }
        ]
    }
}());

/* This is an item script, automatically call hooks (this is not a SAL script!!!) */
function init(e){ BItemRenamer.Init(e); } 
function interact(e){ BItemRenamer.Interact(e); } 
function attack(e){ BItemRenamer.Attack(e); }



// Example Config Below, paste on a scripted-item in-game:

// /* Better Item Renamer (v6)  -  Right-Click Use, Left-Click Change Mode */
// var config = {
//     name: "Bird Seed",
//     lore: [
//         "Main lore description here"
//     ],

//     /* Create New */
//     ID: "minecraft:pumpkin_seeds", dmgValue: 0, unbreakable: false, hideUnbreakable: false,
//     skull: "",
//     rarity: 'c', /* C U R L E*/ slot: 'o',  /* M O F L C H */
//     tag: "BIRDFOOD", tagGroupID: "SEAOFDIE", tagItemType: "TRINKET", scripted: true, tagsBonus: [],
//     effectLore: [
//         "Befriends Nearby Fowl,",
//         "as a bird in the hand",
//         "is useless if you have",
//         "to blow your nose.",
//         "",
//         "&oAlso works on bats.",
//     ],
//     attributes: {
//         enabled: false, hide: false, list: [
//             { Slot: "mainhand", Amount: -2.4, Name: "attackSpeed" },
//             { Slot: "mainhand", Amount: 8, Name: "attackDamage" },
//         ],
//         lore: [

//         ]
//     },
//     enchantments: {
//         enabled: false, hide: false, list: [
//             { ID: 34, Lvl: 1 },
//         ]
//     }, hideFlagOverride: -1, color: "",

//     /* CreateFromDigitized - Paste Digitized Trinket here to make it*/
//     digitizedTrinketOverride: "",
//     version: 6,
// }