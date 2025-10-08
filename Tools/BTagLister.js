/* v2.2 - Better Tag Lister | ItemScript | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Right-Click to list tags of: ( nearby ground items + offhand item )
 */
var BTagLister = {

    Init: function Init(e) { BTagLister.P.Init(e); },
    Interact: function Interact(e) { BTagLister.P.Interact(e); },

    printAllJson: false,
    printAttributes: false,
    showUselessTags: false,

    smartPrint: true,
    printInColor: true,
    range: 10,

    P: {
        Init: function Init(e){
            e.item.setCustomName("§3§l[TAG] §f§lLister §3[§b§l2§3]");
            e.item.setTexture(347, "minecraft:clock");
            e.item.setItemDamage(347);
            e.item.setDurabilityShow(false);
            e.item.setMaxStackSize(1);

            // If OnInit & OnInteract hooks exist... go ahead and load BItemRename
            // This is required b/c BItemRename overrides the init/interact functions
            if (typeof OnInit === "function" && typeof OnInteract === "function"){

                // Load BItemRenamer's Group ID list (if the file exists)
                this.TryLoad("BItemRenamer.js");
                if (typeof BItemRenamer != 'undefined'){
                    this.groupIDs = BItemRenamer.GetGroupIDs();
                }
            }
        },

        Interact: function Interact(e){
            var offhand = e.player.getOffhandItem();
            if (offhand != null && offhand.getName() != "minecraft:air"){
                this.ListItemTags(e.API, e.player, offhand)
            }
            else{
                this.ListNearbyItemTags(e.API, e.player);
            }
        },

        ListNearbyItemTags: function ListNearbyItemTags(API, player){
            var atleastOneSuccess = false;
            var ni = player.world.getNearbyEntities(player.pos, BTagLister.range, 6);
            if (ni.length != 0){
                for(var i = 0; i < ni.length; i++){
                    if (this.ListItemTags(API, player, ni[i].item)){
                        atleastOneSuccess = true;
                    }
                }
            }
            if (!atleastOneSuccess)
                player.playSound("minecraft:entity.item.break", 1, 1);
        },

        ListItemTags: function ListItemTags(API, player, itemstack){
            // Cannot read JSON of scripted items
            if (itemstack.getName() == "customnpcs:scripted_item"){
                player.world.broadcast("Cannot read tag of scripted item!");
                return false;
            }

            var invalidJSON = itemstack.getItemNbt().toJsonString()
            var validJSON = invalidJSON.replaceAll(": [ ]*([\\w@\\.-]+)", ": \"$1\"");

            // Print before parsing, in case we run into an error
            if (BTagLister.printAllJson) player.world.broadcast(validJSON);

            var obj = JSON.parse(validJSON);
            if (obj.tag != null){
                var tagStr = Object.keys(obj.tag).toString();
                var recoloredStr = BTagLister.printInColor ? this.GetColorString(tagStr) : tagStr;

                if (BTagLister.smartPrint){
                    this.SmartPrint(API, player, tagStr, obj, itemstack);
                }
                else{
                    this.Message(API, player, recoloredStr);
                }
                return true;
            }
            return false;
        },

        GetColorString: function GetColorString(tagStr){
            var tagArray = tagStr.split(',');
            var newTagStr = "";
            for(var i = 0; i < tagArray.length; i++){
                if (!BTagLister.showUselessTags){
                    switch(tagArray[i]){
                        case "AttributeModifiers":
                        case "display":
                        case "HideFlags":
                        case "SkullOwner":
                        case "ench":
                            continue;
                    }
                }
                newTagStr += this.GetColorTag(tagArray[i]) + "§7,";
            }
            if (newTagStr.length > 0)
                newTagStr = newTagStr.substring(0, newTagStr.length-1);
            return newTagStr;
        },

        GetColorTag: function GetColorTag(tag){
            var color = "";
            switch(tag){
                case "Unbreakable": // -- MC Tags
                    color = "§9"
                    break;
                case "AttributeModifiers":
                case "display":
                case "HideFlags":
                case "SkullOwner":
                case "ench":
                case "CanPlaceOn":
                case "CanDestroy":
                    color = "§8";
                    break;
                case "SCRIPTED": // --- Important
                    color = "§e§l"
                    break;
                case "DLC":
                    color = "§6§l"
                    break;
                case "MAINHAND":
                case "OFFHAND":
                case "ARMOR":
                case "FEET":
                case "LEGS":
                case "CHEST":
                case "HEAD":
                    color = "§e"
                    break;
                case "FOOD":
                    color = "§2"
                    break;
                case "DAILY":
                case "ACHIEVEMENT":
                    color = "§6"
                    break;
                case "CONSUMABLE":
                case "TRINKET": // --- Rarity-Related
                    color = "§2"
                    break;
                case "ORB":
                    color = "§9"
                    break;
                case "LENS":
                    color = "§6"
                    break;
                case "T0":
                case "T1":
                case "T2":
                case "T3":
                case "T4":
                    color = "§3";
                    break;
                case "COMMON":
                    color = "§a§o";
                    break;
                case "UNCOMMON":
                    color = "§2§o";
                    break;
                case "RARE":
                    color = "§d§o";
                    break;
                case "LEGENDARY":
                    color = "§6§o";
                    break;
                case "EXOTIC":
                    color = "§4§o";
                    break;
                default:
                    color = "§f";
                    break;
            }
            for(var j = 0; j < this.groupIDs.length; j++){
                if (tag == this.groupIDs[j]){
                    color = "§e";
                }
            }
            return color + tag;
        },
    
        SmartPrint: function SmartPrint(API, player, tagStr, tagObj, itemstack){
            var tagArray = tagStr.split(',');
        
            var numTags = tagArray.length;
            var scripted = "";
            var slots = [];
            var groupIDs = [];
            var itemTypes = [];
            var dlc = "";
            var dlcTags = [];
            var rarityTags = [];
            var rarityArmorTags = [];
            var dataTags = [];
            var unbreakable = "";
            var canDestroy = "";
            var canPlace = "";
            var uselessTags = [];
            var unknownTags = [];
            
            for(var i = 0; i < tagArray.length; i++){
                var tag = tagArray[i];

                var foundGroupID = false;
                for(var j = 0; j < this.groupIDs.length; j++){
                    if (tag == this.groupIDs[j]){
                        groupIDs.push(tag);
                        foundGroupID = true;
                    }
                }
                if (foundGroupID){
                    continue;
                }

                var foundItemType = false;
                for(var j = 0; j < this.itemTypes.length; j++){
                    if (tag == this.itemTypes[j]){
                        itemTypes.push(tag);
                        foundItemType = true;
                    }
                }
                if (foundItemType){
                    continue;
                }

                switch(tag){
                    case "Unbreakable":
                        unbreakable = tag;
                        break;
                    case "AttributeModifiers":
                    case "display":
                    case "HideFlags":
                    case "SkullOwner":
                    case "ench":
                        uselessTags.push(tag);
                        break;
                    case "CanDestroy":
                        canDestroy = tag;
                        break;
                    case "CanPlaceOn":
                        canPlace = tag;
                        break;
                    case "SCRIPTED":
                        scripted = tag;
                        break;
                    case "DLC":
                        dlc = tag;
                        break;
                    case "DAILY":
                    case "ACHIEVEMENT":
                        dlcTags.push(tag);
                        break;
                    case "MAINHAND":
                    case "OFFHAND":
                    case "FEET":
                    case "LEGS":
                    case "CHEST":
                    case "HEAD":
                    case "FOOD":
                        slots.push(tag);
                        break;
                    case "T0":
                    case "T1":
                    case "T2":
                    case "T3":
                    case "T4":
                        rarityArmorTags.push(tag);
                        break;
                    case "COMMON":
                    case "UNCOMMON":
                    case "RARE":
                    case "LEGENDARY":
                    case "EXOTIC":
                        rarityTags.push(tag);
                        break;
                    default:
                        if (tagObj.tag.hasOwnProperty(tag))
                            dataTags.push(tag);
                        else
                            unknownTags.push(tag);
                        break;
                }
            }

            var lines = [];

            // number of tags
            var numTagStr = BTagLister.showUselessTags || uselessTags.length == 0
                ? "§2§l" + numTags + "§7 Tags§8] §8- - - - - - - - - - - - - - -" 
                : "§2§l" + numTags + "§7 Tags » §2§l" + (numTags-uselessTags.length) + "§7 Shown§8] §8- - - - - - - - - -";
            lines.push("§8- §8[" + numTagStr);

            // Categorization (SCRIPTED / SLOT / Category / ItemType)
            var line = "";
            if (scripted != "")
                line += this.GetColorTag(scripted) + " ";
            for(var i = 0; i < slots.length; i++){
                line += this.GetColorTag(slots[i]) + " ";
            }
            for(var i = 0; i < groupIDs.length; i++){
                line += this.GetColorTag(groupIDs[i]) + " ";
            }
            if (line != "") 
                lines.push(line);

            // DLC
            var line = "";
            if (dlc != "")
                line += this.GetColorTag(dlc) + " ";
            for(var i = 0; i < dlcTags.length; i++){
                line += this.GetColorTag(dlcTags[i]) + " ";
            }
            if (line != "") 
                lines.push(line);

            // RARITY 
            var line = "";
            for(var i = 0; i < itemTypes.length; i++){
                line += this.GetColorTag(itemTypes[i]) + " ";
            }
            for(var i = 0; i < rarityTags.length; i++){
                line += this.GetColorTag(rarityTags[i]) + " ";
            }
            for(var i = 0; i < rarityArmorTags.length; i++){
                line += this.GetColorTag(rarityArmorTags[i]) + " ";
            }
            if (line != "") 
                lines.push(line);

            // DATA TAGS -- AKA: probably what we're even using the Taglister for in the first place
            var line = "§b";
            for(var i = 0; i < dataTags.length; i++){
                line += dataTags[i] + " ";
            }
            if (line != "§b") 
                lines.push(line);

            // MC Tags - Important
            var line = "";
            if (unbreakable != "")
                line += this.GetColorTag(unbreakable);
            if (canDestroy != "")
                line += this.GetColorTag(canDestroy);
            if (canPlace != "")
                line += this.GetColorTag(canPlace);
            if (line != "") 
                lines.push(line);

            // MC Tags - "Useless"
            if (BTagLister.showUselessTags){
                var line = "";
                for(var i = 0; i < uselessTags.length; i++){
                    line += this.GetColorTag(uselessTags[i]) + " ";
                }
                if (line != "") 
                    lines.push(line);
            }

            // UNKNOWN TAGS
            var line = "";
            for(var i = 0; i < unknownTags.length; i++){
                line += this.GetColorTag(unknownTags[i]) + " ";
            }
            if (line != "") 
                lines.push(line);
            
            // PRINT attributes
            if (BTagLister.printAttributes){
                if (tagObj.tag.AttributeModifiers != null){
                    if (tagObj.tag.AttributeModifiers.length > 0){
                        lines.push("§3[Attribute Modifiers]")
                    }
                    for(var i = 0; i < tagObj.tag.AttributeModifiers.length; i++){
                        var attributeName = "";
                        var line = tagObj.tag.AttributeModifiers[i].AttributeName + " §8| §7" +  + " §8| §7" + tagObj.tag.AttributeModifiers[i].Slot;
                        switch(tagObj.tag.AttributeModifiers[i].AttributeName){
                            case "generic.maxHealth":
                                attributeName = "§9Max Health";
                                break;
                            case "generic.knockbackResistance":
                                attributeName = "§9Knockback Resist"
                                break;
                            case "generic.movementSpeed":
                                attributeName = "§9Movement Speed"
                                break;
                            case "generic.attackDamage":
                                attributeName = "§9Attack Damage"
                                break;
                            case "generic.attackSpeed":
                                attributeName = "§9Attack Speed"
                                break;
                            default:
                                attributeName = "§3" + tagObj.tag.AttributeModifiers[i].AttributeName;
                                break;
                        }

                        var attributeAmount = tagObj.tag.AttributeModifiers[i].Amount;
                        if (attributeAmount[attributeAmount.length-1] == 'd'){
                            attributeAmount = attributeAmount.substring(0, attributeAmount.length-1);
                        }
                        if (attributeAmount[0] != '-' && (attributeAmount[0] != '0' || (attributeAmount[0] == '0' && attributeAmount.length > 1))){
                            attributeAmount = "+" + attributeAmount;
                        }

                        var attributeSlotColor = "";
                        switch(tagObj.tag.AttributeModifiers[i].Slot){
                            case "head":
                            case "chest":
                            case "legs":
                            case "feet":
                                attributeSlotColor = "§a";
                                break;
                            case "mainhand":
                            case "offhand":
                                attributeSlotColor = "§e";
                                break;
                            default:
                                attributeSlotColor = "§c";
                                break;
                        }
                        lines.push(attributeName + " §6" + attributeAmount + " §8» " + attributeSlotColor + tagObj.tag.AttributeModifiers[i].Slot);
                    }
                }
            }

            // START ---- ERROR CHECKS
            var errorPrefix = "§c[§4§lERROR§c] ";
            var warningPrefix = "§e[§6§lWARNING§e] ";

            if (scripted != ""){
                if (slots.length == 0 && (!itemstack.isWearable() || (itemstack.isWearable() && itemstack.getName() == "minecraft:skull"))){
                    lines.push(errorPrefix + "Item missing a slot\n§cNeeds a §eMAINHAND§c or §eOFFHAND§c tag");
                }
                if (groupIDs.length == 0){
                    lines.push(errorPrefix + "Item missing a groupID\n§cNeeds a groupID tag to specify the trinket list we're loading\n§cFor example: §eORBS_TROPIC§c or §eITEMS_MW_MAINHAND");
                }
                if (dataTags.length == 0){
                    lines.push(errorPrefix + "Item missing a unique tag\n§cA unique tag is required for this BTrinket to work as intended\n§cFor example: §eGUN§c or §eEXPLOSIONORB");
                }
            }
            else{
                var hasTag = "";
                if (slots.length > 0){
                    hasTag = slots[0];
                }
                if (groupIDs.length > 0){
                    hasTag = groupIDs[0];
                }
                if (hasTag != "")
                    lines.push(warningPrefix + "Tag §6" + hasTag + "§e found even though this\n§eis §lNOT§e a BTrinket (Better Trinket)\n§eDid you forget to add the §6SCRIPTED §etag?");
            }
            if (groupIDs.length > 1){
                var tagStr2 = "";
                for(var i = 0; i < groupIDs.length; i++){
                    tagStr2 += this.GetColorTag(groupIDs[i]) + " ";
                }
                lines.push(errorPrefix + "Item has more than one groupID\n§cThis is  §lNOT§c allowed! " + tagStr2);
            }
            if (itemTypes.length > 1){
                var tagStr3 = "";
                for(var i = 0; i < itemTypes.length; i++){
                    tagStr3 += this.GetColorTag(itemTypes[i]) + " ";
                }
                lines.push(errorPrefix + "Item has more than one itemType\n§cThis is §lNOT§c allowed! " + tagStr3);
            }
            // END ---- ERROR CHECKS

            // Begin Print
            for(var i = 0; i < lines.length; i++){
                var str = lines[i];
                var prefix = i > 0 && str[2] != "[" ? "§7 » " : "";
                this.Message(API, player, prefix + str);
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

        itemTypes: [ "TRINKET", "ORB", "LENS", "CONSUMABLE" ],
        groupIDs: [
            // TRINKETS / WEAPONS
            "METALWEAPON", "ARCLENS", "TROPIC3", "ICE2", "MW", "MW5", "DGWS", "LITC", "SEAOFDIE",

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

        Message: function Message(API, player, msg){
            API.executeCommand(player.world, "/tellraw " + player.getDisplayName() + " " + "{\"text\":\"" + msg + "\",\"color\":\"white\"}");
        }
    }
};