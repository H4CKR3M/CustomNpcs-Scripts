/* v2.0 - HSpawnpointPlayer | Playerscript | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Requires: HyperSpawnpoint12
 */

var HSpawnpointPlayer = (function(){
    return {  
        Login: function Login(e){ HSpawnpointPlayer.P.Login(e); },
        Logout: function Logout(e){ HSpawnpointPlayer.P.Logout(e); },

        P: {
            Login: function Login(e){
                if (typeof HyperSpawn === 'undefined') { throw("\n\nHSpawnpointPlayer: You forgot to load the script HyperSpawnpoint12\n\n"); }
                
                var world = e.player.world;
                this.Broadcast(e.player.world, "Someone logged in!");
            
                // Create a new database if one does not exist
                if (!world.getTempdata().has(HyperSpawn.databaseName)){
                    this.Broadcast(e.player.world, "Creating new database...");
                    var playerSpawnpointDatabase = Object.create(HyperSpawn.playerSpawnpointDatabase);
                    world.getTempdata().put(HyperSpawn.databaseName, playerSpawnpointDatabase);
                }
            
                // Check if player is in the database
                var playerInDatabase = false;
                var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);
                for(var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++){
                    if (playerSpawnpointDatabase.playerSpawnpoints[i].name == e.player.getDisplayName()){
                        playerInDatabase = true;
                        this.Broadcast(e.player.world, "Player already in database!");
            
                        if (e.player.getGamemode() == 3)
                            this.HandleSpectatorPlayer(e.player, playerSpawnpointDatabase.playerSpawnpoints[i], playerSpawnpointDatabase, null);
            
                        break;
                    }
                }
            
                // If player is not in the database (1st time logging in since server restart),
                // Use world data to find the player's spawnpoint and add them to the database
                if (!playerInDatabase){
            
                    this.Broadcast(e.player.world, "Player is NOT in the database");
                    this.Broadcast(e.player.world, "Adding player to database...");
            
                    // If they have no world data, assign them to the default/first world spawnpoint (NOT WORLD ORIGIN)
                    var ID = "none";
            
                    // Get saved world data
                    if (world.getStoreddata().has(e.player.getDisplayName())){
                        var playerWorldData = world.getStoreddata().get(e.player.getDisplayName());
                        var storedString = playerWorldData.split(',');
            
                        ID = storedString[0];
                        HyperSpawn.defaultStart.x = storedString[1];
                        HyperSpawn.defaultStart.y = storedString[2];
                        HyperSpawn.defaultStart.z = storedString[3];
            
                        this.Broadcast(e.player.world, "§8[§eWARNING§8]§7 Stored Data found! Loading Stored Data...");
                    }
                    
                    // Create a brand new player spawnpoint
                    var playerSpawnpoint = Object.create(HyperSpawn.playerSpawnpoint);
                    playerSpawnpoint.name = e.player.getDisplayName();
                    playerSpawnpoint.ID = ID;
                    playerSpawnpoint.pos = HyperSpawn.defaultStart;
                    playerSpawnpoint.yaw = HyperSpawn.defaultYaw;
                    playerSpawnpoint.pitch = HyperSpawn.defaultPitch;

                    playerSpawnpointDatabase.SavePlayerSpawnpoint(world, playerSpawnpoint);
                    world.getTempdata().put(HyperSpawn.databaseName, playerSpawnpointDatabase);
            
                    // If player logged off on Spectator Mode & Server Restarted
                    if (e.player.getGamemode() == 3)
                        this.HandleSpectatorPlayer(e.player, playerSpawnpoint, playerSpawnpointDatabase, null);
                }
            },
    
            Logout: function Logout(e){
                var world = e.player.world;
        
                this.Broadcast(world, e.player.getDisplayName() + " has logged out!");
            
                var playerSpawnpointDatabase = null;
                if (world.getTempdata().has(HyperSpawn.databaseName)){
                    playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);
                }
            
                if (playerSpawnpointDatabase != null){
                    for(var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++){
                        var foundPlayerName = playerSpawnpointDatabase.playerSpawnpoints[i].name;
                        var foundPlayer = world.getPlayer(foundPlayerName);
                        if (foundPlayer != null){
                            
                            if (foundPlayer.getGamemode() == 3){
                                this.Broadcast(world, foundPlayerName + " was found to be on Spectator, and is in the same spawnpoint group as " + e.player.getDisplayName() + ", Deciding whether to revive " + foundPlayerName + "...");
                                this.HandleSpectatorPlayer(foundPlayer, playerSpawnpointDatabase.playerSpawnpoints[i], playerSpawnpointDatabase, e.player);
                            }
                        }
                    }
                }
            },
    
            // If player is in spectator mode & there are no other players linked to his spawnpoint, revive him
            HandleSpectatorPlayer: function HandleSpectatorPlayer(player, playerSpawnpoint, playerSpawnpointDatabase, ignorePlayer){
            
                var spawnPos = { x:playerSpawnpoint.pos.x, y:playerSpawnpoint.pos.y, z:playerSpawnpoint.pos.z };
                var yaw = playerSpawnpoint.yaw;
                var pitch = playerSpawnpoint.pitch;
            
                // Redundancy: If for some reason they belong to a 'none' spawnpoint, revive them
                if (playerSpawnpoint.ID == "none"){
                    this.RevivePlayer(player, spawnPos, yaw, pitch);
                    return;
                }
                this.Broadcast(player.world, "Handling spectating player...");
            
                var foundTeammateInSameSpawnpoint = false;
                for(var j = 0; j < playerSpawnpointDatabase.playerSpawnpoints.length; j++){
                    // Optional IgnorePlayer Option. Useful for players preparing to logout
                    if (ignorePlayer != null && playerSpawnpointDatabase.playerSpawnpoints[j].name == ignorePlayer.getDisplayName())
                        continue;
            
                    // Locate at least 1 living player with the same spawnpoint ID (They must NOT have touched any NEW spawnpoints since the player logged off)
                    var teammateName = playerSpawnpointDatabase.playerSpawnpoints[j].name;
                    if (teammateName != player.getDisplayName() && playerSpawnpointDatabase.playerSpawnpoints[j].ID == playerSpawnpoint.ID && this.GetPlayerStatus(player.world, teammateName) == 1){
                        if (this.ArePositionsIdentical(player.world, playerSpawnpointDatabase.playerSpawnpoints[j].pos, playerSpawnpoint.pos) == true){
                            this.Broadcast(player.world, "Teammate found!");
                            foundTeammateInSameSpawnpoint = true;
                            break;
                        }
                        else{
                            // We found a teammate at a different spawnpoint with the same ID, we should spawn there instead of our spawnpoint
                            spawnPos = playerSpawnpointDatabase.playerSpawnpoints[j].pos;
                        }
                    }
                }
                if (foundTeammateInSameSpawnpoint == false){
                    this.Broadcast(player.world, "Reviving a lone Spectating Player");
                    this.RevivePlayer(player, spawnPos, yaw, pitch);
                }
            },
            
            // OFFLINE:-1, SPECTATING:0, Alive:1
            GetPlayerStatus: function GetPlayerStatus(world, playerName){
                var playerEntity = world.getPlayer(playerName);
            
                if (playerEntity == null){ return -1; }
                else if (playerEntity.getGamemode() == 3) { return 0; }
                else { return 1; }
            },

            // Changes given player GameMode and warps them to a given position
            RevivePlayer: function RevivePlayer(playerEntity, pos, yaw, pitch){
                playerEntity.addPotionEffect(11, 4, 5, true);
                playerEntity.setGamemode(HyperSpawn.defaultGamemode);
                var dummy = {
                    name: "",
                    ID: "none",
                    pos: pos,
                    yaw: yaw,
                    pitch: pitch,
                }
                HyperSpawn.Teleport(playerEntity, dummy);
            },
            
            // Returns whether two spawnpoint positions are the same
            ArePositionsIdentical: function ArePositionsIdentical(world, pos1, pos2){
                this.Broadcast(world, "Comparing " + pos1.x + " with " + pos2.x);
                return pos1.x == pos2.x && pos1.y == pos2.y && pos1.z == pos2.z;
            },
    
            Broadcast: function Broadcast(world, text){
                if (HyperSpawn.debugPlayer)
                    this.Alert(world, text);
            },

            Alert: function Alert(world, text){
                world.broadcast("§8[§7§lHS12§8][§cP§8]§7 " + text);
            },
        },
    }
}());