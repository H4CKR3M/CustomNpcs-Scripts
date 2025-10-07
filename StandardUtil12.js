/* v3.3.5 - StandardUtil12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar */

var Utilities = (function () {
    var Plugins = [];
    return {

        Broadcast: function Broadcast(msg) {
            if (msg == null) return;
            if (typeof msg != "string") msg = msg.toString();
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.getIWorlds()[0].broadcast(msg.toString().replaceAll("&", "§"));
        },

        Message: function Message(player, msg) {
            if (msg == null) return;
            if (typeof msg != "string") msg = msg.toString();
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.executeCommand(player.world, "/tellraw " + player.getDisplayName() + " " + "{\"text\":\""
                + msg.toString().replaceAll("&", "§") + "\",\"color\":\"white\"}");
        },

        /* Returns estimated MC version -- (No 1.7.10 Support by default: requires 1.7.10 Plugin) */
        GetMCVersion: function GetMCVersion() {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var dimZeroID = API.getIWorlds()[0].getDimension().getId()

            // Alphanumeric ID - Must be 1.13+
            if (isNaN(dimZeroID)) {
                return "1.16.5";
            }
            return "1.12.2";
        },

        // MATH RELATED ----------------------------------------------------------------------

        Add: function Add(v1, v2) {
            return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z, };
        },

        Diff: function Diff(v1, v2) {
            return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z, };
        },

        Mult: function Mult(v, integer) {
            return { x: v.x * integer, y: v.y * integer, z: v.z * integer, };
        },

        Dot: function Dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        },

        Cross: function Cross(v1, v2) {
            return { x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x };
        },

        Angle: function Angle(z, x) {
            var re = Math.floor(Math.atan2(z, x) * 180 / Math.PI);
            return re < 0 ? re + 360 : re;
        },

        ToDegrees: function ToDegrees(angle) {
            return angle * (180 / Math.PI);
        },

        ToRadians: function ToRadians(degrees) {
            return degrees * (Math.PI / 180);
        },

        IsBetween: function IsBetween(v, v1, v2) {
            return this.Dot(this.Cross(v1, v), this.Cross(v1, v2)) >= 0
                && this.Dot(this.Cross(v2, v), this.Cross(v2, v1)) >= 0
        },

        Zero: function Zero() {
            return { x: 0, y: 0, z: 0 }
        },

        Up: function Up() {
            return { x: 0, y: 1, z: 0 }
        },

        Normalize: function Normalize(v, OPTIONAL_magnitude) {
            if (OPTIONAL_magnitude == null) { OPTIONAL_magnitude = 1; }
            var sqt = this.Magnitude(v);
            if (sqt == 0)
                return this.Zero();
            var vec = { x: v.x / sqt * OPTIONAL_magnitude, y: v.y / sqt * OPTIONAL_magnitude, z: v.z / sqt * OPTIONAL_magnitude }
            return vec;
        },

        Magnitude: function Magnitude(v) {
            return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        },

        GetDistance: function GetDistance(origin, destination) {
            return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2)
                + Math.pow(destination.z - origin.z, 2));
        },

        GetDistance2D: function GetDistance2D(origin, destination) {
            return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.z - origin.z, 2));
        },

        // Get Forward Vector (2D plane)
        GetEntityForwardVector: function GetEntityForwardVector(entity) {
            var deg = entity.getRotation();
            var dir = {
                x: Math.cos(this.ToRadians(deg)),
                y: 0,
                z: Math.sin(this.ToRadians(deg)),
            };
            return this.RotateAboutY(dir, -90);
        },

        // Get Forward Vector (3D)
        GetForward: function GetForward(entity) {
            var dir = this.GetEntityForwardVector(entity);
            dir.y = Math.sin(this.ToRadians(-1 * entity.getPitch()));
            return dir;
        },

        GetDirectionTowardsTarget: function GetDirectionTowardsTarget(source, target, OPTIONAL_magnitude) {
            var dir = { x: target.x - source.x, y: target.y - source.y, z: target.z - source.z, };
            return this.Normalize(dir, OPTIONAL_magnitude);
        },


        //  [ 1    0    0 ]   [ x ]
        //  [ 0   cos -sin] * [ y ]
        //  [ 0   sin  cos]   [ z ]
        RotateAboutX: function RotateAboutX(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: v.x,
                y: Math.cos(ang) * v.y - Math.sin(ang) * v.z,
                z: Math.sin(ang) * v.y + Math.cos(ang) * v.z
            }
            return vec;
        },

        //  [cos    0     sin]   [ x ]
        //  [ 0     1     0  ] * [ y ]
        //  [-sin   0     cos]   [ z ]
        RotateAboutY: function RotateAboutY(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: Math.cos(ang) * v.x + Math.sin(ang) * v.z,
                y: v.y,
                z: -Math.sin(ang) * v.x + Math.cos(ang) * v.z
            }
            return vec;
        },

        //  [cos  -sin   0]   [ x ]
        //  [sin   cos   0] * [ y ]
        //  [ 0     0    1]   [ z ]
        RotateAboutZ: function RotateAboutZ(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: Math.cos(ang) * v.x - Math.sin(ang) * v.y,
                y: Math.sin(ang) * v.x + Math.cos(ang) * v.y,
                z: v.z
            }
            return vec;
        },

        FaceRotation: function FaceRotation(entity, vec) {
            var lookAI = entity.getMCEntity().lookAi;
            if (lookAI != null) // HACK: sometimes null depending on call location
                lookAI.rotate(this.Angle(entity.x - vec.x, entity.z - vec.z));
        },

        // NOTE: does not work on 1.12
        CanAnyoneSeeMe: function CanAnyoneSeeMe(entity, range) {
            var np = entity.world.getNearbyEntities(entity.pos, range, 1);
            for (var i = 0; i < np.length; i++) {
                if (np[i].canSeeEntity(entity) == true)
                    return true;
            }
            return false;
        },

        IsTargetWatchingMe: function IsTargetWatchingMe(me, target, viewAngle, maxDistance) {
            var ra = target.rayTraceBlock(1000, false, false).getBlock();
            var a1 = this.Angle(-ra.z + target.z, -ra.x + target.x);
            var max = a1 + viewAngle;
            var min = a1 - viewAngle;

            var ne = target.world.getNearbyEntities(target.pos, maxDistance, 2);
            if (ne.length == 0)
                return false;

            for (var i = 0; i < ne.length; i++) {
                if (ne[i].getUUID() == me.getUUID()) {
                    var a2 = this.Angle(-ne[i].z + target.z, -ne[i].x + target.x);
                    if (max > 360 && a2 < 180) {
                        a2 = a2 + 360;
                    }
                    if (min < 0 && a2 > 180) {
                        a2 = a2 - 360;
                    }
                    if (a2 > min && a2 < max) {
                        return true;
                    }
                }
            }
            return false;
        },

        // Returns a safe position near the entity to teleport to, returns the position of the entity if
        // nothing is found. Y-height is preserved.
        GetSafeLocationNearEntity: function GetSafeLocationNearEntity(entity, rMin, rMax) {
            var loc = { x: 0, y: entity.y, z: 0, };
            for (var i = 0; i < 20; i++) {
                var x = Math.random() * rMax * 2 - rMax;
                var z = Math.random() * rMax * 2 - rMax;
                if (Math.abs(x) < rMin && Math.abs(z) < rMin) {
                    x += x > 0 ? rMin : -rMin;
                    z += z > 0 ? rMin : -rMin;
                }
                loc.x = entity.x + x;
                loc.z = entity.z + z;
                if (this.IsTeleportPosSafe(entity.world, loc))
                    return loc;
            }
            loc.x = entity.x;
            loc.z = entity.z;
            return loc;
        },

        // Returns whether an enemy is in range. Simple function, but used a lot
        IsEnemyNearby: function IsEnemyNearby(player, range) {
            var ne = player.world.getNearbyEntities(player.pos, range, 2);
            for (var i = 0; i < ne.length; i++)
                if (ne[i].getFaction().playerStatus(player) == -1)
                    return true;
            return false;
        },

        // Returns whether positions is safe to be teleported to
        IsTeleportPosSafe: function IsTeleportPosSafe(world, v) {
            return (world.getBlock(v.x, v.y, v.z).getName() == "minecraft:air"
                && world.getBlock(v.x, v.y + 1, v.z).getName() == "minecraft:air");
        },

        // Returns random positive or negative number between two values
        GetRandomRadius: function GetRandomRadius(min, max) {
            var rand = Math.random() * (max - min) + min;
            return Math.random() > 0.5 ? rand : rand * -1;
        },

        // Sorts given array of numbers
        SortNumeric: function SortNumeric(arr) {
            var i = 0, j;
            while (i < arr.length) {
                j = i + 1;
                while (j < arr.length) {
                    if (arr[j] < arr[i]) {
                        var temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                    j++;
                }
                i++;
            }
        },

        // Checks whether the included string contains a certain string/character
        StringIncludes: function StringIncludes(strBase, strSearch) {
            return strBase.indexOf(strSearch) !== -1;
        },

        // Removes provided substring from given base. Returns base string if it does not exist.
        RemoveSubstring: function RemoveSubstring(strBase, strRemove) {
            return strBase.substring(0, strBase.indexOf(strRemove))
                + strBase.substring(strBase.indexOf(strRemove) + strRemove.length, strBase.length);
        },

        Clamp: function Clamp(num, min, max) {
            return Math.min(max, Math.max(min, num));
        },

        IndexOfNth: function IndexOfNth(str, char, index) {
            if (index <= 0) {
                throw ("\n\nUtilities: IndexOfNth(str, char, index) was given an n'th number less than 1."
                    + "\nExample: If you want the 2nd index, give 2\n\n");
            }

            var remaining = index;
            for (var i = 0; i < str.length; i++) {
                if (str[i] == char) {
                    remaining--;
                    if (remaining == 0) {
                        return i;
                    }
                }
            }
            return -1;
        },

        IntToRGB: function IntToRGB(colorInt) {
            var r = (colorInt >> 16) & 0xFF;
            var g = (colorInt >> 8) & 0xFF;
            var b = colorInt & 0xFF;
            return { r: r, g: g, b: b };
        },

        RGBToInt: function RGBToInt(r, g, b) {
            return (r << 16) | (g << 8) | b;
        },

        HSVtoRGB: function HSVtoRGB(h, s, v) {
            var r, g, b;

            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            switch (i % 6) {
                case 0: r = v; g = t; b = p; break;
                case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break;
                case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break;
                case 5: r = v; g = p; b = q; break;
            }

            return {
                r: Math.floor(r * 255),
                g: Math.floor(g * 255),
                b: Math.floor(b * 255)
            };
        },

        // ITEM RELATED ----------------------------------------------------------------------

        RemoveItems: function RemoveItems(player, itemID, numToRemove) {
            var itemList = player.inventory.getItems();
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                if (item.getName() == itemID) {
                    if (item.getStackSize() > numToRemove) {
                        item.setStackSize(item.getStackSize() - numToRemove);
                        numToRemove = 0;
                    }
                    else {
                        numToRemove = item.getStackSize();
                        item.setStackSize(0);
                    }
                    if (numToRemove <= 0)
                        break;
                }
            }
        },

        // Given an item entity, returns a tag object - or null
        GetEntityTags: function GetEntityTags(entityItem) {
            return this.GetItemTags(entityItem.getItem());
        },

        // Given an iItemStack, returns a tag object - or null
        GetItemTags: function GetItemTags(itemStack) {
            for (var i = 0; i < this._invalidItems.length; i++) {
                if (itemStack.getName() == this._invalidItems[i])
                    return null;
            }
            return this.GetItemTagsUnsafe(itemStack);
        },
        _invalidItems: ["customnpcs:scripted_item", "customnpcs:npcsoulstonefilled", "customnpcs:npcscripted",
            "minecraft:written_book", "minecraft:white_shulker_box", "variedcommodities:book",
            "customnpcs:npcscripteddoortool"],

        // Use with caution (Try catch loop?) - Reading an invalid item will result in a script error
        GetItemTagsUnsafe: function GetItemTagsUnsafe(itemStack) {
            var validJSON = this.GetValidJSON(itemStack.getItemNbt().toJsonString());
            var obj = JSON.parse(validJSON);
            return obj.tag != null ? obj.tag : null;
        },

        // MC and Customnpcs do not store their JSON as... readible JSON. This *usually* fixes that problem
        GetValidJSON: function GetValidJSON(MCJSONFormatFile) {
            return MCJSONFormatFile.replaceAll(": [ ]*([\\w@\\.-]+)", ": \"$1\"");
        },

        // Returns whether a tag object has a given item tag
        HasTag: function HasTag(tagObj, tagName) {
            for (var tagKey in tagObj) {
                if (tagKey == tagName)
                    return true;
            }
            return false;
        },

        IsWearingFullSet: function IsWearingFullSet(player, tag) {
            for (var i = 0; i < 4; i++) {
                if (!this.IsWearing(player, i, tag)) {
                    return false;
                }
            }
            return true;
        },

        // Slot - 0:boots, 1:pants, 2:body, 3:head
        IsWearing: function IsWearing(player, slot, tag) {
            var itemToScan = player.getArmor(slot);
            if (itemToScan.getName() != "minecraft:air") {
                var tagObj = this.GetItemTags(itemToScan);
                if (tagObj != null && this.HasTag(tagObj, tag)) {
                    return true;
                }
            }
            return false;
        },

        SetPitch: function SetPitch(player, pitch) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.executeCommand(player.world, "/tp " + player.getDisplayName() + " "
                + player.x + " " + player.y + " " + player.z + " " + player.getRotation() + " " + pitch);
        },

        // Requests CustomNpcs API to refresh the npc display on the next frame.
        Refresh: function Refresh(npc, OPTIONAL_bFullResetClearVariables) {

            // HACK: req for player skins, though this fully resets the npc! (resets all scripts, variables, etc...)
            if (OPTIONAL_bFullResetClearVariables == true) {
                var storedNBT = npc.getEntityNbt();
                npc.setEntityNbt(storedNBT);
            }
            npc.display.setVisible(1); // parts/eyes
            npc.display.setVisible(0);
        },

        // AUDIO RELATED ----------------------------------------------------------------------

        PlayAt: function PlayAt(x, y, z, soundName) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var volume = arguments.length >= 5 ? arguments[4] : 64;
            var np = API.getIWorlds()[0].getNearbyEntities(x, y, z, 32, 1);
            for (var i = 0; i < np.length; i++) {

                // HACK: avoid "The sound is too far away to be heard" warning msg on 1.16.X
                var prefix = "";
                if (Utilities.GetMCVersion() != "1.12.2") {
                    prefix = "execute at " + np[i].getName() + " run "
                }

                API.executeCommand(np[i].world, "/" + prefix + "playsound " + soundName + " voice " + np[i].getName()
                    + " " + x + " " + y + " " + z + " " + volume);
            }
        },

        PlayAtEntity: function PlayAtEntity(entity, x, y, z, soundName) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var volume = arguments.length >= 6 ? arguments[5] : 64;
            var np = entity.world.getNearbyEntities(x, y, z, 32, 1);
            for (var i = 0; i < np.length; i++) {
                API.executeCommand(np[i].world, "/playsound " + soundName + " voice " + np[i].getName() + " "
                    + x + " " + y + " " + z + " " + volume);
            }
        },

        Play: function Play(entity, soundName) {
            if (entity == null) { throw ("\n\nUtilities: null entity given to Play(entity, soundName)\n"); }

            var volume = arguments.length >= 3 ? arguments[2] : 64;

            if (entity.getType() == 2) {
                this.PlayAtEntity(entity, entity.x, entity.y, entity.z, soundName, volume);
            }
            else if (entity.getType() == 1) {
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(entity.world, "/playsound " + soundName + " voice " + entity.getName() + " "
                    + entity.x + " " + entity.y + " " + entity.z + " " + volume);
            }
            else
                throw ("\n\nUtilities: the entity given to Play(entity, soundName) was neither a player, nor an NPC."
                    + "\nPass in an NPC or player entity.\n");
        },

        Stop: function Stop(entity, soundName) {
            if (entity == null) { throw ("\n\nUtilities: null entity given to Stop(entity, soundName)\n"); }

            if (entity.getType() == 2) {
                var np = entity.world.getNearbyEntities(entity.pos, 32, 1);
                for (var i = 0; i < np.length; i++) {
                    entity.executeCommand("/stopsound " + np[i].getName() + " voice " + soundName);
                }
            }
            else if (entity.getType() == 1) {
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(entity.world, "/stopsound " + entity.getName() + " voice " + soundName);
            }
            else
                throw ("\n\nUtilities: the entity given to Stop(entity, soundName) was neither a player, nor an NPC."
                    + "\nPass in an NPC or player entity.\n");
        },

        // EXTRA ------------------------------------------------------------------------------

        IsPluginInstalled: function IsPluginInstalled(pluginName) {
            for (var i = 0; i < Plugins.length; i++) {
                if (Plugins[i] == pluginName)
                    return true;
            }
            return false;
        },
        InstallPlugin: function InstallPlugin(pluginName) {
            Plugins.push(pluginName);
        }
    }
}());

