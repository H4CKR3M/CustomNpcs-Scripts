/* v2.0 - HyperSpawnpoint12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Load This Script on all HScript Objects (HSpawnpointOrigin, HSpawnpointPlayer, actual spawnpoint blocks in the world) */        

var HyperSpawn = (function(){
    return {  

        databaseName: "playerSpawnpointDatabase",
        illegalTags: [ "illegal" ],
        debug: false,
        debugPlayer: false,
        defaultGamemode: 2,
        defaultStart: { x:-484.5, y:65.5, z:-246.5 },
        //defaultStart: { x:100.5, y:100.5, z:100.5 },
        defaultYaw: 0,
        defaultPitch: 0,
        worldOriginRange: 2,

        // Block to be created and placed around the world.
        hyperSpawnpoint: {
            ID: "ID", // identifier all spawners use (in same group/adventure map), if "none" -> disable spectator mechanic
            pos: { x:0, y:0, z:0},
            yaw: 0,
            pitch: 0,
            range: 3,
            stopBossMusic: false,
            block: null,
            world: null,

            // OPTIONAL: Runs setup automatically so you don't have to manually set block / world / pos
            QuickSetup: function QuickSetup(block){
                this.pos.x = block.x+0.5;
                this.pos.y = block.y+2;
                this.pos.z = block.z+0.5;
                this.ID = "ID";
                this.block = block;
                this.world = block.world;
                this.block.model = "minecraft:sea_lantern";
            },
        
            // Locates nearby players & saves their spawnpoints
            SaveNearbyPlayers: function SaveNearbyPlayers(){
                if (this.block == null || this.world == null) { return; }

                // Look for nearby players
                var np = this.world.getNearbyEntities(this.pos.x, this.pos.y, this.pos.z, this.range, 1);
                if (np.length == 0)
                    return;

                HyperSpawn.Broadcast(this.world, "Spawnpoint Called! ================================");

                // Grab the playerSpawnpointDatabase
                var playerSpawnpointDatabase = null;
                if (this.world.getTempdata().has(HyperSpawn.databaseName)){
                    playerSpawnpointDatabase = this.world.getTempdata().get(HyperSpawn.databaseName);
                }
                
                for(var i = 0; i < np.length; i++){
                    if(np[i].getGamemode() != 3 && !this.HasIllegalTags(np[i]) && np[i].isAlive()){

                        // Revive all Spectating Players if this is an ID-type spawnpoint and it is not the same spawnpoint that we just used. 
                        if (playerSpawnpointDatabase != null){
                            var oldPlayerSpawnpoint = playerSpawnpointDatabase.GetPlayerSpawnpoint(this.world, np[i]);
                            if (oldPlayerSpawnpoint != null){
                                // NOTE: Remove the this.AreSpawnpointsIdentical, for all spawnpoints (EVEN CURRENT ONE) to revive players
                                if (this.ID != "none" && this.AreSpawnpointsIdentical(oldPlayerSpawnpoint.pos.x, oldPlayerSpawnpoint.pos.y, oldPlayerSpawnpoint.pos.z) == false){
                                    HyperSpawn.Broadcast(this.world, "Reviving '" + this.ID + "' Spawnpoint!");
                                    this.ReviveEveryone(this.ID);
                                }
                                else if (this.ID == "none"){
                                    // Because We are a Spawnpoint and not a player, or ID is none. Grab the ID of whatever spawnpoint the player currently has.
                                    HyperSpawn.Broadcast(this.world, "Reviving '" + this.ID + "' Spawnpoint!");
                                    this.ReviveEveryone(oldPlayerSpawnpoint.ID);
                                }
                            }
                        }
                        if (this.stopBossMusic){
                            this.world.getTempdata().put("JBOSS", null);
                        }
                        this.SavePosition(np[i], this.ID, this.pos, this.yaw, this.pitch);
                    }
                }
            },

            // Returns whether player is in range of this spawnpoint
            IsPlayerNearby: function IsPlayerNearby(playerEntity){
                var np = this.world.getNearbyEntities(this.pos.x, this.pos.y, this.pos.z, this.range, 1);
                for(var i = 0; i < np.length; i++){
                    if(np[i] == playerEntity){
                        return true;
                    }
                }
                return false;
            },

            // Returns whether the player has a tag preventing this spawnpoint from being used.
            // EXCEPTION: If the spawnpoint ID is the same as the illegal tag, spawnpoint will function normally
            HasIllegalTags: function HasIllegalTags(playerEntity){
                for(var i = 0; i < HyperSpawn.illegalTags.length; i++){
                    if (playerEntity.hasTag(HyperSpawn.illegalTags[i]) == true && HyperSpawn.illegalTags[i] != this.ID){
                        HyperSpawn.Broadcast(playerEntity.world, "Illegal Tag Found! Spawnpoint not functional!");
                        return true;
                    }
                }
                return false;
            },

            // Saves spawnpoint for given player
            SavePosition: function SavePosition(playerEntity, newID, pos, yaw, pitch){
                HyperSpawn.Broadcast(playerEntity.world, "Saving Player position for " + playerEntity.getDisplayName());

                // Create a brand new player spawnpoint
                var playerSpawnpoint = Object.create(HyperSpawn.playerSpawnpoint);
                playerSpawnpoint.name = playerEntity.getDisplayName();
                playerSpawnpoint.ID = newID;
                playerSpawnpoint.pos = pos;
                playerSpawnpoint.yaw = yaw;
                playerSpawnpoint.pitch = pitch;

                // Save to playerSpawnpointDatabase
                if (playerEntity.world.getTempdata().has(HyperSpawn.databaseName)){
                    var playerSpawnpointDatabase = playerEntity.world.getTempdata().get(HyperSpawn.databaseName);
                    playerSpawnpointDatabase.SavePlayerSpawnpoint(playerEntity.world, playerSpawnpoint);
                    playerEntity.world.getTempdata().put(HyperSpawn.databaseName, playerSpawnpointDatabase);
                }

                // Save backup to world data in case the server restarts
                playerEntity.world.getStoreddata().put(playerEntity.getDisplayName(), newID + "," + pos.x + "," + pos.y + "," + pos.z);
            },

            // Revives Spectating Players, Teleports Them, & Saves their position to the current spawnpoint
            ReviveEveryone: function ReviveEveryone(ID){
                var playerSpawnpointDatabase = this.world.getTempdata().get(HyperSpawn.databaseName);

                HyperSpawn.Broadcast(this.world, "Reviving Everyone...");
            
                for(var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++){
                    HyperSpawn.Broadcast(this.world, "Searching Spawnpoint Database using ID: " + playerSpawnpointDatabase.playerSpawnpoints[i].ID + "...");
                    if (playerSpawnpointDatabase.playerSpawnpoints[i].ID == ID){
                        var foundPlayer = this.world.getPlayer(playerSpawnpointDatabase.playerSpawnpoints[i].name);
                        if (foundPlayer != null){
                            HyperSpawn.Broadcast(this.world, "Found Player '" + foundPlayer.getDisplayName() + "' using Spawnpoint ID: " + playerSpawnpointDatabase.playerSpawnpoints[i].ID + "!");
                            if (foundPlayer.getGamemode() == 3){
                                foundPlayer.addPotionEffect(11, 4, 5, true);
                                foundPlayer.setGamemode(HyperSpawn.defaultGamemode);
                                HyperSpawn.Teleport(foundPlayer, this);
                            }
                            this.ResetMobSpawners();

                            // Save player position to new spawnpoint REGARDLESS of whether they are in spectator or not
                            this.SavePosition(foundPlayer, this.ID, this.pos, this.yaw, this.pitch);
                        }
                    }
                }
            },

            // Resets mob spawners attached to this spawnpoint (if any exist)
            ResetMobSpawners: function ResetMobSpawners(){
                HyperSpawn.Broadcast(this.world, "Resetting mob spawners...");
                var empty = [];
                this.world.getTempdata().put(this.ID, empty);
            },

            AreSpawnpointsIdentical: function AreSpawnpointsIdentical(x, y, z){
                return this.pos.x == x && this.pos.y == y && this.pos.z == z;
            },
        },

        // Database saved to temp data while server is running
        playerSpawnpointDatabase: {
            playerSpawnpoints: [],

            SavePlayerSpawnpoint: function SavePlayerSpawnpoint(world, playerSpawnpoint){
                HyperSpawn.Broadcast(world, "Attempting to add player to database of " + this.playerSpawnpoints.length + "...");
                for(var i = 0; i < this.playerSpawnpoints.length; i++){
                    if (this.playerSpawnpoints[i].name  == playerSpawnpoint.name){
                        this.playerSpawnpoints[i] = playerSpawnpoint;
                        HyperSpawn.Broadcast(world, playerSpawnpoint.name + " Already in Database. §2[§8POSITION SAVED§2]");
                        return;
                    }
                }
                HyperSpawn.Broadcast(world, playerSpawnpoint.name + " added to Database. §2[§8POSITION SAVED§2]");
                this.playerSpawnpoints.push(playerSpawnpoint);
            },

            GetPlayerSpawnpoint: function GetPlayerSpawnpoint(world, playerEntity){
                for(var i = 0; i < this.playerSpawnpoints.length; i++){
                    if (this.playerSpawnpoints[i].name  == playerEntity.getDisplayName()){
                        HyperSpawn.Broadcast(world, "Successfully got player spawnpoint!");
                        return this.playerSpawnpoints[i];
                    }
                }
                HyperSpawn.Broadcast(world, "ERROR! Player not found!");
                return null;
            },
        },

        // Data structure for holding a players's spawnpoint while online
        playerSpawnpoint: {
            name: "",
            ID: "none",
            pos: { x:0, y:0, z:0},
            yaw: 0,
            pitch: 0,
        },

        Broadcast: function Broadcast(world, text){
            if (HyperSpawn.debug)
                world.broadcast("§8[§7§lHS12§8][§bS§8]§7 " + text);
        },

        // HACK: setPitch() is non-functional, so just use MC built-in <TP> command
        Teleport: function Teleport(player, pSpawnpoint){
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            API.executeCommand(player.world, "/tp " + player.getDisplayName() + " " + pSpawnpoint.pos.x + " " + pSpawnpoint.pos.y + " " + pSpawnpoint.pos.z + " " + pSpawnpoint.yaw + " " + pSpawnpoint.pitch);
        }
    }
}());