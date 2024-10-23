/* v4.0.2 - Better Item Renamer | ItemScript | Minecraft 1.12.2 (05Jul20) | Written by Rimscar
 * Requires: StandardUtil12, DigitalTrinkets12 [2.0+]
 *
 * Supports BItemRenamer config versions [1.4 -> 4.0+]
 * 
 * Right-Click Use, Left-Click Change Mode
 */

var BItemRenamer = (function(){
    return {

        Init: function Init(e, OPTIONAL_config){ BItemRenamer.P.Init(e, OPTIONAL_config); },
        Interact: function Interact(e){ BItemRenamer.P.Interact(e); },
        Attack: function Attack(e){ BItemRenamer.P.Attack(e); },
        GetGroupIDs: function GetGroupIDs(){ return this.P.validGroupIDs; },

        /* (OPTIONAL) CUSTOM EVENT: OnInit() <---- Name a function OnReset and it will be called after BItemRename.init */
        /* (OPTIONAL) CUSTOM EVENT: OnInteract() <---- Name a function OnTargetFound and it will be called after BItemRename.interact */
        /* (OPTIONAL) CUSTOM EVENT: OnAttack() <---- Name a function OnTargetFound and it will be called after BItemRename.attack */

        P: {
            /* Set to "" if you don't want a custom theme */
            theme: "",

            /* MAP CONFIG */
            debugDigitizer: false,
            sayCreateCommandInChat: false,
            hideWarnings: false,
            hideAttackSpeedLore: false,
            convertLegacyItems: false,

            /* These should be consistant across all the maps you make (not just the current one) */
            validGroupIDs: [ 
                // TRINKETS / WEAPONS
                "METALWEAPON", "ARCLENS", "TROPIC3", "ICE2", "MW", "MW5", "DGWS", "LITC",

                // ARMOR
                "ARMOR1",

                // OTHER
                "TELEPORTER", "MAINHAND1",

                // ORBS
                "TROPICORB", "CROWORB", "ICEORB",

                // GADGETS
                "MW5Gadget",

                // DEPRECATED
                "METALWEAPONO",

                // Online-Related
                "DAILY", "ACHIEVEMENT", "DLC"
             ],

            /* Item Types - Suffix appended to the first line of the lore description (if config has matching tagItemType) */
            itemTypes: [
                { TAG: "TRINKET", LORE: " §c[Trinket]" },
                { TAG: "ORB", LORE: " §b[Orb]" },
                { TAG: "LENS", LORE: " §e[Lens]" },
            ],

/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ------------------------------------------------------- DO NOT TOUCH ------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------------------------------------------------------- */

            config: null,
            libKey: "BIR_lib",

            /* The SCRIPTED and an (OFFHAND or MAINHAND) tag is REQUIRED for use with Better Trinkets */
            tagScripted: "SCRIPTED",
            tagMainHand: "MAINHAND",
            tagOffHand: "OFFHAND",

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
                this.VerifyConfigIntegrity(this.config);

                // HACK: We can't grab e.player from init
                var world = e.API.getIWorlds()[0];

                var libraries = typeof Utilities != 'undefined' && typeof DigitalTrinkets12 != 'undefined';

                // This is an item script. Efficiency doesn't matter. Just try loading them automatically.
                if (!libraries){
                    this.TryLoad("StandardUtil12.js");
                    this.TryLoad("FUtil.js");
                    this.TryLoad("DigitalTrinkets12.js");
                }
                
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
                    OnInit(e);
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
                    OnInteract(e);
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
                    OnAttack(e);
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
                        e.item.setCustomName("§b[§3§l" + this.configVersion + "§b] §6New Trinket Creator: " + this.config.name.replaceAll('&', '§'));
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
                    if (this.config.tagItemType == this.itemTypes[i].TAG){
                        itemTypeLore = this.itemTypes[i].LORE;
                        break;
                    }
                }
                
                var hasRarity = this.config.rarity != '' && this.config.rarity != ' ';
                if (hasRarity){
                    switch(this.config.rarity.toUpperCase()){
                        case 'C':
                            rarityTag = "COMMON";
                            firstLineLore = "§a§o* Common" + itemTypeLore;
                            break;
                        case 'U':
                            rarityTag = "UNCOMMON";
                            firstLineLore = "§2§o* Uncommon" + itemTypeLore;
                            break;
                        case 'R':
                            rarityTag = "RARE";
                            firstLineLore = "§d§o* Rare" + itemTypeLore;
                            break;
                        case 'L':
                            rarityTag = "LEGENDARY";
                            firstLineLore = "§6§l§o* Legendary" + itemTypeLore;
                            break
                        case 'E':
                            rarityTag = "EXOTIC";
                            firstLineLore = "§4§l§o* §4§l§oEXOTIC" + itemTypeLore;
                            break;
                        default:
                            this.Error(e, "Invalid Rarity! Rarity must be C, U, R, L, or E\nGod, were you born yesterday? It's not that hard!");
                    }
                }
                else if (this.config.tagItemType != "") {
                    this.Error(e, "Hey dumbass! \nYou cannot leave the Rarity blank if you're going to use the " + this.config.tagItemType + " item type.\n\nEither Change the Config.tagItemType to ' ' empty or add a rarity value. Rarity values must be either C, U, R, L, or E");
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
                if (this.config.attributes.length > 0 && this.config.attributesEnabled){
                    for(var i = 0; i < this.config.attributes.length; i++){
                        switch(this.config.attributes[i].Slot){
                            case "offhand":
                            case "mainhand":
                            case "head":
                            case "chest":
                            case "legs":
                            case "feet":
                                break;
                            default:
                                this.Error(e, "Bad Attribute slot! " + this.config.attributes[i].Slot + " is not a valid slot!");
                        }
            
                        switch(this.config.attributes[i].Name){
                            case "maxHealth":
                            case "followRange":
                            case "knockbackResistance":
                            case "movementSpeed":
                            case "attackDamage":
                            case "attackSpeed":
                                break;
                            default:
                                this.Error(e, "Bad Attribute name! " + this.config.attributes[i].Name + " is not a valid name!");
                        }
            
                        // Add the generic keyword
                        var newAttribute = {
                            Amount: this.config.attributes[i].Amount,
                            Slot: this.config.attributes[i].Slot,
                            Name: "generic." + this.config.attributes[i].Name,
                        }
                        newAttributesArray.push(newAttribute);
                    }

                    // Automatically Hide Attributes
                    hideFlagsTag += 2;
                }
                var hasSlotTag = this.config.slot != '' && this.config.slot != ' ';
                if (this.configVersion < 2 && !this.convertLegacyItems){
                    hasSlotTag = false;
                }
                var handTag = "";
                if (hasSlotTag){
                    if (this.config.slot.toUpperCase() == 'M') handTag = this.tagMainHand;
                    else if (this.config.slot.toUpperCase() == 'O') handTag = this.tagOffHand;
                    else this.Error(e, "Bad slot name, idiot! " + this.config.slot + " is not a valid slot name! Valid names include: O, M\n*hmph*... what WOULD you do without me...");
                }
                if (this.config.unbreakable)
                    hideFlagsTag += 4;
                if (this.config.hasOwnProperty('enchantments') && this.config.enchantments.hide){
                    hideFlagsTag += 1;
                }
                
                // Apply Tags
                tagString += this.config.tagItemType != "" ? tagString += this.config.tagItemType + ":1b" : "NULL";
                if (rarityTag != "") tagString += "," + rarityTag + ":1b";
                if (this.config.unbreakable) tagString += ",Unbreakable:1";
                var tagGroupIDExtension = this.config.tagItemType == "ORB" && !this.convertLegacyItems ? "ORB" : ""; // [NOTE] Legacy Support
                if (this.config.tagGroupID != "") tagString += "," + this.config.tagGroupID + tagGroupIDExtension + ":1b";
                if (this.config.tag != "") tagString += "," + this.config.tag + ":1b";
                for(var i = 0; i < this.config.tagsBonus.length; i++)
                    tagString += "," + this.config.tagsBonus[i] + ":1b";
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
                tagString = tagString.replaceAll('NULL,','');
                tagString = tagString.replaceAll('NULL','');
            
                var newLore = [];
                if (firstLineLore != "") newLore.push(firstLineLore);
                if (this.config.lore.length > 0 && (this.config.tagItemType != "" || rarityTag != ""))
                    newLore.push("§7");
                for(var i = 0; i < this.config.lore.length; i++)
                    newLore.push(this.config.lore[i].replaceAll('&', '§'));
                
                // Only add attributes if a slot was specified -- (or if the item is not scripted at all)
                if (hasSlotTag || !this.config.scripted){
                    var useFakeAttributeLore = hideFlagsTag != 0 && this.config.attributesEnabled;
                    if (this.config.attributeLore.length > 0 || useFakeAttributeLore){
                        newLore.push("§7");
                        var attributeSlotLore = this.ThematicMan.GetSlotLore(this.config.slot);
                        if (attributeSlotLore != ""){
                            newLore.push(this.ThematicMan.GetSlotLore(this.config.slot));
                        }
                    }
                    for(var i = 0; i < this.config.attributeLore.length; i++)
                        newLore.push(this.config.attributeLore[i].replaceAll('&', '§'));

                    if (useFakeAttributeLore){
                        for(var i = 0; i < this.config.attributes.length; i++){
                            var loreLine = this.ThematicMan.GetAttributeLore(this.config.attributes[i].Name, this.config.attributes[i].Amount);
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
                if (this.config.unbreakable){
                    newLore.push(this.ThematicMan.GetUnbreakableLore());
                }

                this.MakeItemEntity(e, this.ThematicMan.GetName(this.config.name.replaceAll('&', '§')), newLore, this.config.ID, dmgValue, tagString, newAttributesArray);
                this.Message(e, "c", "Taadaa!~ Item Created: " + this.config.name.replaceAll('&', '§'));
            },

            MakeItemEntity: function MakeItemEntity(e, newName, newLore, itemID, dmgValue, tagString, attributeArray){
                // We cannot use createItem b/c it does not support custom tags
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

                // LEGACY SUPPORT [Tested with config v1.4 and v1.8]
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
                    conf.scripted = this.convertLegacyItems ? true : false;

                    if (conf.dmgValue == null){
                        conf.dmgValue = 0;
                    }
                    this.debugDigitizer = conf.debugDigitizer;
                    if (conf.validIDs != null && !this.convertLegacyItems){
                        for(var i = 0; i < conf.validIDs.length; i++){
                            this.validGroupIDs.push(conf.validIDs[i]);
                        }
                    }
                }

                // Requirements for CONFIG v2.0+
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
                if (conf.attributeLore == null)
                    this.GlobalError("config.attributeLore was null - needs a attributeLore [list string] parameter\n\nExample:\n [\"+1 Super Attack DMG\"],[\"-2 &6Super Speed\"]"
                    + "\nLeave empty string ' ' to have no attribute lore (like atk dmg, etc...)");
                if (conf.attributesEnabled == null)
                    this.GlobalError("config.attributesEnabled was null - needs a attributesEnabled [boolean] ID\n\nExample:\n false or true");
                if (conf.attributes == null)
                    this.GlobalError("config.attributes was null - needs a attributes [obj] ID\n\nExample:\n\n" + "attributes: [\n" + 
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
                if (conf.digitizedTrinketOverride == null)
                    this.GlobalError("config.digitizedTrinketOverride was null - needs a digitizedTrinketOverride [string] parameter\n" 
                    + "\n\nExample: Leave empty string ' ' to avoid using an override" +
                    "\nOR this parameter takes a digital trinket string (see: DigitalTrinkets12) and manufactures it using the \"Create From Digitized\" mode");
                
                // Requirements for CONFIG v4.0+
                if (this.configVersion >= 4){
                    if (conf.enchantments == null)
                        this.GlobalError("config.attributes was null - needs a attributes [obj] ID\n\nExample:\n\n" + "enchantments: { enabled: false, hide: true, list: [\n" + 
                        "{ ID: 10, Lvl: 1 }, \n" + "],");
                    if (conf.hideFlagOverride == null)
                        this.GlobalError("config.hideFlagOverride was null - needs a hideFlagOverride [int] parameter\n\nExample:\n -1\nEntering -1 disables this override\n"
                        + "using 62 for example overrides the automatic hideflags engine with 62... in case you want to set things manually");
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
                GetAttributeLore: function GetAttributeLore(name, amount){ return this.P.GetAttribute(name, amount); },
                GetUnbreakableLore: function GetUnbreakableLore(){ return this.P.GetUnbreakable(); },
                GetSlotLore: function GetSlotLore(slot){ return this.P.GetSlot(slot); },
                
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
                                if (this.hideAttackSpeedLore)
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
                    GetSlot: function GetSlot(slot){
                        try{
                            var theme = this.GetTheme(BItemRenamer.P.theme);
                            if (theme != null && theme.hasOwnProperty('GetSlot')){
                                return theme.GetSlot(slot);
                            }
                        }
                        catch(ex) {
                            throw("Theme Error in theme " + BItemRenamer.P.theme + "\nin theme.GetSlot(slot)\n\n" + ex);
                        }
                        
                        if (slot == 'O')
                            return "§7When in off hand:";
                        else
                            return "§7When in main hand:";
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
                    if (BItemRenamer.P.config.attributes.length > 0 && BItemRenamer.P.config.attributesEnabled){
                        for(var i = 0; i < BItemRenamer.P.config.attributes.length; i++){
                            if (BItemRenamer.P.config.attributes[i].Name == "attackDamage" && BItemRenamer.P.config.attributes[i].Amount > 1){
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
                    if (BItemRenamer.P.config.attributes.length > 0 && BItemRenamer.P.config.attributesEnabled){
                        for(var i = 0; i < BItemRenamer.P.config.attributes.length; i++){
                            if (BItemRenamer.P.config.attributes[i].Name == "attackDamage" && BItemRenamer.P.config.attributes[i].Amount > 1){
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
                            return prefix + atkAmount + " Attack Damage";
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

/* Auto-Load */
function init(e){ BItemRenamer.Init(e); } 
function interact(e){ BItemRenamer.Interact(e); } 
function attack(e){ BItemRenamer.Attack(e); }