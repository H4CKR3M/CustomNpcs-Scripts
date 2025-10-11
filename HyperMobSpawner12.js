/* v3.0 - HyperMobSpawner12 | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Load This Script on all HMobSpawner Objects */

var HyperMobSpawn = (function () { var _HyperMobSpawn = {};

    /* [Auto-Hook] : tick */

    /* REQUIRED : Config - All params must be set inside init(e) from the HMobSpawner block/npc/or other */
    _HyperMobSpawn.pos = { x: 0, y: 0, z: 0 };
    _HyperMobSpawn.ID = "";
    _HyperMobSpawn.clones = [];

    /* OPTIONAL : Config */
    _HyperMobSpawn.hyperSpawnpointID = "ID";
    _HyperMobSpawn.range = 5;
    _HyperMobSpawn.world = null;
    _HyperMobSpawn.tab = 2;

    var P = {
        debug: false,
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
        AutoExec: function AutoExec() {
            if (_HyperMobSpawn.world == null)
                _HyperMobSpawn.world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorlds()[0];
        },

        Tick: function Tick(e) {
            this.CheckDespawnMobs();
            this.CheckNearbyPlayers(e);
        },

        CheckDespawnMobs: function CheckDespawnMobs() {
            if (_HyperMobSpawn.world == null)
                return false;

            if (_HyperMobSpawn.world.getTempdata().has(_HyperMobSpawn.ID)) {
                if (this.debug)
                    this.Broadcast("ID found: " + _HyperMobSpawn.world.getTempdata().get(_HyperMobSpawn.ID));

                // Despawn mobs - HyperSpawnpoint has called Reset and Spawner still has mobs on the field
                if (_HyperMobSpawn.world.getTempdata().has(_HyperMobSpawn.hyperSpawnpointID)) {
                    var firedMobSpawners = _HyperMobSpawn.world.getTempdata().get(_HyperMobSpawn.hyperSpawnpointID);
                    if (this.HasMobSpawnerFired(firedMobSpawners) == false && _HyperMobSpawn.world.getTempdata().get(_HyperMobSpawn.ID) == this.hasFiredID) {
                        this.DespawnMobs();
                        _HyperMobSpawn.world.getTempdata().put(_HyperMobSpawn.ID, this.waitingID);
                    }
                }
            }
            else {
                this.DespawnMobs();
                _HyperMobSpawn.world.getTempdata().put(_HyperMobSpawn.ID, this.waitingID);
            }
        },

        CheckNearbyPlayers: function CheckNearbyPlayers(e) {
            if (_HyperMobSpawn.world == null)
                return false;

            this.HandleUserError(e);

            var np = _HyperMobSpawn.world.getNearbyEntities(_HyperMobSpawn.pos.x, _HyperMobSpawn.pos.y, _HyperMobSpawn.pos.z, _HyperMobSpawn.range, 1);
            for (var i = 0; i < np.length; i++) {
                if (np[i].getGamemode() != 3) {
                    // This should almost never happen, but it's possible with server restarts.
                    if (_HyperMobSpawn.world.getTempdata().has(_HyperMobSpawn.hyperSpawnpointID) == false) {
                        var empty = [];
                        _HyperMobSpawn.world.getTempdata().put(_HyperMobSpawn.hyperSpawnpointID, empty);
                    }
                    if (_HyperMobSpawn.world.getTempdata().has(_HyperMobSpawn.hyperSpawnpointID)) {
                        var firedMobSpawners = _HyperMobSpawn.world.getTempdata().get(_HyperMobSpawn.hyperSpawnpointID);
                        if (this.HasMobSpawnerFired(firedMobSpawners) == false) {
                            // HACK: Fixes a bug where sometimes 1 or 2 mobs persist instead of being despawned earier because the chunks were unloaded
                            this.DespawnMobs();

                            this.SpawnMobs();
                            firedMobSpawners.push(_HyperMobSpawn.ID);
                            _HyperMobSpawn.world.getTempdata().put(_HyperMobSpawn.hyperSpawnpointID, firedMobSpawners);
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        HasMobSpawnerFired: function HasMobSpawnerFired(firedMobSpawners) {
            if (firedMobSpawners == null)
                return false;

            for (var i = 0; i < firedMobSpawners.length; i++) {
                if (firedMobSpawners[i] == _HyperMobSpawn.ID)
                    return true;
            }
            return false;
        },

        SpawnMobs: function SpawnMobs() {
            if (this.debug)
                this.Broadcast("Spawning " + _HyperMobSpawn.clones.length + " Mobs...");
            for (var i = 0; i < _HyperMobSpawn.clones.length; i++) {
                var summonedNPC = _HyperMobSpawn.world.spawnClone(_HyperMobSpawn.clones[i].x, _HyperMobSpawn.clones[i].y, _HyperMobSpawn.clones[i].z,
                    _HyperMobSpawn.tab, _HyperMobSpawn.clones[i].prefab);
                summonedNPC.addTag(_HyperMobSpawn.ID);
                summonedNPC.addTag(this.summonID);
                this.summons.push(summonedNPC);
            }
            _HyperMobSpawn.world.getTempdata().put(_HyperMobSpawn.ID, this.hasFiredID);
        },

        // Mobs are NOT given a hyperSpawnpointID by default. That has to be added manually via addTag() to optionally despawn from any mob spawner
        DespawnMobs: function DespawnMobs() {
            var ne = _HyperMobSpawn.world.getNearbyEntities(_HyperMobSpawn.pos.x, _HyperMobSpawn.pos.y, _HyperMobSpawn.pos.z, this.despawnRange, 2);
            var mobCount = 0;
            for (var i = 0; i < ne.length; i++) {
                if (ne[i].hasTag(_HyperMobSpawn.ID) || ne[i].hasTag(_HyperMobSpawn.hyperSpawnpointID)) {
                    ne[i].despawn();
                    mobCount++;
                }
            }
            this.summons = [];
            if (this.debug)
                this.Broadcast("Despawning " + mobCount + " Mobs...");
        },

        HandleUserError: function HandleUserError(e) {
            if (e.player != null)
                throw ("\n\nHMobSpawner: This script cannot be loaded on the player. It should be loaded on a block.\n\n");
            if (_HyperMobSpawn.pos.x == 0 && _HyperMobSpawn.pos.y == 0 && _HyperMobSpawn.pos.z == 0)
                throw ("\n\nHMobSpawner: pos x/y/z were all set to 0.\nDid you forget to write in the position of the mob spawner?\nFor example, you can write: "
                    + "_HyperMobSpawn.pos = { x:e.block.x, y:e.block.y+2, z:e.block.z};\n\n");
            if (_HyperMobSpawn.ID == "")
                throw ("\n\nHMobSpawner: The ID was empty! Set ID to a unique string! For example: spawner1 \n\n");
            if (_HyperMobSpawn.ID == "UniqueID")
                throw ("\n\nHMobSpawner: The ID was named UniqueID \nYou're supposed to write your own ID, something like forest1, forest2 or myCanyonSpawner \n\n");
            if (_HyperMobSpawn.hyperSpawnpointID == _HyperMobSpawn.ID)
                throw ("\n\nHMobSpawner: hyperSpawnpointID was the same as the ID. They cannot be named the same thing.\n\n");
            if (_HyperMobSpawn.hyperSpawnpointID == "")
                throw ("\n\nHMobSpawner: hyperSpawnpointID was empty! Please set hyperSpawnpointID to a VALID ID (Copy ID from nearby HSpawnpoint). \n\n");
            if (_HyperMobSpawn.clones.length == 0)
                throw ("\n\nHMobSpawner: _HyperMobSpawn.clones list was empty! Did you forget to include a list of mobs to spawn?\nFor Example:\n"
                    + "_HyperMobSpawn.clones = [ { x:-491.5, y:63, z:-248.5, prefab: \"MyNpc 1\" }, { x:-494.5, y:63, z:-246.5, prefab: \"MyNpc 2\" } ]" + " \n\n");
        },

        Broadcast: function Broadcast(text) {
            if (this.debug)
                _HyperMobSpawn.world.broadcast("[MobSpawner]: " + text);
        },
    }; P.AutoExec();
    _HyperMobSpawn.Init = function (e) { /* DO NOTHING -- legacy support */ };
    _HyperMobSpawn.Tick = function (e) { /* DO NOTHING -- legacy support */ };

    /* [AUTO-HOOK] ---- TREAT AS PRIVATE */
    _HyperMobSpawn.AutoHookID = "HyperMobSpawn";
    _HyperMobSpawn.INTERNAL_Tick = function (e) { P.Tick(e); };
    return _HyperMobSpawn;
}());

HyperMobSpawn.COPY_tick = (typeof tick === 'function' && !tick.hasOwnProperty(HyperMobSpawn.AutoHookID) && (Date.now() - (tick.CreatedAt || Date.now())) < 200) ? tick : function () { };
var tick = function (e) {
    HyperMobSpawn.COPY_tick(e);
    HyperMobSpawn.INTERNAL_Tick(e);
}; tick[HyperMobSpawn.AutoHookID] = true; tick.CreatedAt = Date.now();


// -------------------------------------------------------------------------------------------------------------------------------------------
// Example of what a HyperMobSpawner block should look like.



// /* v3.0 - HMobSpawner | ScriptedBlock
//  * Requires: HyperMobSpawner12
//  */

// function init(e) {
//     e.block.setModel("minecraft:stonebrick");
//     e.block.setRotation(0, 270, 0);

//     HyperMobSpawn.pos = { x: e.block.x, y: e.block.y + 2, z: e.block.z };
//     HyperMobSpawn.ID = "UniqueID";
//     HyperMobSpawn.range = 10;

//     HyperMobSpawn.clones = [
//         { x: 130.5, y: 75, z: 100.5, prefab: "clone1" },
//         { x: 140.5, y: 75, z: 100.5, prefab: "clone2" },
//         { x: 145.5, y: 77, z: 110.5, prefab: "cloneMiniboss" },
//         { x: 150.5, y: 75, z: 110.5, prefab: "cloneMiniboss2" },
//     ];
// }