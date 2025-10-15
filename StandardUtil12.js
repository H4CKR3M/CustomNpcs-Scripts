/* v3.4.1 - StandardUtil12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar */

var Utilities = (function () {
    var Plugins = [];
    return {
        /**
         * Sends a message in chat for all players.
         * @param {string} msg - chat message
         */
        Broadcast: function Broadcast(msg) {
            if (msg == null) return;
            // @ts-ignore
            if (typeof msg != "string") msg = msg.toString();
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.getIWorlds()[0].broadcast(msg.toString().replaceAll("&", "§"));
        },

        /**
         * Sends a unique message to given player
         * @param {IPlayer} player - player who receives the message
         * @param {string} msg - chat message
         */
        Message: function Message(player, msg) {
            if (msg == null) return;
            // @ts-ignore
            if (typeof msg != "string") msg = msg.toString();
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.executeCommand(player.world, "/tellraw " + player.getDisplayName() + " " + "{\"text\":\""
                + msg.toString().replaceAll("&", "§") + "\",\"color\":\"white\"}");
        },

        /**
         * Gets estimated Minecraft version
         * (No 1.7.10 Support by default: requires 1.7.10 Plugin)
         * @returns {string} A string representing the MC version. For example: "1.12.2"
         */
        GetMCVersion: function GetMCVersion() {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var dimZeroID = API.getIWorlds()[0].getDimension().getId()

            // Alphanumeric ID - Must be 1.13+
            if (isNaN(dimZeroID)) {
                return "1.16.5";
            }
            return "1.12.2";
        },

        /**
         * Gets the game / server difficulty.
         * @returns {string} difficulty : PEACEFUL EASY NORMAL HARD
         * 
         * @remarks
         * Only supports 1.12.2, will return `NORMAL` on other MC versions.
         */
        GetDifficulty: function GetDifficulty() {
            if (this.GetMCVersion() == "1.12.2"){
                var FMLCommonHandler = Java.type("net.minecraftforge.fml.common.FMLCommonHandler");
                var server = FMLCommonHandler.instance().getMinecraftServerInstance();
                var difficultyEnum = server.func_147135_j();
                return difficultyEnum;
            }
            return "NORMAL";
        },

        /**
         * Sets the in-game difficulty
         * @param {string} stringDifficulty - a string representing the difficulty enum : PEACEFUL EASY NORMAL HARD
         * 
         * @remarks
         * Only supports 1.12.2, does nothing on other MC versions.  
         * Does nothing if run on a dedicated server, Singleplayer Only
         */
        SetDifficulty: function SetDifficulty(stringDifficulty) {
            if (this.GetMCVersion() == "1.12.2") {
                var FMLCommonHandler = Java.type("net.minecraftforge.fml.common.FMLCommonHandler");
                var server = FMLCommonHandler.instance().getMinecraftServerInstance();
                var EnumDifficulty = Java.type("net.minecraft.world.EnumDifficulty");
                var enumDifficulty = null;
                switch (stringDifficulty) {
                    case "PEACEFUL":
                        enumDifficulty = EnumDifficulty.PEACEFUL;
                        break;
                    case "EASY":
                        enumDifficulty = EnumDifficulty.EASY;
                        break;
                    case "NORMAL":
                        enumDifficulty = EnumDifficulty.NORMAL;
                        break;
                    case "HARD":
                        enumDifficulty = EnumDifficulty.HARD;
                        break;
                }
                server.func_147139_a(enumDifficulty);
            }
        },

        /**
         * Adds two vectors together
         * @param {IVector} v1 
         * @param {IVector} v2 
         * @returns {IVector} A new vector representing the sum of `v1` and `v2`
         */
        Add: function Add(v1, v2) {
            return { x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z, };
        },

        /**
         * Subtracts one vector from another.
         * @param {IVector} v1 - The vector to subtract from.
         * @param {IVector} v2 - The vector to subtract.
         * @returns {IVector} A new vector representing the difference `v1` - `v2`
         */
        Diff: function Diff(v1, v2) {
            return { x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z, };
        },

        /**
         * Multiplies a vector by a scalar value.
         * @param {IVector} v - The input vector.
         * @param {number} scalar - The value to multiply each component by.
         * @returns {IVector} A new vector scaled by the given scalar.
         */
        Mult: function Mult(v, scalar) {
            return { x: v.x * scalar, y: v.y * scalar, z: v.z * scalar, };
        },

        /**
         * Calculates the dot product of two vectors.
         * @param {IVector} v1 - The first vector.
         * @param {IVector} v2 - The second vector.
         * @returns {number} The dot product of `v1` and `v2`
         */
        Dot: function Dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        },

        /**
         * Calculates the cross product of two vectors.
         * @param {IVector} v1 - The first vector.
         * @param {IVector} v2 - The second vector.
         * @returns {IVector} A new vector perpendicular to both `v1` and `v2`
         */
        Cross: function Cross(v1, v2) {
            return { x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x };
        },

        /**
         * Computes the angle (in degrees) between the Z and X axes given two components.
         * @param {number} z - The Z-axis component.
         * @param {number} x - The X-axis component.
         * @returns {number} The angle in degrees, normalized to the range [0-360].
         */
        Angle: function Angle(z, x) {
            var re = Math.floor(Math.atan2(z, x) * 180 / Math.PI);
            return re < 0 ? re + 360 : re;
        },

        /**
         * Converts an angle from radians to degrees.
         * @param {number} angle - The angle in radians.
         * @returns {number} The angle converted to degrees.
         */
        ToDegrees: function ToDegrees(angle) {
            return angle * (180 / Math.PI);
        },

        /**
         * Converts an angle from degrees to radians.
         * @param {number} degrees - The angle in degrees.
         * @returns {number} The angle converted to radians.
         */
        ToRadians: function ToRadians(degrees) {
            return degrees * (Math.PI / 180);
        },

        /**
         * Determines whether a vector lies between two other vectors.
         * @param {IVector} v - The vector to test.
         * @param {IVector} v1 - The first boundary vector.
         * @param {IVector} v2 - The second boundary vector.
         * @returns {boolean} `true` if vector `v` lies between `v1` and `v2`, otherwise `false`
         */
        IsBetween: function IsBetween(v, v1, v2) {
            return this.Dot(this.Cross(v1, v), this.Cross(v1, v2)) >= 0
                && this.Dot(this.Cross(v2, v), this.Cross(v2, v1)) >= 0
        },

        /**
         * Returns a zero vector.
         * @returns {IVector} A vector with all components set to 0.
         */
        Zero: function Zero() {
            return { x: 0, y: 0, z: 0 }
        },

        /**
         * Returns a unit vector pointing upward along the Y axis.
         * @returns {IVector} The up vector `{ x: 0, y: 1, z: 0 }`
         */
        Up: function Up() {
            return { x: 0, y: 1, z: 0 }
        },

        /**
         * Normalizes a vector to unit length or to a specified magnitude.
         * @param {IVector} v - The vector to normalize.
         * @param {number} [OPTIONAL_magnitude=1] - **Optional** : The magnitude to scale the normalized vector to. Defaults to 1.
         * @returns {IVector} A new vector with the specified magnitude, pointing in the same direction as `v`
         */
        Normalize: function Normalize(v, OPTIONAL_magnitude) {
            if (OPTIONAL_magnitude == null) { OPTIONAL_magnitude = 1; }
            var sqt = this.Magnitude(v);
            if (sqt == 0)
                return this.Zero();
            var vec = { x: v.x / sqt * OPTIONAL_magnitude, y: v.y / sqt * OPTIONAL_magnitude, z: v.z / sqt * OPTIONAL_magnitude }
            return vec;
        },

        /**
         * Calculates the magnitude (length) of a vector.
         * @param {IVector} v - The vector whose magnitude is to be computed.
         * @returns {number} The Euclidean length of the vector.
         */
        Magnitude: function Magnitude(v) {
            return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        },

        /**
         * Calculates the 3D distance between two points or vectors.
         * @param {IVector} origin - The starting point.
         * @param {IVector} destination - The ending point.
         * @returns {number} The straight-line distance between `origin` and `destination` in 3D space.
         */
        GetDistance: function GetDistance(origin, destination) {
            return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2)
                + Math.pow(destination.z - origin.z, 2));
        },

        /**
         * Calculates the 2D distance between two points, ignoring the Y-axis.
         * @param {IVector} origin - The starting point.
         * @param {IVector} destination - The ending point.
         * @returns {number} The distance between `origin` and `destination` projected onto the XZ plane.
         */
        GetDistance2D: function GetDistance2D(origin, destination) {
            return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.z - origin.z, 2));
        },

        /**
         * Gets a forward-facing direction vector for a given entity, based on its yaw rotation (2D plane).
         * @param {IEntity} entity - The entity whose forward vector to compute.
         * @returns {IVector} A normalized 3D vector representing the entity's forward direction on the XZ plane.
         */
        GetForward2D: function GetForward2D(entity) {
            var deg = entity.getRotation();
            var dir = {
                x: Math.cos(this.ToRadians(deg)),
                y: 0,
                z: Math.sin(this.ToRadians(deg)),
            };
            return this.RotateAboutY(dir, -90);
        },

        /**
         * Gets a forward-facing direction vector for an entity in 3D space.
         * Takes both yaw and pitch into account.
         * @param {IEntity} entity - The entity whose forward vector to compute.
         * @returns {IVector} A normalized 3D vector representing the entity’s facing direction.
         */
        GetForward: function GetForward(entity) {
            var dir = this.GetForward2D(entity);
            dir.y = Math.sin(this.ToRadians(-1 * entity.getPitch()));
            return dir;
        },

        /**
         * Computes a normalized direction vector from a source point toward a target point.
         * @param {IVector} source - The starting point.
         * @param {IVector} target - The target point.
         * @param {number} [OPTIONAL_magnitude=1] - **Optional** : The magnitude of the resulting direction vector. Defaults to 1.
         * @returns {IVector} A vector pointing from 'source' to 'target', scaled to the specified magnitude.
         */
        GetDirectionTowardsTarget: function GetDirectionTowardsTarget(source, target, OPTIONAL_magnitude) {
            var dir = { x: target.x - source.x, y: target.y - source.y, z: target.z - source.z, };
            return this.Normalize(dir, OPTIONAL_magnitude);
        },

        /**
         * Rotates a vector around the X-axis by the given angle.
         * @param {IVector} v - The vector to rotate.
         * @param {number} degrees - The rotation angle in degrees.
         * @returns {IVector} A new vector rotated around the X-axis.
         */
        RotateAboutX: function RotateAboutX(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: v.x,
                y: Math.cos(ang) * v.y - Math.sin(ang) * v.z,
                z: Math.sin(ang) * v.y + Math.cos(ang) * v.z
            }
            return vec;
        },

        /**
         * Rotates a vector around the Y-axis by the given angle.
         * @param {IVector} v - The vector to rotate.
         * @param {number} degrees - The rotation angle in degrees.
         * @returns {IVector} A new vector rotated around the Y-axis.
         */
        RotateAboutY: function RotateAboutY(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: Math.cos(ang) * v.x + Math.sin(ang) * v.z,
                y: v.y,
                z: -Math.sin(ang) * v.x + Math.cos(ang) * v.z
            }
            return vec;
        },

        /**
         * Rotates a vector around the Z-axis by the given angle.
         * @param {IVector} v - The vector to rotate.
         * @param {number} degrees - The rotation angle in degrees.
         * @returns {IVector} A new vector rotated around the Z-axis.
         */
        RotateAboutZ: function RotateAboutZ(v, degrees) {
            var ang = this.ToRadians(degrees);
            var vec = {
                x: Math.cos(ang) * v.x - Math.sin(ang) * v.y,
                y: Math.sin(ang) * v.x + Math.cos(ang) * v.y,
                z: v.z
            }
            return vec;
        },

        /**
         * Refreshes the visual aspects of an NPC; Allows changing eye color, texture overlay, player skins, etc...
         * @param {*} npc 
         * @param {boolean} OPTIONAL_bFullResetClearVariables - **Optional** : If `true`, fully resets the npc and clears all scripted variables if there is code on the npc.
         * @remarks **Warning:** In some cases, it may be required to fully reset an npc for the visual
         * changes to take effect. If this is the case, be mindful that as a side effect, this will also
         * reset all code and scripted variables that you wrote on the scripted NPC.
         */
        Refresh: function Refresh(npc, OPTIONAL_bFullResetClearVariables) {

            // HACK: req for player skins, though this fully resets the npc! (resets all scripts, variables, etc...)
            if (OPTIONAL_bFullResetClearVariables == true) {
                var storedNBT = npc.getEntityNbt();
                npc.setEntityNbt(storedNBT);
            }
            npc.display.setVisible(1); // parts/eyes
            npc.display.setVisible(0);
        },

        /**
         * Checks whether an npc can be seen by any other entity.
         * @param {*} entity 
         * @param {number} range 
         * @returns {boolean} True if other players/entities/npcs can see the given entity; Returns False otherwise.
         * @warning
         * The `canSeeEntity` method does not work on 1.12
         */
        CanAnyoneSeeMe: function CanAnyoneSeeMe(entity, range) {
            if (this.GetMCVersion() == "1.12.2"){
                Utilities.Broadcast("ERROR! Utilities.CanAnyoneSeeMe(entity.range) does not work on 1.12.2");
                return false;
            }

            var np = entity.world.getNearbyEntities(entity.pos, range, 1);
            for (var i = 0; i < np.length; i++) {
                if (np[i].canSeeEntity(entity) == true)
                    return true;
            }
            return false;
        },

        /**
         * Checks whether the given target `player` is looking at me `npc`
         * @param {ICustomNpc} me 
         * @param {IPlayer} target 
         * @param {number} viewAngle 
         * @param {number} maxDistance 
         * @returns {boolean} True if target is looking directly at me; False otherwise.
         */
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

        /**
         * Rotates a player to face a given target position.
         *
         * @param {IPlayer} player - The player whose rotation will be changed.
         * @param {IVector} target - The position or vector the player should face.
         *
         * @remarks
         * This function calculates the direction from the player to the target and updates
         * the player's yaw accordingly. If the target is `null`, the function broadcasts an error
         * message and exits early.
         *
         * @warning
         * Does not affect pitch (vertical rotation). Only horizontal facing is applied.
         */
        PlayerFaceTarget: function PlayerFaceTarget(player, target) {
            if (target == null) {
                Utilities.Broadcast("ERROR! 'target' from PlayerFaceEntity(target) was null!");
                return;
            }
            var dir = Utilities.GetDirectionTowardsTarget(player, target);
            this.SetPlayerRotation(player, 360 - Utilities.Angle(dir.x, dir.z), 0);
        },

        /**
         * Rotates an NPC entity to face a given target.
         *
         * @param {ICustomNpc} entity - The NPC entity to rotate.
         * @param {IEntity} target - The target entity to look towards
         */
        EntityFaceTarget: function EntityFaceTarget(entity, target) {
            entity.setRotation(90 + Utilities.Angle(entity.z - target.z, entity.x - target.x));
        },

        /**
         * Rotates an NPC entity to face a given direction vector.
         *
         * @param {ICustomNpc} entity - The NPC entity to rotate.
         * @param {IVector} vec - The vector direction to face toward.
         *
         * @remarks
         * Uses the entity's internal `lookAi` component to control facing direction.
         */
        EntityFaceDirection: function EntityFaceDirection(entity, vec) {
            var lookAI = entity.getMCEntity().lookAi;
            if (lookAI != null) // HACK: sometimes null depending on call location
                lookAI.rotate(this.Angle(entity.x - vec.x, entity.z - vec.z));
        },

        /**
         * Teleports a player to the given coordinates and rotation.
         *
         * @param {IPlayer} player - The player to teleport.
         * @param {number} x - Target X coordinate.
         * @param {number} y - Target Y coordinate.
         * @param {number} z - Target Z coordinate.
         * @param {number} yaw - Player's new yaw rotation.
         * @param {number} pitch - Player's new pitch rotation.
         */
        SetPlayerPosition: function SetPlayerPosition(player, x, y, z, yaw, pitch) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            // HACK: setPitch() is non-functional, so just use MC built-in <TP> command
            API.executeCommand(player.world, "/tp " + player.getDisplayName() + " " + x + " " + y + " " + z + " " + yaw + " " + pitch);
        },

        /**
         * Sets the player's rotation (yaw and pitch) without changing position.
         *
         * @param {IPlayer} player - The player to rotate.
         * @param {number} yaw - The new horizontal rotation (in degrees).
         * @param {number} pitch - The new vertical rotation (in degrees).
         */
        SetPlayerRotation: function SetPlayerRotation(player, yaw, pitch) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            // HACK: setPitch() is non-functional, so just use MC built-in <TP> command
            API.executeCommand(player.world, "/tp " + player.getDisplayName() + " ~ ~ ~ " + yaw + " " + pitch);
        },

        /**
         * Sets the player's pitch (vertical rotation) while maintaining position and yaw.
         *
         * @param {IPlayer} player - The player whose pitch will be changed.
         * @param {number} pitch - The new vertical rotation (in degrees).
         */
        SetPlayerPitch: function SetPlayerPitch(player, pitch) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            // HACK: setPitch() is non-functional, so just use MC built-in <TP> command
            API.executeCommand(player.world, "/tp " + player.getDisplayName() + " "
                + player.x + " " + player.y + " " + player.z + " " + player.getRotation() + " " + pitch);
        },

        /**
         * Attemps to locate a safe (not in a wall) location near the given entity.
         * If no safe position is found, returns the entity's current position; The Y-height of the NPC is preserved.
         * @param {IEntity} entity - given entity, to be used as a starting point
         * @param {number} rMin - minimum distance from entity
         * @param {number} rMax  - maximum distance from entity
         * @returns {IVector} The vector coordinate for a safe location near the given entity, 
         * at least `rMin` from the entity and at most `rMax` from the entity distance away.
         */
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

        /**
         * Returns whether an enemy is in attack range
         * @param {IPlayer} player 
         * @param {number} range 
         * @returns {boolean} True if in attack range; False otherwise.
         */
        IsEnemyNearby: function IsEnemyNearby(player, range) {
            var ne = player.world.getNearbyEntities(player.pos, range, 2);
            for (var i = 0; i < ne.length; i++)
                // @ts-ignore
                if (ne[i].getFaction().playerStatus(player) == -1)
                    return true;
            return false;
        },

        /**
         * Returns whether the given position is air (safe) or in a wall (not-safe)
         * @param {IWorld} world - the desired world
         * @param {IVector} v - the given position vector
         * @returns {boolean} `true` if the given position is safe, `false` if it is not safe
         */
        IsTeleportPosSafe: function IsTeleportPosSafe(world, v) {
            return (world.getBlock(v.x, v.y, v.z).getName() == "minecraft:air"
                && world.getBlock(v.x, v.y + 1, v.z).getName() == "minecraft:air");
        },

        /**
         * Returns a random positive or negative number between two values.
         * @param {number} min - The minimum bound of the range.
         * @param {number} max - The maximum bound of the range.
         * @returns {number} A random number between `min` and `max` which may be assigned a positive or a negative.
         */
        GetRandomRadius: function GetRandomRadius(min, max) {
            var rand = Math.random() * (max - min) + min;
            return Math.random() > 0.5 ? rand : rand * -1;
        },

        /**
         * Sorts the given numbers array in ascending order.
         * @param {number[]} arr - The array of numbers to sort. The array is modified in place.
         */
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

        /**
         * Checks whether a string contains a given substring or character.
         * @param {string} strBase - The base string to search within.
         * @param {string} substringSearch - The substring or character to search for.
         * @returns {boolean} `true` if `strSearch` is found in `strBase`, otherwise `false`
         */
        StringIncludes: function StringIncludes(strBase, substringSearch) {
            return strBase.indexOf(substringSearch) !== -1;
        },

        /**
         * Removes the first occurrence of a specified substring from a base string.
         * If the substring does not exist, the original string is returned unchanged.
         * @param {string} strBase - The string to modify.
         * @param {string} substringRemove - The substring to remove.
         * @returns {string} The modified string with `strRemove` removed.
         */
        RemoveSubstring: function RemoveSubstring(strBase, substringRemove) {
            return strBase.substring(0, strBase.indexOf(substringRemove))
                + strBase.substring(strBase.indexOf(substringRemove) + substringRemove.length, strBase.length);
        },

        /**
         * Clamps a number between a minimum and maximum value.
         * @param {number} num - The number to clamp.
         * @param {number} min - The minimum allowable value.
         * @param {number} max - The maximum allowable value.
         * @returns {number} The clamped value, guaranteed to be between `min` and `max`.
         */
        Clamp: function Clamp(num, min, max) {
            return Math.min(max, Math.max(min, num));
        },

        /**
         * Finds the index of the nth occurrence of a character within a string.
         * @param {string} str - The string to search.
         * @param {string} char - The character to look for.
         * @param {number} index - The nth occurrence to locate (must be ≥ 1).
         * @throws Will throw an error if `index` is less than 1.
         * @returns {number} The zero-based index of the nth occurrence, or `-1` if not found.
         */
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

        /**
         * Converts a 24-bit integer color value (0xRRGGBB) into an RGB object.
         * @param {number} colorInt - The integer color value to convert.
         * @returns {{r: number, g: number, b: number}} An object containing the red, green, and blue components (0–255).
         */
        IntToRGB: function IntToRGB(colorInt) {
            var r = (colorInt >> 16) & 0xFF;
            var g = (colorInt >> 8) & 0xFF;
            var b = colorInt & 0xFF;
            return { r: r, g: g, b: b };
        },

        /**
         * Converts red, green, and blue color components into a single 24-bit integer value (0xRRGGBB).
         * @param {number} r - The red component (0–255).
         * @param {number} g - The green component (0–255).
         * @param {number} b - The blue component (0–255).
         * @returns {number} The combined 24-bit integer color value.
         */
        RGBToInt: function RGBToInt(r, g, b) {
            return (r << 16) | (g << 8) | b;
        },

        /**
         * Converts an HSV color value to its equivalent RGB representation.
         * @param {number} h - Hue, in the range [0, 1].
         * @param {number} s - Saturation, in the range [0, 1].
         * @param {number} v - Value (brightness), in the range [0, 1].
         * @returns {{r: number, g: number, b: number}} An object containing the red, green, and blue components (0–255).
         */
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

        /**
         * Removes `number` amount of items from the player's inventory of type `itemID`
         * @param {IPlayer} player 
         * @param {string} itemID 
         * @param {number} numToRemove 
         */
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

        /**
         * Finds all item tags on the given entityItem, ignores items that may cause a script-error
         * @param {IEntityItem} entityItem 
         * @returns {ITagObject | null} A tag object containing all tags on the given `itemStack`
         * or `null` if an invalid `itemStack` is provided.
         */
        GetEntityTags: function GetEntityTags(entityItem) {
            return this.GetItemTags(entityItem.getItem());
        },

        /**
         * Finds all item tags on the given itemStack, ignores items that may cause a script-error
         * @param {IItemStack} itemStack 
         * @returns {ITagObject | null} A tag object containing all tags on the given `itemStack`
         * or `null` if an invalid `itemStack` is provided.
         */
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

        /**
         * Finds all item tags on the given itemStack.
         * @param {IItemStack} itemStack 
         * @returns {ITagObject} A tag object containing all tags on the given `itemStack`
         * @throws Will throw if an invalid Minecraft-JSON is provided
         * @remarks **Warning:** This function will scriptError if invalid JSON is given.
         */
        GetItemTagsUnsafe: function GetItemTagsUnsafe(itemStack) {
            var validJSON = this.GetValidJSON(itemStack.getItemNbt().toJsonString());
            var obj = JSON.parse(validJSON);
            return obj.tag != null ? obj.tag : null;
        },

        /**
         * Converts MC/CustomNpcs-formatted JSON to readible JSON that can be parsed.
         * @param {string} MCJSONFormatFile - Minecraft JSON data
         * @returns {string} Valid-parsable JSON, which is not in the Minecraft format
         * 
         * @remarks **Warning:** This function performs a naive regex replacement and may fail to 
         * produce valid JSON for unexpected input formats. In particular, invalid colon `:` placement.
         */
        GetValidJSON: function GetValidJSON(MCJSONFormatFile) {
            return MCJSONFormatFile.replaceAll(": [ ]*([\\w@\\.-]+)", ": \"$1\"");
        },

        /**
         * Checks whether the given iTagObject contains a tag with the given name.
         * @param {ITagObject} tagObj - The tag object to search.
         * @param {string} tagName - The name of the tag to find.
         * @returns {boolean} True if found; otherwise false.
         */
        HasTag: function HasTag(tagObj, tagName) {
            for (var tagKey in tagObj) {
                if (tagKey == tagName)
                    return true;
            }
            return false;
        },

        /**
         * Is the player wearing a full set of armor, each piece must have the given tag on them.
         * @param {IPlayer} player 
         * @param {string} tag
         * @returns {boolean} True if player is wearing a full set of armor and each piece as the `tag` on it; False otherwise.
         */
        IsWearingFullSet: function IsWearingFullSet(player, tag) {
            for (var i = 0; i < 4; i++) {
                if (!this.IsWearing(player, i, tag)) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Determines whether the player wearing an armor piece with the given tag?
         * @param {IPlayer} player 
         * @param {number} slot - 0:boots, 1:pants, 2:body, 3:head
         * @param {string} tag 
         * @returns {boolean} True if player is wearing an item in the specified slot and it has the given `tag` on the item; False otherwise.
         */
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

        /**
         * Plays a sound at the given world coordinates for nearby players.
         *
         * @param {number} x - The X position where the sound should play.
         * @param {number} y - The Y position where the sound should play.
         * @param {number} z - The Z position where the sound should play.
         * @param {string} soundName - The name of the sound; part of Minecraft or specified in sounds.json
         * @param {number} [OPTIONAL_volume=64] - **Optional** : Playback volume for the sound. Defaults to `64`.
         * @warning This function calls the `/playsound` commands in the game world and will fail silently  
         * if the given soundName doesn't exist.
         */

        PlayAt: function PlayAt(x, y, z, soundName, OPTIONAL_volume) {
            if (OPTIONAL_volume == null) { OPTIONAL_volume = 64; }

            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var np = API.getIWorlds()[0].getNearbyEntities(x, y, z, 32, 1);
            for (var i = 0; i < np.length; i++) {

                // HACK: avoid "The sound is too far away to be heard" warning msg on 1.16.X
                var prefix = "";
                if (Utilities.GetMCVersion() != "1.12.2") {
                    prefix = "execute at " + np[i].getName() + " run "
                }

                API.executeCommand(np[i].world, "/" + prefix + "playsound " + soundName + " voice " + np[i].getName()
                    + " " + x + " " + y + " " + z + " " + OPTIONAL_volume);
            }
        },

        /**
         * Plays a sound either to the given player or to all players near a given NPC,
         * depending on whether an iPlayer or iNPC is given.
         *
         * - If the entity is a **player**, the sound plays directly for that player.  
         * - If the entity is an **NPC**, the sound plays for all players near the NPC.
         *
         * @param {IEntity} entity - The target entity (player or NPC).
         * @param {string} soundName - The name of the sound; part of Minecraft or specified in sounds.json
         * @param {number} [OPTIONAL_volume=64] - **Optional** : Playback volume for the sound. Defaults to `64`.
         *
         * @throws Will throw if `entity` is `null` is not a player/NPC.
         *
         * @warning This function calls the `/playsound` commands in the game world and will fail silently  
         * if the given soundName doesn't exist.
         */
        Play: function Play(entity, soundName, OPTIONAL_volume) {
            if (OPTIONAL_volume == null) { OPTIONAL_volume = 64; }
            if (entity == null) { throw ("\n\nUtilities: null entity given to Play(entity, soundName)\n"); }

            if (entity.getType() == 2) {
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var np = entity.world.getNearbyEntities(entity.x, entity.y, entity.z, 32, 1);
                for (var i = 0; i < np.length; i++) {
                    API.executeCommand(np[i].world, "/playsound " + soundName + " voice " + np[i].getName() + " "
                        + entity.x + " " + entity.y + " " + entity.z + " " + OPTIONAL_volume);
                }
            }
            else if (entity.getType() == 1) {
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.executeCommand(entity.world, "/playsound " + soundName + " voice " + entity.getName() + " "
                    + entity.x + " " + entity.y + " " + entity.z + " " + OPTIONAL_volume);
            }
            else
                throw ("\n\nUtilities: the entity given to Play(entity, soundName) was neither a player, nor an NPC."
                    + "\nPass in an NPC or player entity.\n");
        },

        /**
         * Stops a sound for a specific player or for all players near a given NPC,
         * depending on whether an iPlayer or iNPC is given.
         *
         * - If the entity is a **player**, only that player stops hearing the sound.  
         * - If the entity is an **NPC**, all players near that NPC stop hearing the sound.
         *
         * @param {IEntity} entity - The target entity (player or NPC).
         * @param {string} soundName - The name of the sound; part of Minecraft or specified in sounds.json
         *
         * @throws Will throw if `entity` is `null` is not a player/NPC.
         */
        Stop: function Stop(entity, soundName) {
            if (entity == null) { throw ("\n\nUtilities: null entity given to Stop(entity, soundName)\n"); }

            if (entity.getType() == 2) {
                var np = entity.world.getNearbyEntities(entity.pos, 32, 1);
                for (var i = 0; i < np.length; i++) {
                    // @ts-ignore
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

        /**
         * Checks whether the given StandardUtil plugin installed.
         * @param {string} pluginName 
         * @returns {boolean} True if a plugin is already installed with the given pluginName; False otherwise.
         */
        IsPluginInstalled: function IsPluginInstalled(pluginName) {
            for (var i = 0; i < Plugins.length; i++) {
                if (Plugins[i] == pluginName)
                    return true;
            }
            return false;
        },
        /**
         * Installs a StandardUtil plugin with the given `pluginName`
         * @param {string} pluginName 
         */
        InstallPlugin: function InstallPlugin(pluginName) {
            Plugins.push(pluginName);
        }
    }
}());

