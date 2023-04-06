/* v1.7 - StandardUtil | Load Script from INIT, Call from Anywhere | Designed for Minecraft 1.7.10, CustomNPCs_1.7.10d(29oct17) | Written by Rimscar */

var Utilities = (function(){
    return {  

        // MATH RELATED ----------------------------------------------------------------------

        Normalize: function Normalize(vec, newMagnitude){
            var sqt = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
            vec.x = vec.x / sqt * newMagnitude;
            vec.y = vec.y / sqt * newMagnitude;
            vec.z = vec.z / sqt * newMagnitude;
            return vec;
        },
    
        GetDirectionTowardsTarget: function GetDirectionTowardsTarget(target, newMagnitude) {
            var dir = {
                x: target.x - npc.x,
                y: target.y - npc.y,
                z: target.z - npc.z,
            };
            return this.Normalize(dir, newMagnitude);
        },
    
        GetDistance: function GetDistance(origin, destination){
            return Math.sqrt(
                Math.pow(destination.x - origin.x, 2) + 
                Math.pow(destination.y - origin.y, 2) + 
                Math.pow(destination.z - origin.z, 2));
        },

        AddVectors: function AddVectors(vec1, vec2){
            vec1.x += vec2.x;
            vec1.y += vec2.y;
            vec1.z += vec2.z;
            return vec1;
        },
    
        RotateAboutY: function RotateAboutY(vec, degrees){
            var radians = this.ToRadians(degrees);
            //   [cos    0     sin]
            //   [ 0     1     0  ] * vec
            //   [-sin   0     cos]
            var newX = Math.cos(radians) * vec.x + Math.sin(radians) * vec.z;
            var newZ = -Math.sin(radians) * vec.x + Math.cos(radians) * vec.z;
    
            vec.x = newX;
            vec.z = newZ;
            return vec;
        },

        // Returns random positive or negative number between two values
        GetRandomRadius: function GetRandomRadius(min, max){
            var rand = Math.random() * (max - min) + min;
            if (Math.random() > 0.5){
                return rand;
            }
            return rand * -1;
        },

        // [Ported from 1.12.2] Returns a safe position near the entity to teleport to, returns the entities position if nothing is found. Y height is kept.
        GetSafeLocationNearEntity: function GetSafeLocationNearEntity(entity, minRadius, maxRadius){

            // Attempt to find a position 20 times, then give up
            for(var i = 0; i < 50; i++){
                var newPos = {
                    x: entity.x + this.GetRandomRadius(minRadius, maxRadius) + 0.5,
                    y: entity.y,
                    z: entity.z + this.GetRandomRadius(minRadius, maxRadius) + 0.5,
                };
                
                if (this.IsTeleportPosSafe(newPos) == true){
                    return newPos;
                }
            }
            var vec = {
                x: entity.x,
                y: entity.y,
                z: entity.z,
            };
            return vec;
        },

        // [Ported from 1.12.2] Returns whether positions is safe to be teleported to
        IsTeleportPosSafe: function IsTeleportPosSafe(vec){
            return (world.getBlock(vec.x, vec.y, vec.z) == null && world.getBlock(vec.x, vec.y + 1, vec.z) == null);
        },

        Angle: function Angle(z,x){
            var re = Math.floor(Math.atan2(z,x)*180/Math.PI);
            if(re < 0){
                re=re+360;
            }
            return re;
        },
        ToDegrees: function ToDegrees(angle){ return angle * (180 / Math.PI); },
        ToRadians: function ToRadians(angle) { return angle * (Math.PI / 180); },

        // Plays a sound to the given player or all players nearby a given npc
        PlaySound: function PlaySound(soundName, target){
            if (target.getType() == 1){
                npc.executeCommand("playsound " + soundName + " " + target.getName());
            }
            else if (target.getType() == 2){
                var np = target.getSurroundingEntities(60, 1);
                for(var i = 0; i < np.length; i++){
                    npc.executeCommand("playsound " + soundName + " " + np[i].getName());
                }
            }
        },

        // Harms the given entity with "fake instant harming" - Avoids crash: "Applying potion effect while an entity dies will throw a Concurrent Modification Exception"
        Harm: function Harm(entity, potency){
            var dmg = 3 * Math.pow(2, potency+1);
            if (entity.getType() == 2 && entity.getFaction().getId() != npc.getFaction().getId() && entity != npc && entity.getHealth() > 0){
                dmg *= 3;
                if (entity.getMaxHealth() < 50 && entity.getShowBossBar() == 0)
                    entity.setHealth(entity.getHealth() - dmg);
                else
                    entity.setHealth(Math.max(1, entity.getHealth() - dmg));
            }
            else if (entity.getType() == 1 && entity.getMode() != 1 && entity.getHealth() > 0)
                npc.executeCommand("effect " + entity.getName() + " 7 1 " + potency);
        },

        // HACK: (Usually) Avoids a crash caused by applying a potion effect when an npc dies
        Effect: function Effect(entity, effect, duration, strength){
            if (entity.getHealth() > entity.getMaxHealth() / 5) { entity.addPotionEffect(effect, duration, strength, false); }
        },

        IsVisible: function IsVisible(){
            return npc.getVisibleType() == 0;
        },
    }
}());
if (npc.getTempData("Utilities") == null){ npc.setTempData("Utilities", Utilities); }
