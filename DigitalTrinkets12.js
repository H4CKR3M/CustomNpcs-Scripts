/* v2.3 - DigitalTrinkets12 | Loadable From Anywhere | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Requires: StandardUtil12
 */

var DigitalTrinkets12 = (function(){
    return { 

        /* Converts trinket to string format, saves to tempdata & worlddata */
        Digitize: function Digitize(itemStack, OPTIONAL_bSaveItemCount){                if (OPTIONAL_bSaveItemCount == null) { OPTIONAL_bSaveItemCount = false; } 
                                                                                        return DigitalTrinkets12.P.Digitize(itemStack, "", OPTIONAL_bSaveItemCount, false); },
        DigitizeDebug: function DigitizeDebug(itemStack, key, bDebug){                  return DigitalTrinkets12.P.Digitize(itemStack, key, true, bDebug); },

        /* Gives the given digital trinket to given player */
        Give: function Give(player, digitizedString){                                   DigitalTrinkets12.P.Give(player, digitizedString); },
        Replace: function Replace(player, digitizedString, slotID, slotCategory){       DigitalTrinkets12.P.Replace(player, digitizedString, slotID, slotCategory); },
        GiveShulker: function GiveShulker(player, digitalShulker){                      DigitalTrinkets12.P.GiveShulker(player, digitalShulker); },
        Summon: function Summon(x, y, z, world, digitizedString){                       DigitalTrinkets12.P.Summon(x, y, z, world, digitizedString); },

        /* Returns digitizedString - Modifies an Attribute ('attackDamage') */
        SetAttribute: function SetAttribute(digitizedString, attributeName, num){       return DigitalTrinkets12.P.AH.SetAttribute(digitizedString, attributeName, num); },
        
        /* Returns FLOAT - Gets attribute written in item lore (if it exists). */
        GetLoreAttribute: function GetLoreAttribute(digitizedString, attributeName) {   return DigitalTrinkets12.P.AH.GetLoreAttribute(digitizedString, attributeName); },

        /* Delimiting */
        GetDelimiter: function GetDelimiter() { return DigitalTrinkets12.P.delimiter; },
        GetDataKey: function GetDataKey() { return DigitalTrinkets12.P.digitizeKey; },
        
        P: {
            
            delimiter: '@',
            delimiter2: "$",
            digitizeKey: "DIGITIZE",

            Digitize: function Digitize(itemStack, dataKey, saveCount, showDebugger){

                // Save Name []
                var exportText = itemStack.getDisplayName();
                    
                var tagsToSave = [];
                var attributesToSave = [];
                var enchantmentsToSave = [];
                var headsToSave = [];
                var hideFlags = "";
                var unbreakable = false;
                var canPlaceToSave = [];
                var canDestroyToSave = [];
                var colorCode = 0;

                if (typeof Utilities === 'undefined') { throw("\n\nDigitalTrinkets12: You forgot to load the script StandardUtil12\n\n"); }
        
                var tagObj = Utilities.GetItemTags(itemStack);
                if (tagObj != null){
                    for(var tagKey in tagObj){
                        if (tagObj.hasOwnProperty(tagKey) && tagObj[tagKey] == "1b")
                            tagsToSave.push(tagKey);
                        else if (tagKey == "AttributeModifiers"){
                            var attributes = tagObj[tagKey];
                            for(var i = 0; i < attributes.length; i++){
                                var attribute = {
                                    Amount: attributes[i].Amount.replace(/[^\d.-]/g, ''),
                                    Slot: attributes[i].Slot,
                                    Name: attributes[i].Name,
                                    UUIDMost: attributes[i].UUIDMost,
                                    UUIDLeast: attributes[i].UUIDLeast,
                                }
                                attributesToSave.push(attribute);
                            }
                        }
                        else if (tagKey == "SkullOwner"){
                            var headObj = tagObj[tagKey];
                            var headToSave = {
                                ID: headObj.Id,
                                Value: headObj.Properties.textures[0].Value,
                            }
                            headsToSave.push(headToSave);
                        }
                        else if (tagKey == "HideFlags"){
                            hideFlags = tagObj[tagKey];
                        }
                        else if (tagKey == "Unbreakable" && tagObj[tagKey] == "1"){
                            unbreakable = true;
                        }
                        else if (tagKey == "CanPlaceOn"){
                            var placeOnBlocks = tagObj[tagKey];
                            for(var i = 0; i < placeOnBlocks.length; i++){
                                canPlaceToSave.push(placeOnBlocks[i]);
                            }
                        }
                        else if (tagKey == "CanDestroy"){
                            var destroyBlocks = tagObj[tagKey];
                            for(var i = 0; i < destroyBlocks.length; i++){
                                canDestroyToSave.push(destroyBlocks[i]);
                            }
                        }
                        else if (tagKey == "display"){
                            var displayKeys = tagObj[tagKey];
                            if (displayKeys != null && displayKeys.color != null){
                                colorCode = displayKeys.color;
                            }
                        }
                        else if (tagKey == "ench"){
                            var enchantments = tagObj[tagKey];
                            for(var i = 0; i < enchantments.length; i++){
                                var enchantment = {
                                    ID: enchantments[i].id.replaceAll('s', ''),
                                    Lvl: enchantments[i].lvl.replaceAll('s', ''),
                                }
                                enchantmentsToSave.push(enchantment);
                            }
                        }
                    }
                }
        
                // Save ID [0]
                exportText += this.delimiter + "0" + itemStack.getName();
        
                // Save LORE [1]
                for(var i = 0; i < itemStack.getLore().length; i++){
                    exportText += this.delimiter + "1" + itemStack.getLore()[i];
                }
        
                // Save TAGS [2]
                for(var i = 0; i < tagsToSave.length; i++){
                    exportText += this.delimiter + "2" + tagsToSave[i];
                }
        
                // Save ATTRIBUTE [3]
                for(var i = 0; i < attributesToSave.length; i++){
                    exportText += this.delimiter + "3" + attributesToSave[i].Amount + this.delimiter2 + attributesToSave[i].Slot + this.delimiter2 
                    + attributesToSave[i].Name + this.delimiter2 + attributesToSave[i].UUIDMost + this.delimiter2 + attributesToSave[i].UUIDLeast;
                }
        
                // Save HEAD [4]
                for(var i = 0; i < headsToSave.length; i++){
                    exportText += this.delimiter + "4" + headsToSave[i].ID + this.delimiter2 + headsToSave[i].Value;
                }
        
                // Save HideFlags [5]
                if (hideFlags != ""){
                    exportText += this.delimiter + "5" + hideFlags;
                }

                // Save DAMAGE [6]
                if (itemStack.getItemDamage() != 0){
                    exportText += this.delimiter + "6" + itemStack.getItemDamage();
                }

                // Save Unbreakable Tag [7]
                if (unbreakable)
                    exportText += this.delimiter + "7" + 1;

                // Save CanPlaceOn Tag [8]
                for(var i = 0; i < canPlaceToSave.length; i++)
                    exportText += this.delimiter + "8" + canPlaceToSave[i];

                // Save CanDestroy Tag [9]
                for(var i = 0; i < canDestroyToSave.length; i++)
                    exportText += this.delimiter + "9" + canDestroyToSave[i];

                // Save CanDestroy Tag [A]
                if (colorCode != 0){
                    exportText += this.delimiter + "A" + colorCode;
                }
                // Save count [B]
                if (saveCount && itemStack.getStackSize() > 1){
                    exportText += this.delimiter + "B" + itemStack.getStackSize();
                }

                // Save ENCHANTMENT [C]
                for(var i = 0; i < enchantmentsToSave.length; i++){
                    exportText += this.delimiter + "C" + enchantmentsToSave[i].ID + this.delimiter2 + enchantmentsToSave[i].Lvl;
                }
        
                if (showDebugger) { this.PrintDigitizedTrinket(exportText); }

                // Save to storeddata / tempdata
                if (dataKey != ""){
                    var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                    API.getIWorlds()[0].getStoreddata().put(dataKey, exportText);
                    API.getIWorlds()[0].getTempdata().put(dataKey, exportText);
                }

                return exportText;
            },

            /* Returns an object with a: itemID, dmgValue, tagString */ 
            GetMCFormat: function GetMCFormat(digitizedString){
                var digitizedArray = digitizedString.split(this.delimiter);
                var customName = digitizedArray[0];
                var customLore = [];
                var colorCode = 0;
                var count = 1;
                var itemID = "NaN";
                var attributes = [];
                var enchantments = [];
                var canPlaceTags = [];
                var canDestroyTags = [];
            
                var tagString = "";
                var dmgValue = 0;
            
                // Grab tags from digitizedString
                for(var i = 1; i < digitizedArray.length; i++){
                    var digitizedLine = digitizedArray[i];
                    switch(digitizedLine[0]){
                        case "0":
                            itemID = digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "1":
                            customLore.push(digitizedLine.substring(1, digitizedLine.length));
                            break;
                        case "2":
                            var customTagString = digitizedLine.substring(1, digitizedLine.length);
                            tagString += "," + customTagString + ":1b";
                            break;
                        case "3":
                            var attributeTagString = digitizedLine.substring(1, digitizedLine.length);
                            var attributeTagArray = attributeTagString.split(this.delimiter2);
                            var attribute = {
                                Amount: attributeTagArray[0],
                                Slot: attributeTagArray[1],
                                Name: attributeTagArray[2],
                                UUIDMost: attributeTagArray[3],
                                UUIDLeast: attributeTagArray[4],
                            }
                            attributes.push(attribute);
                            break;
                        case "4":
                            var headTagString = digitizedLine.substring(1, digitizedLine.length);
                            var headTagArray = headTagString.split(this.delimiter2);
                            tagString += ",SkullOwner:{Id:\"" + headTagArray[0] + "\",Properties:{textures:[{Value:\"" + headTagArray[1] + "\"}]}}";
                            break;
                        case "5":
                            var hideFlagString = digitizedLine.substring(1, digitizedLine.length);
                            tagString += ",HideFlags:" + hideFlagString;
                            break;
                        case "6":
                            dmgValue = digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "7":
                            tagString += ",Unbreakable:" + digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "8":
                            var canPlaceTag = digitizedLine.substring(1, digitizedLine.length).split(this.delimiter2);
                            canPlaceTags.push(canPlaceTag);
                            break;
                        case "9":
                            var canDestroyTag = digitizedLine.substring(1, digitizedLine.length).split(this.delimiter2);
                            canDestroyTags.push(canDestroyTag);
                            break;
                        case "A":
                            colorCode = digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "B":
                            count = digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "C":
                            var enchantmentTagString = digitizedLine.substring(1, digitizedLine.length);
                            var enchantmentTagArray = enchantmentTagString.split(this.delimiter2);
                            var enchantment = {
                                ID: enchantmentTagArray[0],
                                Lvl: enchantmentTagArray[1],
                            }
                            enchantments.push(enchantment);
                            break;
                    }
                }
                if (customLore.length > 0 || colorCode != 0 || (customName.length > 0 && customName[0] == "§"))
                    tagString += "," + this.GetDisplayTag(customName, customLore, colorCode);

                if (attributes.length > 0)
                    tagString += "," + this.GetAttributeTag(attributes);
                
                if (enchantments.length > 0)
                    tagString += "," + this.GetEnchantmentTag(enchantments);
                
                if (canPlaceTags.length > 0)
                    tagString += "," + this.GetCanPlaceTag(canPlaceTags);

                if (canDestroyTags.length > 0)
                    tagString += "," + this.GetCanDestroyTag(canDestroyTags);

                // Remove the first comma
                if (tagString != "")
                    tagString = tagString.substring(1, tagString.length);
                
                var container = {
                    itemID: itemID,
                    dmgValue: dmgValue,
                    tagString: tagString,
                    count: count
                }
                return container;
            },

            Give: function Give(player, digitizedString){
                var c = this.GetMCFormat(digitizedString);
                this.GiveItemEntity(player, c.itemID, c.dmgValue, c.tagString, c.count);
            },

            Replace: function Replace(player, digitizedString, slotID, slotCategory){
                var c = this.GetMCFormat(digitizedString);
                this.ReplaceItemEntity(player, c.itemID, c.dmgValue, c.tagString, slotID, slotCategory, c.count);
            },

            GiveShulker: function GiveShulker(player, digitalShulker){
                var slots = [];
                for(var i = 0; i < digitalShulker.slots.length; i++){
                    var c = this.GetMCFormat(digitalShulker.slots[i].string);
                    var shulkerSlot = {
                        itemID: c.itemID,
                        dmgValue: c.dmgValue,
                        count: digitalShulker.slots[i].count,
                        tagString: c.tagString
                    };
                    slots.push(shulkerSlot);
                }
                var cShulker = this.GetMCFormat(digitalShulker.string);
                this.GiveShulkerEntity(player, cShulker.itemID, cShulker.tagString, slots);
            },

            Summon: function Summon(x, y, z, world, digitizedString){
                var c = this.GetMCFormat(digitizedString);
                this.SummonItemEntity(x, y, z, world, c.itemID, c.dmgValue, c.tagString, c.count);
            },

            PrintDigitizedTrinket: function PrintDigitizedTrinket(digitizedString){
                var digitizedArray = digitizedString.split(this.delimiter);
            
                var newName = digitizedArray[0];
                var newID = "NaN";
                var newLore = [];
                var newTags = [];
                for(var i = 1; i < digitizedArray.length; i++){
                    var digitizedLine = digitizedArray[i];
                    switch(digitizedLine[0]){
                        case "0":
                            newID = digitizedLine.substring(1, digitizedLine.length);
                            break;
                        case "1":
                            newLore.push(digitizedLine.substring(1, digitizedLine.length));
                            break;
                        case "2":
                        case "3":
                        case "4":
                        case "5":
                            newTags.push(digitizedLine.substring(1, digitizedLine.length));
                            break;
                    }
                }
                this.Broadcast(newName);
                this.Broadcast(newID);
                for(var i = 0; i < newLore.length; i++){
                    this.Broadcast(newLore[i]);
                }
                for(var i = 0; i < newTags.length; i++){
                    this.Broadcast(newTags[i]);
                }
            },

            GetDisplayTag: function GetDisplayTag(customName, customLore, colorCode){
                var displayLoreString = "";
                for(var i = 0; i < customLore.length; i++){
                    displayLoreString += ",\"" + customLore[i] + "\"";
                }
                if (displayLoreString != "")
                    displayLoreString = displayLoreString.substring(1, displayLoreString.length);
                var colorString = colorCode == 0 ? "" : ",color:" + colorCode;
                return "display:{Name:\"" + customName + "\",Lore:[" + displayLoreString + "]" + colorString + "}";
            },

            GetAttributeTag: function GetAttributeTag(attributes){
                var attributeTagString = "";
                for(var i = 0; i < attributes.length; i++){
                    attributeTagString += "," + "{AttributeName:\"" + attributes[i].Name + "\",Name:\"" + attributes[i].Name + "\",Slot:\""
                        + attributes[i].Slot + "\",Amount:" + attributes[i].Amount + ",Operation:0,UUIDMost:" + attributes[i].UUIDMost + ",UUIDLeast:" + attributes[i].UUIDLeast + "}";
                }
                if (attributeTagString != "")
                    attributeTagString = attributeTagString.substring(1, attributeTagString.length);
                return "AttributeModifiers:[" + attributeTagString + "]";
            },

            GetEnchantmentTag: function GetEnchantmentTag(enchantments){
                var enchantmentTagString = "";
                for(var i = 0; i < enchantments.length; i++){
                    enchantmentTagString += "," + "{id:" + enchantments[i].ID + ",lvl:" + enchantments[i].Lvl + "}";
                }
                if (enchantmentTagString != "")
                    enchantmentTagString = enchantmentTagString.substring(1, enchantmentTagString.length);
                return "ench:[" + enchantmentTagString + "]";
            },

            GetCanPlaceTag: function GetCanPlaceTag(canPlaceTags){
                var canPlaceString = "";
                for(var i = 0; i < canPlaceTags.length; i++){
                    canPlaceString += ",\"" + canPlaceTags[i] + "\"";
                }
                if (canPlaceString != "")
                    canPlaceString = canPlaceString.substring(1, canPlaceString.length);
                return "CanPlaceOn:[" + canPlaceString + "]";
            },

            GetCanDestroyTag: function GetCanDestroyTag(canDestroyTags){
                var canDestroyString = "";
                for(var i = 0; i < canDestroyTags.length; i++){
                    canDestroyString += ",\"" + canDestroyTags[i] + "\"";
                }
                if (canDestroyString != "")
                    canDestroyString = canDestroyString.substring(1, canDestroyString.length);
                return "CanDestroy:[" + canDestroyString + "]";
            },

            GiveItemEntity: function GiveItemEntity(player, itemID, dmgValue, tagString, count){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(player.world, "/give " + player.getDisplayName() + " " + itemID + " " + count + " " + dmgValue + " {" + tagString + "}");
            },

            GiveShulkerEntity: function GiveShulkerEntity(player, shulkerID, tagString, shulkerSlots){
                var itemString = "";
                for(var i = 0; i < shulkerSlots.length; i++){
                    itemString += "{Slot:" + i + ",id:\"" + shulkerSlots[i].itemID + "\",Damage:" + shulkerSlots[i].dmgValue + ",Count:" + shulkerSlots[i].count + ",tag:{" 
                        + shulkerSlots[i].tagString + "}},";
                }
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(player.world, "/give " + player.getDisplayName() + " " + shulkerID + " 1 0 {BlockEntityTag:{Items:[" + itemString + "]}," + tagString + "}");
            },

            ReplaceItemEntity: function ReplaceItemEntity(player, itemId, dmgValue, tagString, slotID, slotCategory, count){
                var tagStr = tagString == "" ? "" : "{" + tagString + "}";
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(player.world, "/replaceitem entity " + player.getDisplayName() + " slot." + slotCategory + "." + slotID + " " + itemId + " " + count + " " + dmgValue + " " + tagStr);
            },

            SummonItemEntity: function SummonItemEntity(x, y, z, world, itemID, dmgValue, tagString, count){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(world, "/summon Item " + x + " " + y + " " + z + " {Item:{Damage:" + dmgValue + ",tag:{" + tagString + "},id:\"" + itemID + "\",Count:" + count + "}}");
            },

            Broadcast: function Broadcast(msg){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.getIWorlds()[0].broadcast(msg);
            },

            /* Attribute Handler */
            AH: {
                SetAttribute: function SetAttribute(digitalStr, attributeName, num){
                    var genericAttribute = this.GetGenericAttribute(attributeName);
                    
                    // replace function with callback to substitute the number with `num`
                    var displayRegex = this.GetDisplayAttributeRegex(digitalStr, genericAttribute, true);
                    if (displayRegex != null){
                        switch(this.GetThemeID(digitalStr)){
                            case "METALWEAPON":
                                digitalStr = digitalStr.replace(displayRegex, function(match) {
                                    return match.replace(/§l\d+/, "§l" + num);
                                });
                                break;
                            default:
                                digitalStr = digitalStr.replace(displayRegex, function(match) {
                                    return num > 0 ? match.replace(/@1§. -?\d+(\.\d+)?/, "@1§9 " + num) 
                                        : match.replace(/@1§. \+?-?\d+(\.\d+)?/, "@1§c " + num);
                                });
                        }
                    }
            
                    // Replace the attack damage pattern
                    var regexAttributeName = this.RegexEscape(genericAttribute);
                    var mainhandRegex = new RegExp('@3-?\\d+(\\.\\d+)?\\$mainhand\\$' + regexAttributeName, "g");
                    var offhandRegex = new RegExp('@3-?\\d+(\\.\\d+)?\\$offhand\\$' + regexAttributeName, "g");
                    digitalStr = digitalStr.replace(mainhandRegex, function(match) {
                        return match.replace(/@3-?\d+(\.\d+)?/, "@3" + num);
                    });
                    digitalStr = digitalStr.replace(offhandRegex, function(match) {
                        return match.replace(/@3-?\d+(\.\d+)?/, "@3" + num);
                    });
            
                    return digitalStr;
                },
            
                RegexEscape: function RegexEscape(str) {
                    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                },
            
                GetLoreAttribute: function GetLoreAttribute(digitalStr, attributeName) {
                    var genericAttribute = this.GetGenericAttribute(attributeName);
                    var displayRegex = this.GetDisplayAttributeRegex(digitalStr, genericAttribute, false);
                    if (displayRegex != null){
                        var match = digitalStr.match(displayRegex);
                        if (match && match[1]) {
                            return parseFloat(match[1]);
                        } 
                    }
                    return 0;
                },
            
                GetDisplayAttributeRegex: function GetDisplayAttributeRegex(digitalStr, genericAttribute, bUseGlobal){
                    var flags = bUseGlobal ? 'g' : '';
                    var displayRegex = null;
                    switch(this.GetThemeID(digitalStr)){
                        case "METALWEAPON":
                            switch(genericAttribute){
                                case "generic.attackSpeed":
                                    displayRegex = new RegExp('SPD§. » §.§l(\\d+)', flags);
                                    break;
                                case "generic.attackDamage":
                                    displayRegex = new RegExp('DMG§. » §.§l(\\d+)', flags);
                                    break;
                                case "generic.maxHealth":
                                    displayRegex = new RegExp('VIT§. » §.§l(\\d+)', flags);
                                    break;
                                default:
                                    // FAILED: Unsupported attribute!
                            }
                            break;
                        default:
                            switch(genericAttribute){
                                case "generic.attackSpeed":
                                    displayRegex = new RegExp('@1§. \\+?-?\\d+(\\.\\d+)? Attack Speed', flags);
                                    break;
                                case "generic.attackDamage":
                                    displayRegex = new RegExp('@1§. \\+?-?\\d+(\\.\\d+)? Attack Damage', flags);
                                    break;
                                case "generic.maxHealth":
                                    displayRegex = new RegExp('@1§. \\+?-?\\d+(\\.\\d+)? Max Health', flags);
                                    break;
                                default:
                                    // FAILED: Unsupported attribute!
                            }
                    }
                    return displayRegex;
                },
            
                // Add prefix ('generic.') to attributeName if the player neglected to include it.
                GetGenericAttribute: function GetGenericAttribute(attributeName){
                    return attributeName.indexOf("generic.") === -1 ? "generic." + attributeName : attributeName;
                },
            
                GetThemeID: function GetThemeID(digitalStr){
                    var regexMWTheme = /DMG§. »/
                    return regexMWTheme.test(digitalStr) ? "METALWEAPON" : "";
                },
            }
        },
    }
}());