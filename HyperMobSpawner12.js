/* v2.0 - HyperMobSpawner12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Load This Script on all HMobSpawner Objects */

var HyperMobSpawn = (function(){
    return {  
        pos: { x:0, y:0, z:0 },
        ID: "",
        hyperSpawnpointID: "ID",
        range: 5,
        world: null,
        clones: [],

        Init: function Init(e){ HyperMobSpawn.P.Init(e); },
        Tick: function Tick(e){ HyperMobSpawn.P.Tick(e); },

        P: {
            debug: false,
            mobSummonTab: 1,
            despawnRange: 128,

            /* DO NOT TOUCH
               Managed TEMP Data:
               ID: WAITING/HASFIRED
               hyperSpawnpointID: array of IDs
             */
            waitingID: "WAITING",
            hasFiredID: "HASFIRED",
            summonID: "summon",
            summons: [],
            
            // The user is supposed to set the world in each spawner, but in case the don't...
            AutoExec: function AutoExec(){
                if (HyperMobSpawn.world == null)
                    HyperMobSpawn.world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorlds()[0];
            },

            Tick: function Tick(e){
                this.CheckDespawnMobs();
                this.CheckNearbyPlayers();
            },

            CheckDespawnMobs: function CheckDespawnMobs(){
                if (HyperMobSpawn.world == null)
                    return false;

                if (HyperMobSpawn.world.getTempdata().has(HyperMobSpawn.ID)){
                    if (this.debug)
                        this.Broadcast("ID found: " + HyperMobSpawn.world.getTempdata().get(HyperMobSpawn.ID));

                    // Despawn mobs - HyperSpawnpoint has called Reset and Spawner still has mobs on the field
                    if (HyperMobSpawn.world.getTempdata().has(HyperMobSpawn.hyperSpawnpointID)){
                        var firedMobSpawners = HyperMobSpawn.world.getTempdata().get(HyperMobSpawn.hyperSpawnpointID);
                        if (this.HasMobSpawnerFired(firedMobSpawners) == false && HyperMobSpawn.world.getTempdata().get(HyperMobSpawn.ID) == this.hasFiredID){
                            this.DespawnMobs();
                            HyperMobSpawn.world.getTempdata().put(HyperMobSpawn.ID, this.waitingID);
                        }
                    }
                }
                else{
                    this.DespawnMobs();
                    HyperMobSpawn.world.getTempdata().put(HyperMobSpawn.ID, this.waitingID);
                }
            },

            CheckNearbyPlayers: function CheckNearbyPlayers(){
                if (HyperMobSpawn.world == null)
                    return false;

                this.HandleUserError();

                var np = HyperMobSpawn.world.getNearbyEntities(HyperMobSpawn.pos.x, HyperMobSpawn.pos.y, HyperMobSpawn.pos.z, HyperMobSpawn.range, 1);
                for(var i = 0; i < np.length; i++){
                    if (np[i].getGamemode() != 3){
                        // This should almost never happen, but it's possible with server restarts.
                        if (HyperMobSpawn.world.getTempdata().has(HyperMobSpawn.hyperSpawnpointID) == false){
                            var empty = [];
                            HyperMobSpawn.world.getTempdata().put(HyperMobSpawn.hyperSpawnpointID, empty);
                        }
                        if (HyperMobSpawn.world.getTempdata().has(HyperMobSpawn.hyperSpawnpointID)){
                            var firedMobSpawners = HyperMobSpawn.world.getTempdata().get(HyperMobSpawn.hyperSpawnpointID);
                            if (this.HasMobSpawnerFired(firedMobSpawners) == false){
                                // HACK: Fixes a bug where sometimes 1 or 2 mobs persist instead of being despawned earier because the chunks were unloaded
                                this.DespawnMobs();

                                this.SpawnMobs();
                                firedMobSpawners.push(HyperMobSpawn.ID);
                                HyperMobSpawn.world.getTempdata().put(HyperMobSpawn.hyperSpawnpointID, firedMobSpawners);
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
                    if (firedMobSpawners[i] == HyperMobSpawn.ID)
                        return true;
                }
                return false;
            },

            SpawnMobs: function SpawnMobs(){
                if (this.debug) 
                    this.Broadcast("Spawning " + HyperMobSpawn.clones.length + " Mobs...");
                for(var i = 0; i < HyperMobSpawn.clones.length; i++){
                    var summonedNPC = HyperMobSpawn.world.spawnClone(HyperMobSpawn.clones[i].x, HyperMobSpawn.clones[i].y, HyperMobSpawn.clones[i].z, 
                        this.mobSummonTab, HyperMobSpawn.clones[i].prefab);
                    summonedNPC.addTag(HyperMobSpawn.ID);
                    summonedNPC.addTag(this.summonID);
                    this.summons.push(summonedNPC);
                }
                HyperMobSpawn.world.getTempdata().put(HyperMobSpawn.ID, this.hasFiredID);
            },

            // Mobs are NOT given a hyperSpawnpointID by default. That has to be added manually via addTag() to optionally despawn from any mob spawner
            DespawnMobs: function DespawnMobs(){
                var ne = HyperMobSpawn.world.getNearbyEntities(HyperMobSpawn.pos.x, HyperMobSpawn.pos.y, HyperMobSpawn.pos.z, this.despawnRange, 2);
                var mobCount = 0;
                for(var i = 0; i < ne.length; i++){
                    if (ne[i].hasTag(HyperMobSpawn.ID) || ne[i].hasTag(HyperMobSpawn.hyperSpawnpointID)){
                        ne[i].despawn();
                        mobCount++;
                    }
                }
                this.summons = [];
                if (this.debug) 
                    this.Broadcast("Despawning " + mobCount + " Mobs...");
            },

            HandleUserError: function HandleUserError(){
                if (HyperMobSpawn.pos.x == 0 && HyperMobSpawn.pos.y == 0 && HyperMobSpawn.pos.z == z)
                    throw ("\n\nHMobSpawner: pos x/y/z were all set to 0.\nDid you forget to write in the position of the mob spawner?\nFor example, you can write: "
                        + "HyperMobSpawn.pos = { x:e.block.x, y:e.block.y+2, z:e.block.z};\n\n");
                if (HyperMobSpawn.ID == "")
                    throw ("\n\nHMobSpawner: The ID was empty! Set ID to a unique string! For example: spawner1 \n\n");
                if (HyperMobSpawn.ID == "UniqueID")
                    throw ("\n\nHMobSpawner: The ID was named UniqueID \nYou're supposed to write your own ID, something like forest1, forest2 or myCanyonSpawner \n\n");
                if (HyperMobSpawn.hyperSpawnpointID == HyperMobSpawn.ID)
                    throw ("\n\nHMobSpawner: hyperSpawnpointID was the same as the ID. They cannot be named the same thing.\n\n");
                if (HyperMobSpawn.hyperSpawnpointID == "")
                    throw ("\n\nHMobSpawner: hyperSpawnpointID was empty! Please set hyperSpawnpointID to a VALID ID (Copy ID from nearby HSpawnpoint). \n\n");
                if (HyperMobSpawn.clones.length == 0)
                    throw ("\n\nHMobSpawner: HyperMobSpawn.clones list was empty! Did you forget to include a list of mobs to spawn?\nFor Example:\n"
                        + "HyperMobSpawn.clones = [ { x:-491.5, y:63, z:-248.5, prefab: \"MyNpc 1\" }, { x:-494.5, y:63, z:-246.5, prefab: \"MyNpc 2\" } ]" + " \n\n");
            },

            Broadcast: function Broadcast(text){
                if (this.debug)
                    HyperMobSpawn.world.broadcast("[MobSpawner]: " + text);
            },
        }
    }
}()); HyperMobSpawn.P.AutoExec();