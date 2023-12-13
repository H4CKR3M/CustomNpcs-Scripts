/* v1.2 - HyperMobSpawner12 | Loadable From Anywhere | Minecraft 1.12.2 (05Jul20) | Written by Rimscar 
 * Load This Script on all HMobSpawner Objects */

var HyperMobSpawner = (function(){
    return {  
        debug: false,

        mobSpawner: {
            // Configurable Variables
            mobSpawnerID: "",
            hyperSpawnpointID: "ID",
            mobLocations: [], //{ x:0000, y:0000, z:0000, prefab: "" }
            mobSummonTab: 1,
            pos: { x:0, y:0, z:0},
            range: 5,
            despawnRange: 130,
            block: null,
            world: null,
            

            /* Managed TEMP Data:
             * mobSpawnerID: WAITING/HASFIRED
             * hyperSpawnpointID: array of mobSpawnerIDs
             */
            waitingID: "WAITING",
            hasFiredID: "HASFIRED",
            summonID: "summon",
            summons: [],

            CheckDespawnMobs: function CheckDespawnMobs(){
                if (this.block == null || this.world == null)
                    return false;

                if (this.world.getTempdata().has(this.mobSpawnerID)){
                    if (HyperMobSpawner.debug)
                        this.Broadcast("mobSpawnerID found: " + this.world.getTempdata().get(this.mobSpawnerID));

                    // Despawn mobs - HyperSpawnpoint has called Reset and Spawner still has mobs on the field
                    if (this.world.getTempdata().has(this.hyperSpawnpointID)){
                        var firedMobSpawners = this.world.getTempdata().get(this.hyperSpawnpointID);
                        if (this.HasMobSpawnerFired(firedMobSpawners) == false && this.world.getTempdata().get(this.mobSpawnerID) == this.hasFiredID){
                            this.DespawnMobs();
                            this.world.getTempdata().put(this.mobSpawnerID, this.waitingID);
                        }
                    }
                }
                else{
                    this.DespawnMobs();
                    this.world.getTempdata().put(this.mobSpawnerID, this.waitingID);
                }
            },

            CheckNearbyPlayers: function CheckNearbyPlayers(){
                if (this.block == null || this.world == null)
                    return false;

                this.HandleUserError();

                var np = this.world.getNearbyEntities(this.pos.x, this.pos.y, this.pos.z, this.range, 1);
                for(var i = 0; i < np.length; i++){
                    if (np[i].getGamemode() != 3){
                        // This should almost never happen, but it's possible with server restarts.
                        if (this.world.getTempdata().has(this.hyperSpawnpointID) == false){
                            var empty = [];
                            this.world.getTempdata().put(this.hyperSpawnpointID, empty);
                        }
                        if (this.world.getTempdata().has(this.hyperSpawnpointID)){
                            var firedMobSpawners = this.world.getTempdata().get(this.hyperSpawnpointID);
                            if (this.HasMobSpawnerFired(firedMobSpawners) == false){
                                // HACK: Fixes a bug where sometimes 1 or 2 mobs persist instead of being despawned earier because the chunks were unloaded
                                this.DespawnMobs();

                                this.SpawnMobs();
                                firedMobSpawners.push(this.mobSpawnerID);
                                this.world.getTempdata().put(this.hyperSpawnpointID, firedMobSpawners);
                                return true;
                            }
                        }
                    }
                }
                return false;
            },

            HasMobSpawnerFired: function HasMobSpawnerFired(firedMobSpawners){
                if (firedMobSpawners == null)
                    return false;

                for(var i = 0; i < firedMobSpawners.length; i++){
                    if (firedMobSpawners[i] == this.mobSpawnerID)
                        return true;
                }
                return false;
            },

            SpawnMobs: function SpawnMobs(){
                if (HyperMobSpawner.debug) 
                    this.Broadcast("Spawning " + this.mobLocations.length + " Mobs...");
                for(var i = 0; i < this.mobLocations.length; i++){
                    var summonedNPC = this.world.spawnClone(this.mobLocations[i].x, this.mobLocations[i].y, this.mobLocations[i].z, this.mobSummonTab, this.mobLocations[i].prefab);
                    summonedNPC.addTag(this.mobSpawnerID);
                    summonedNPC.addTag(this.summonID);
                    this.summons.push(summonedNPC);
                }
                this.world.getTempdata().put(this.mobSpawnerID, this.hasFiredID);
            },

            // Mobs are NOT given a hyperSpawnpointID by default. That has to be added manually via addTag() to optionally despawn from any mob spawner
            DespawnMobs: function DespawnMobs(){
                var ne = this.world.getNearbyEntities(this.block.getPos(), this.despawnRange, 2);
                var mobCount = 0;
                for(var i = 0; i < ne.length; i++){
                    if (ne[i].hasTag(this.mobSpawnerID) || ne[i].hasTag(this.hyperSpawnpointID)){
                        ne[i].despawn();
                        mobCount++;
                    }
                }
                this.summons = [];
                if (HyperMobSpawner.debug) 
                    this.Broadcast("Despawning " + mobCount + " Mobs...");
            },

            HandleUserError: function HandleUserError(){
                if (this.hyperSpawnpointID == this.mobSpawnerID)
                    throw ("HMobSpawner: hyperSpawnpointID was the same as mobSpawnerID. They cannot be named the same thing.\n\n");
                if (this.mobSpawnerID == "")
                    throw ("HMobSpawner: mobSpawnerID was empty! Set mobSpawnerID to a unique string! For example: spawner1 \n\n");
                if (this.hyperSpawnpointID == "")
                    throw ("HMobSpawner: hyperSpawnpointID was empty! Please set hyperSpawnpointID to a VALID ID (Copy ID from nearby HSpawnpoint). \n\n");
                if (this.mobSpawnerID == "")
                    throw ("HMobSpawner: mobSpawnerID was empty! Set mobSpawnerID to a unique string! For example: spawner1 \n\n");
            },

            Broadcast: function Broadcast(text){
                if (HyperMobSpawner.debug == true)
                    this.world.broadcast("[MobSpawner]: " + text);
            },
        },
    }
}());