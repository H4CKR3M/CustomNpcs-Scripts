/* v2.2 - StandardUtil12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 *
 * NOTE: Scripts using StandardUtil12 v1.5 or older may require update
 */

var Utilities = (function(){
    return {  

        Broadcast: function Broadcast(msg){
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.getIWorld(0).broadcast(msg.replaceAll("&", "§"));
        },

        Message: function Message(player, msg){
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.executeCommand(player.world, "/tellraw " + player.getDisplayName() + " " + "{\"text\":\"" + msg.replaceAll("&", "§") + "\",\"color\":\"white\"}");
        },

        // MATH RELATED ----------------------------------------------------------------------

        Add: function Add(v1, v2){
            return { x: v1.x+v2.x, y: v1.y+v2.y, z: v1.z+v2.z, };
        },
        
        Dot: function Dot(v1, v2){
            return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
        },

        Cross: function Cross(v1, v2){
            return { x: v1.y*v2.z - v1.z*v2.y, y: v1.z*v2.x - v1.x*v2.z, z: v1.x*v2.y - v1.y*v2.x };
        },

        Angle: function Angle(z,x){
            var re = Math.floor(Math.atan2(z,x)*180/Math.PI);
            return re < 0 ? re+360 : re;
        },

        ToDegrees: function ToDegrees(angle){
            return angle*(180/Math.PI);
        },
    
        ToRadians: function ToRadians(degrees) {
            return degrees*(Math.PI/180);
        },

        IsBetween: function IsBetween(v, v1, v2){
            return this.Dot(this.Cross(v1, v), this.Cross(v1, v2)) >= 0 && this.Dot(this.Cross(v2, v), this.Cross(v2, v1)) >= 0
        },

        Normalize: function Normalize(vec, magnitude){
            var sqt = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
            vec.x = vec.x/sqt*magnitude;
            vec.y = vec.y/sqt*magnitude;
            vec.z = vec.z/sqt*magnitude;
            return vec;
        },

        GetDistance: function GetDistance(origin, destination){
            return Math.sqrt(Math.pow(destination.x-origin.x,2) + Math.pow(destination.y-origin.y,2) + Math.pow(destination.z-origin.z,2));
        },

        GetEntityForwardVector: function GetEntityForwardVector(entity){
            var degrees = entity.getRotation();
            var dir = {
                x: Math.cos(this.ToRadians(degrees)),
                y: 0,
                z: Math.sin(this.ToRadians(degrees)),
            };
            dir = this.RotateAboutY(dir, -90);
            return dir;
        },

        GetDirectionTowardsTarget: function GetDirectionTowardsTarget(source, target, magnitude) {
            var dir = { x: target.x-source.x, y: target.y-source.y, z: target.z-source.z, };
            return this.Normalize(dir, magnitude);
        },

        //   [cos    0     sin]
        //   [ 0     1     0  ] * vec
        //   [-sin   0     cos]
        RotateAboutY: function RotateAboutY(vec, degrees){
            var radians = this.ToRadians(degrees);
            var tmpX = vec.x;
            var tmpZ = vec.z;
            vec.x = Math.cos(radians) * tmpX + Math.sin(radians) * tmpZ;
            vec.z = -Math.sin(radians) * tmpX + Math.cos(radians) * tmpZ;
            return vec;
        },

        CanAnyoneSeeMe: function CanAnyoneSeeMe(npc, range){
            var np = npc.getWorld().getNearbyEntities(npc.getPos(), range, 1);
            for(var i = 0; i < np.length; i++){
                if (np[i].canSeeEntity(npc) == true)
                    return true;
            }
            return false;
        },
    
        IsTargetWatchingMe: function IsTargetWatchingMe(me, target, viewAngle, maxDistance){
            var ra = target.rayTraceBlock(1000,false,false).getBlock();
            var a1=this.Angle(-ra.getZ()+target.z,-ra.getX()+target.x);
            var max=a1+viewAngle;
            var min=a1-viewAngle;
            
            var ne = target.getWorld().getNearbyEntities(target.getPos(),maxDistance, 2);
            if (ne.length == 0)
                return false;
    
            for(var i = 0; i < ne.length; i++){
                if(ne[i].getUUID() == me.getUUID()){
                    var a2=this.Angle(-ne[i].getZ()+target.z,-ne[i].getX()+target.x);
                    if(max > 360 && a2 < 180){
                        a2=a2+360;
                    }
                    if(min < 0 && a2 > 180){
                        a2=a2-360;
                    }
                    if(a2>min && a2<max){
                        return true;
                    }
                }
            }
            return false;
        },

        // Returns a safe position near the entity to teleport to, returns the entities position if nothing is found. Y height is preserved.
        GetSafeLocationNearEntity: function GetSafeLocationNearEntity(entity, rMin, rMax){
            var loc = { x: 0, y: entity.y, z: 0, };
            for(var i = 0; i < 20; i++){
                var x = Math.random()*rMax*2 - rMax;
                var z = Math.random()*rMax*2 - rMax;
                if (Math.abs(x) < rMin && Math.abs(z) < rMin){
                    x += x > 0 ? rMin : -rMin;
                    z += z > 0 ? rMin : -rMin;
                }
                loc.x = entity.x+x;
                loc.z = entity.z+z;
                if (this.IsTeleportPosSafe(entity.world, loc))
                    return loc;
            }
            loc.x = entity.x;
            loc.z = entity.z;
            return loc;
        },

        // Returns whether an enemy is in range. Simple function, but used a lot
        IsEnemyNearby: function IsEnemyNearby(player, range){
            var ne = player.world.getNearbyEntities(player.pos, range, 2);
            for(var i = 0; i < ne.length; i++)
                if (ne[i].getFaction().playerStatus(player) == -1)
                    return true;
            return false;
        },

        // Returns whether positions is safe to be teleported to
        IsTeleportPosSafe: function IsTeleportPosSafe(world, v){
            return (world.getBlock(v.x, v.y, v.z).getName() == "minecraft:air" && world.getBlock(v.x, v.y+1, v.z).getName() == "minecraft:air");
        },

        // Returns random positive or negative number between two values
        GetRandomRadius: function GetRandomRadius(min, max){
            var rand = Math.random() * (max - min) + min;
            return Math.random() > 0.5 ? rand : rand*-1;
        },

        // Sorts given array of numbers
        SortNumeric: function SortNumeric(ar) {
            var i = 0, j;
            while (i < ar.length) {
                j = i + 1;
                while (j < ar.length) {
                    if (ar[j] < ar[i]) {
                        var temp = ar[i];
                        ar[i] = ar[j];
                        ar[j] = temp;
                    }
                    j++;
                }
                i++;
            }
        },

        // ITEM RELATED ----------------------------------------------------------------------

        RemoveItems: function RemoveItems(player, itemID, numToRemove){
            var itemList = player.inventory.getItems();
            for(var i = 0; i < itemList.length; i++){
                var item = itemList[i];
                if(item.getName() == itemID){
                    if (item.getStackSize() > numToRemove){
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
        GetEntityTags: function GetEntityTags(entityItem){
            return this.GetItemTags(entityItem.getItem());
        },

        // Given an iItemStack, returns a tag object - or null
        GetItemTags: function GetItemTags(itemStack){
            for(var i = 0; i < this._invalidItems.length; i++){
                if (itemStack.getName() == this._invalidItems[i])
                    return null;
            }
            return this.GetItemTagsUnsafe(itemStack);
        },
        _invalidItems: [ "customnpcs:scripted_item", "customnpcs:npcsoulstonefilled", "customnpcs:npcscripted", "minecraft:written_book", 
            "minecraft:chest", "minecraft:white_shulker_box", "variedcommodities:book" ],
        
        // Use with caution (Try catch loop?) - Reading an invalid item will result in a script error
        GetItemTagsUnsafe: function GetItemTagsUnsafe(itemStack){
            var validJSON = this.GetValidJSON(itemStack.getItemNbt().toJsonString());
            var obj = JSON.parse(validJSON);
            return obj.tag != null ? obj.tag : null;
        },

        // MC and Customnpcs do not store their JSON as... readible JSON. This *usually* fixes that problem
        GetValidJSON: function GetValidJSON(MCJSONFormatFile){
            return MCJSONFormatFile.replaceAll(": [ ]*([\\w@\\.-]+)", ": \"$1\"");
        },

        // Returns whether a tag object has a given item tag
        HasTag: function HasTag(tagObj, tagName){
            for(var tagKey in tagObj){
                if (tagKey == tagName)
                    return true;
            }
            return false;
        },

        IsWearingFullSet: function IsWearingFullSet(player, tag){
            for(var i = 0; i < 4; i++){
                if(!this.IsWearing(player, i, tag)){
                    return false;
                }
            }
            return true;
        },
    
        IsWearing: function IsWearing(player, slot, tag){
            var itemToScan = player.getArmor(slot);
            if (itemToScan.getName() != "minecraft:air"){
                var tagObj = this.GetItemTags(itemToScan);
                if (tagObj != null && this.HasTag(tagObj, tag)){
                    return true;
                }
            }
            return false;
        },

        // AUDIO RELATED ----------------------------------------------------------------------

        PlayAt: function PlayAt(x, y, z, soundName){
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var volume = arguments.length >= 5 ? arguments[4] : 64;
            var np = API.getIWorld(0).getNearbyEntities(x, y, z, 32, 1);
            for(var i = 0; i < np.length; i++){
                API.executeCommand(np[i].world, "/playsound " + soundName + " voice " + np[i].getName() + " " + x + " " + y + " " + z + " " + volume);
            }
        },

        Play: function Play(entity, soundName){
            if (entity == null){ throw ("\n\nUtilities: null entity given to Play(entity, soundName)\n"); }

            var volume = arguments.length >= 3 ? arguments[2] : 64;

            if (entity.getType() == 2){
                this.PlayAt(entity.x, entity.y, entity.z, soundName, volume);
            }
            else if (entity.getType() == 1){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(entity.world, "/playsound " + soundName + " voice " + entity.getName() + " " + entity.x + " " + entity.y + " " + entity.z + " " + volume);
            }
            else
                throw ("\n\nUtilities: the entity given to Play(entity, soundName) was neither a player, nor an NPC. \nPass in an NPC or player entity.\n");
        },

        Stop: function Stop(entity, soundName){
            if (entity == null){ throw ("\n\nUtilities: null entity given to Stop(entity, soundName)\n"); }

            if (entity.getType() == 2){
                var np = entity.getWorld().getNearbyEntities(entity.pos, 32, 1);
                for(var i = 0; i < np.length; i++){
                    entity.executeCommand("/stopsound " + np[i].getName() + " voice " + soundName);
                }
            }
            else if (entity.getType() == 1){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(entity.world, "/stopsound " + entity.getName() + " voice " + soundName);
            }
            else
                throw ("\n\nUtilities: the entity given to Stop(entity, soundName) was neither a player, nor an NPC. \nPass in an NPC or player entity.\n");
        }
    }
}());
