/* v3.0 - HSpawnpointOrigin | ScriptedBlock | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Requires: HyperSpawnpoint12
 *
 * Add this block to the worldspawn */

var HSpawnpointOrigin = (function () { var _HSpawnpointOrigin = {};

    /* You must call "HSpawnpointOrigin.Tick(e)" on the world spawn scripted block. */
    _HSpawnpointOrigin.Tick = function (e) { P.Tick(e); };

    var P = {
        hotReloading: true,

        /* (OPTIONAL) HOT RELOADING SUPPORT via /noppes script reload */
        AutoExec: function AutoExec() {
            if (!this.hotReloading)
                return;

            // Preload HyperSpawnpoint12 ourselves
            if (typeof HyperSpawn === 'undefined')
                this.TryLoad("HyperSpawnpoint12.js");

            var world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorlds()[0];
            if (world.getTempdata().has(HyperSpawn.databaseName))
                return;

            if (typeof HyperSpawn !== 'undefined') {
                var ap = world.getAllPlayers();
                for (var i = 0; i < ap.length; i++) {
                    var player = ap[i];

                    // Create a new database if one does not exist
                    if (!world.getTempdata().has(HyperSpawn.databaseName)) {
                        this.Broadcast(world, "HotReload: Creating new database...");
                        var playerSpawnpointDatabase = Object.create(HyperSpawn.playerSpawnpointDatabase);
                        world.getTempdata().put(HyperSpawn.databaseName, playerSpawnpointDatabase);
                        this.Broadcast(world, "HotReload: Created new database");
                    }
                    else {
                        var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);
                    }

                    this.Broadcast(world, "HotReload: Player is NOT in the database");
                    this.Broadcast(world, "HotReload: Adding player to database...");

                    // If they have no world data, assign them to the default/first world spawnpoint (NOT WORLD ORIGIN)
                    var ID = "none";

                    // Get saved world data
                    if (world.getStoreddata().has(player.getDisplayName())) {
                        var playerWorldData = world.getStoreddata().get(player.getDisplayName());
                        var storedString = playerWorldData.split(',');

                        ID = storedString[0];
                        HyperSpawn.defaultStart.x = storedString[1];
                        HyperSpawn.defaultStart.y = storedString[2];
                        HyperSpawn.defaultStart.z = storedString[3];

                        this.Broadcast(world, "HotReload: WARNING! Stored Data found! Loading Stored Data...");
                    }

                    // Create a brand new player spawnpoint
                    var playerSpawnpoint = Object.create(HyperSpawn.playerSpawnpoint);
                    playerSpawnpoint.name = player.getDisplayName();
                    playerSpawnpoint.ID = ID;
                    playerSpawnpoint.pos = HyperSpawn.defaultStart;
                    playerSpawnpoint.yaw = HyperSpawn.defaultYaw;
                    playerSpawnpoint.pitch = HyperSpawn.defaultPitch;

                    playerSpawnpointDatabase.SavePlayerSpawnpoint(world, playerSpawnpoint);
                    world.getTempdata().put(HyperSpawn.databaseName, playerSpawnpointDatabase);

                }
            }
        },

        Tick: function Tick(e) {
            if (typeof HyperSpawn === 'undefined') { throw ("\n\nSpawnpointOrigin: You forgot to load the script HyperSpawnpoint12\n\n"); }
            if (typeof e.player !== 'undefined') { throw ("\n\nSpawnpointOrigin: This script cannot be loaded on the Player.\nInstead, please loaded it on the World Origin Block.\n\n") }

            // Only trigger when a player is nearby
            var np = e.block.world.getNearbyEntities(e.block.pos, HyperSpawn.worldOriginRange, 1);
            if (np.length == 0)
                return;

            this.Broadcast(e.block.world, "======== RESTARTING MAP STACK ========");

            // Gets the player spawnpoint database
            var world = e.block.getWorld();
            if (world.getTempdata().has(HyperSpawn.databaseName) == true) {

                this.Broadcast(world, "Grabbed database");

                if (world.getTempdata().has(HyperSpawn.databaseName)) {
                    var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);
                    for (var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++) {
                        var playerName = playerSpawnpointDatabase.playerSpawnpoints[i].name;

                        this.Broadcast(world, "User " + playerName + " found in spawnpoint database!");

                        // Filter out offline players
                        if (this.GetPlayerStatus(world, playerName) != -1) {
                            this.Broadcast(world, "User " + playerName + " is online!");

                            // Filter out far away players
                            var playerEntity = world.getPlayer(playerName);
                            if (this.IsPlayerNearby(e.block, playerEntity, HyperSpawn.worldOriginRange + 3)) {
                                var playerSpawnpoint = playerSpawnpointDatabase.GetPlayerSpawnpoint(playerEntity.world, playerEntity);
                                if (playerSpawnpoint != null) {

                                    // User Warning if Default Start is not changed
                                    if (HyperSpawn.defaultStart.x == 100.5 && HyperSpawn.defaultStart.y == 100.5 && HyperSpawn.defaultStart.y == 100.5) {
                                        this.Alert(world, "§eTeleporting to start at §7§o(100.5, 100.5, 100.5)§e.\nDon't forget to set the §3defaultStart§e in §3HyperSpawnpoint12.js");
                                    }

                                    // Spawnpoints using Default ID will always respawn their players.
                                    if (playerSpawnpoint.ID == "none") {
                                        HyperSpawn.Teleport(playerEntity, playerSpawnpoint);
                                    }
                                    // Unique Area ID Spawnpoints will put party members on spectator mode when killed
                                    // Party is set back to Adventure when they either all perish or they find a new spawnpoint with the same ID
                                    else {
                                        var foundTeammateInSameSpawnpoint = false;
                                        for (var j = 0; j < playerSpawnpointDatabase.playerSpawnpoints.length; j++) {
                                            // Locate at least 1 living player with the same spawnpoint ID
                                            var teammateName = playerSpawnpointDatabase.playerSpawnpoints[j].name;
                                            if (teammateName != playerName && playerSpawnpointDatabase.playerSpawnpoints[j].ID == playerSpawnpoint.ID && this.GetPlayerStatus(world, teammateName) == 1) {
                                                this.Broadcast(world, "Teammate " + teammateName + " is alive, spawning " + playerName + " in spectator mode");

                                                // Only msg dead if their spawnpoint has an ID (No 'none' type spawnpoints as those do not have a real spectate mode)
                                                if (playerSpawnpoint.ID != "none")
                                                    this.Message(e.block, playerEntity, "[\"\",{\"text\":\"You died!\",\"bold\":true,\"color\":\"dark_red\"},{\"text\":\" Wait for your friends to beat the area.\",\"color\":\"red\"}]");
                                                playerEntity.setGamemode(3);

                                                // Revive at teammate's location (or the spawnpoint as a redundant fallback)
                                                var teammateEntity = world.getPlayer(teammateName);
                                                if (teammateEntity != null) {
                                                    playerEntity.setPosition(teammateEntity.getPos().getX(), teammateEntity.getPos().getY() + 2, teammateEntity.getPos().getZ());
                                                    playerEntity.setRotation(teammateEntity.getRotation());
                                                }
                                                else {
                                                    HyperSpawn.Teleport(playerEntity, playerSpawnpoint);
                                                }

                                                foundTeammateInSameSpawnpoint = true;
                                                break;
                                            }
                                        }

                                        // Player is playing solo, respawn him normally | OR all of his teammates are dead
                                        if (foundTeammateInSameSpawnpoint == false) {
                                            this.Broadcast(world, "No Living players found! Respawn ALL in Group §3" + playerSpawnpoint.ID);
                                            this.ReviveEveryone(world, playerSpawnpoint);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else if (!this.hotReloading) {
                this.Alert(e.block.world, "§c§lHOT RELOADING DISABLED! §fLogout/Login again!");
            }
        },

        IsPlayerNearby: function IsPlayerNearby(block, playerEntity, range) {
            var np = block.world.getNearbyEntities(block.getPos(), range, 1);
            for (var i = 0; i < np.length; i++) {
                if (np[i] == playerEntity) {
                    return true;
                }
            }
            return false;
        },

        ReviveEveryone: function ReviveEveryone(world, playerSpawnpoint) {
            if (world.getTempdata().has(HyperSpawn.databaseName)) {
                var playerSpawnpointDatabase = world.getTempdata().get(HyperSpawn.databaseName);

                for (var i = 0; i < playerSpawnpointDatabase.playerSpawnpoints.length; i++) {
                    if (playerSpawnpointDatabase.playerSpawnpoints[i].ID == playerSpawnpoint.ID) {
                        var foundPlayer = world.getPlayer(playerSpawnpointDatabase.playerSpawnpoints[i].name);
                        if (foundPlayer != null) {
                            if (foundPlayer.getGamemode() == 3) {
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

        ResetMobSpawners: function ResetMobSpawners(world, ID) {
            this.Broadcast(world, "Resetting mob spawners...");
            var empty = [];
            world.getTempdata().put(ID, empty);
        },

        // OFFLINE:-1, SPECTATING:0, Alive:1
        GetPlayerStatus: function GetPlayerStatus(world, playerName) {
            var playerEntity = world.getPlayer(playerName);

            if (playerEntity == null) { return -1; }
            else if (playerEntity.getGamemode() == 3) { return 0; }
            else { return 1; }
        },

        Broadcast: function Broadcast(world, text) {
            if (HyperSpawn.debugPlayer)
                this.Alert(world, text);
        },

        Alert: function Alert(world, text) {
            world.broadcast("§8[§7§lHS12§8][§6O§8]§7 " + text);
        },

        Message: function Message(block, player, tellraw) {
            block.executeCommand("/tellraw " + player.getDisplayName() + " " + tellraw);
        },

        TryLoad: function TryLoad(fileName) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var source = new java.io.File(API.getWorldDir() + "/scripts/ecmascript");
            if (!source.exists()) {
                source.mkdir();
                return false;
            }
            if (source.isDirectory()) {
                var listFile = source.listFiles();
                for (var i = 0; i < listFile.length; i++) {
                    var f = listFile[i];
                    if (!f.isDirectory() && f.getName() == fileName) {
                        try {
                            load(f);
                        } catch (ex) {
                            ex.printStackTrace(java.lang.System.out);
                            break;
                        }
                    }
                }
            }
        }
    }; P.AutoExec();
    return _HSpawnpointOrigin;
}());