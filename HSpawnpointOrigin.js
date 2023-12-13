/* v1.8 - HSpawnpointOrigin | ScriptedBlock | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Requires: HyperSpawnpoint12
 *
 * Add this block to the worldspawn */

var HSpawnpointOrigin = (function(){
    return {  

        // Look for players that are near the worldspawn (Because they have died and need to be respawned)
        Tick: function Tick(e){ HSpawnpointOrigin.P.Tick(e); },

        P: {
            range: 2,

            Tick: function Tick(e){

                // Only trigger when a player is nearby
                var np = e.block.world.getNearbyEntities(e.block.pos, this.range, 1);
                if (np.length == 0)
                    return;
                
                this.Broadcast(e.block.world, "======== RESTARTING MAP STACK ========");

                if (typeof HyperSpawn === 'undefined') { throw("\n\HSpawnpointOrigin: You forgot to load the script HyperSpawnpoint12\n\n"); }
            
                // Gets the player spawnpoint database
                var world = e.block.getWorld();
                if (world.getTempdata().has(HyperSpawn.databaseName) == true){
                    
                    this.Broadcast(world, "Grabbed database");
            
                    if (world.getTempdata().has(HyperSpawn.databaseName)){
                        var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);
                        for(var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++){
                            var playerName = playerSpawnpointDatabase.playerSpawnpoints[i].name;
                
                            this.Broadcast(world, "User " + playerName + " found in spawnpoint database!");
                
                            // Filter out offline players
                            if (this.GetPlayerStatus(world, playerName) != -1){
                                this.Broadcast(world, "User " + playerName + " is online!");
                
                                // Filter out far away players
                                var playerEntity = world.getPlayer(playerName);
                                if (this.IsPlayerNearby(e.block, playerEntity, 5)){
                                    var playerSpawnpoint = playerSpawnpointDatabase.GetPlayerSpawnpoint(playerEntity.world, playerEntity);
                                    if (playerSpawnpoint != null){
                    
                                        // Spawnpoints using Default ID will always respawn their players.
                                        if (playerSpawnpoint.ID == "none"){
                                            HyperSpawn.Teleport(playerEntity, playerSpawnpoint);
                                        }
                                        // Unique Area ID Spawnpoints will put party members on spectator mode when killed
                                        // Party is set back to Adventure when they either all perish or they find a new spawnpoint with the same ID
                                        else {
                                            var foundTeammateInSameSpawnpoint = false;
                                            for(var j = 0; j < playerSpawnpointDatabase.playerSpawnpoints.length; j++){
                                                // Locate at least 1 living player with the same spawnpoint ID
                                                var teammateName = playerSpawnpointDatabase.playerSpawnpoints[j].name;
                                                if (teammateName != playerName && playerSpawnpointDatabase.playerSpawnpoints[j].ID == playerSpawnpoint.ID && this.GetPlayerStatus(world, teammateName) == 1){
                                                    this.Broadcast(world, "Teammate " + teammateName + " is alive, spawning " + playerName + " in spectator mode");
                
                                                    // Only msg dead if their spawnpoint has an ID (No 'none' type spawnpoints as those do not have a real spectate mode)
                                                    if (playerSpawnpoint.ID != "none")
                                                        this.Message(e.block, playerEntity, "[\"\",{\"text\":\"You died!\",\"bold\":true,\"color\":\"dark_red\"},{\"text\":\" Wait for your friends to beat the area.\",\"color\":\"red\"}]");
                                                    playerEntity.setGamemode(3);
                
                                                    // Revive at teammate's location (or the spawnpoint as a redundant fallback)
                                                    var teammateEntity = world.getPlayer(teammateName);
                                                    if (teammateEntity != null){
                                                        playerEntity.setPosition(teammateEntity.getPos().getX(), teammateEntity.getPos().getY() + 2, teammateEntity.getPos().getZ());
                                                        playerEntity.setRotation(teammateEntity.getRotation());
                                                    }
                                                    else{
                                                        HyperSpawn.Teleport(playerEntity, playerSpawnpoint);
                                                    }
                                                    
                                                    foundTeammateInSameSpawnpoint = true;
                                                    break;
                                                }
                                            }
                    
                                            // Player is playing solo, respawn him normally | OR all of his teammates are dead
                                            if (foundTeammateInSameSpawnpoint == false){
                                                this.Broadcast(world, "No Living players found! Respawn Everyone in the Group!");
                                                this.ReviveEveryone(world, playerSpawnpoint);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else{
                    e.block.world.broadcast("§c§lHOT RELOADING NOT SUPPORTED! §f- Logout/Login again!")
                }
            },

            IsPlayerNearby: function IsPlayerNearby(block, playerEntity, range){
                var np = block.world.getNearbyEntities(block.getPos(), range, 1);
                for(var i = 0; i < np.length; i++){
                    if(np[i] == playerEntity){
                        return true;
                    }
                }
                return false;
            },

            ReviveEveryone: function ReviveEveryone(world, playerSpawnpoint){
                if (world.getTempdata().has(HyperSpawn.databaseName)){
                    var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);

                    for(var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++){
                        if (playerSpawnpointDatabase.playerSpawnpoints[i].ID == playerSpawnpoint.ID){
                            var foundPlayer = world.getPlayer(playerSpawnpointDatabase.playerSpawnpoints[i].name);
                            if (foundPlayer != null){
                                if (foundPlayer.getGamemode() == 3){
                                    foundPlayer.addPotionEffect(11, 4, 5, true);
                                    foundPlayer.setGamemode(HyperSpawn.defaultGamemode);
                                }
                                this.ResetMobSpawners(world, playerSpawnpoint.ID);
                                HyperSpawn.Teleport(foundPlayer, playerSpawnpoint);
                            }
                        }
                    }
                }
            },

            ResetMobSpawners: function ResetMobSpawners(world, ID){
                this.Broadcast(world, "Resetting mob spawners...");
                var empty = [];
                world.getTempdata().put(ID, empty);
            },

            // OFFLINE:-1, SPECTATING:0, Alive:1
            GetPlayerStatus: function GetPlayerStatus(world, playerName){
                var playerEntity = world.getPlayer(playerName);
            
                if (playerEntity == null){ return -1; }
                else if (playerEntity.getGamemode() == 3) { return 0; }
                else { return 1; }
            },

            Broadcast: function Broadcast(world, text){
                if (HyperSpawn.debug)
                    world.broadcast(text);
            },

            Message: function Message(block, player, tellraw){
                block.executeCommand("/tellraw " + player.getDisplayName() + " " + tellraw);
            }
            
        }
    }
}());