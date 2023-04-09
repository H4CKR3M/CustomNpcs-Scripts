/* v1.6 - Jack's Tunes | Playerscript | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Requires: AudioJ2CK, FUtil, DLoad [OPTIONAL]
 *
 * Plays WAV files from .minecraft/customnpcs/assets/customnpcs/sounds/audiojack
 * To play NO Music in an area, set the trigger song to "none"
 * To play BOSS MUSIC, write:  world.getTempdata().put(bossKey, songName);
 * To stop BOSS MUSIC, write:  world.getTempdata().put(bossKey, null);
 */

var JTunes = (function(){
    return {  
        Login: function Login(e) { JTunes.P.Login(e); },
        Tick: function Tick(e) { JTunes.P.Tick(e); },

        StopMusic: function StopMusic(e){ JTunes.P.StopBackgroundMusic(e); },

        quadrants: [
            {
                // Congrejo Island
                x1:800, z1:1800, x2:1800, z2:2500,
                triggers: [
                    { x1:1163, y1:128, z1:2218, x2:1173, y2:140, z2:2231, song: "none" }, // JDF - no music
                    { x1:1077, y1:130, z1:2143, x2:1200, y2:180, z2:2229, song: "gentle_awakening" }, // Mountain
                    { x1:1004, y1:73, z1:2276, x2:1040, y2:93, z2:2293, song: "three_little_birds" }, // Normal Shed
                    { x1:888, y1:59, z1:2078, x2:1010, y2:93, z2:2171, song: "water_dripping" }, // The Earth Pit (Mine?)
                    { x1:800, y1:0, z1:1800, x2:1800, y2:70, z2:2500, song: "apparitions" }, // Underwater
                    { x1:1381, y1:73, z1:2235, x2:1394, y2:91, z2:2248, song: "voodoo_soup" }, // Tiki
                    { x1:1317, y1:0, z1:2179, x2:1484, y2:120, z2:2287, song: "bayou_bogie" }, // Swamp
                    { x1:874, y1:75, z1:2439, x2:881, y2:80, z2:2453, song: "three_little_birds" }, // Captain Herbs
                    { x1:1070, y1:0, z1:1948, x2:1165, y2:93, z2:2010, song: "wood_tick" }, // Village
                    { x1:1158, y1:89, z1:2260, x2:1201, y2:103, z2:2293, song: "three_little_birds" }, // The Grove
                    { x1:1147, y1:94, z1:2387, x2:1160, y2:103, z2:2398, song: "man_with_a_harmonica" }, // Shady Saloon
                    { x1:1023, y1:94, z1:2064, x2:1041, y2:102, z2:2074, song: "fonky" }, // Lemon Salesman
                    { x1:1134, y1:84, z1:2320, x2:1178, y2:94, z2:2367, song: "hot_head_bop" }, // Magma Dungeon
                    { x1:992, y1:156, z1:2111, x2:1035, y2:184, z2:2154, song: "hot_head_bop" }, // Volcano
                    { x1:927, y1:0, z1:2124, x2:965, y2:123, z2:2154, song: "the_shire" }, // Magia Selva
                    { x1:1005, y1:97, z1:2191, x2:1015, y2:102, z2:2200, song: "water_dripping" }, // Woodsman Lock
                    { x1:967, y1:73, z1:2172, x2:985, y2:98, z2:2197, song: "water_dripping" }, // Woodsman Mine
                ],
            },
            {
                // Herb Island
                x1:-100, z1:2200, x2:350, z2:2600,
                triggers: [
                    { x1:145, y1:70, z1:2364, x2:163, y2:83, z2:2375, song: "three_little_birds" }, // Lake Island
                    { x1:186, y1:72, z1:2336, x2:191, y2:76, z2:2343, song: "three_little_birds" }, // House (Shop)
                    { x1:177, y1:72, z1:2322, x2:184, y2:75, z2:2328, song: "three_little_birds" }, // House
                    { x1:106, y1:0, z1:2243, x2:186, y2:186, z2:2313, song: "is_this_love" }, // Forest
                    { x1:-100, y1:0, z1:2200, x2:350, y2:255, z2:2600, song: "reggae_03" }, // Herb Island
                ],
            },
            {
                // Test Island
                x1:-400, z1:-400, x2:400, z2:400,
                triggers: [
                    { x1:-44, y1:0, z1:49, x2:-98, y2:255, z2:139, song: "its_getting_better_radio" }, // test1
                    { x1:-124, y1:0, z1:53, x2:-148, y2:255, z2:-3, song: "none" }, // test2
                ],
            },
        ],

        P: {
            /* Whether to require DLC to be downloaded and added to .minecraft/customnpcs/dlc folder. If unsure, leave blank "" */
            requiredDLC: "",
            jEnabledKey: "JENABLE",

            songKey: "JTUNE",
            bossKey: "JBOSS",
            bossKeyBackup: "JBOSSB",

            Login: function Login(e){

                if (typeof Audio === 'undefined') { throw("\n\nJTunes: You forgot to load the script AudioJ2CK\n\n"); }
                if (typeof FUtil === 'undefined') { throw("\n\nJTunes: You forgot to load the script FUtil\n\n"); }

                // Fixes a bug where multiple players are on server, and both log off, then one rejoins and the boss song continues
                var numPlayers = e.player.world.getAllPlayers().length;
                if (numPlayers <= 1 && e.player.world.getTempdata().has("JBOSS")){ e.player.world.getTempdata().put("JBOSS", null); }

                this.TryStartup(e);
            },

            /* 'cause DLoad is multithreaded, just keep trying until the soundtrack is installed (if ever) */
            TryStartup: function TryStartup(e){
                var world = e.API.getIWorld(0);

                if (this.requiredDLC != "" && typeof DLoad === 'undefined') { 
                    throw("\n\nJTunes Error: requiredDLC is set to \"" + this.requiredDLC + "\" but DLoad was not loaded"
                     + "\nEither Load DLoad Script or set RequiredDLC to \"\"\n\n"); 
                }
                
                var enabled = this.requiredDLC == "" ? true : DLoad.IsInstalled(e, this.requiredDLC);
                if (enabled)
                    world.getTempdata().put(this.jEnabledKey, true);
                else
                    return;
                
                var song = world.getStoreddata().get(this.songKey);
                if (song != null){
                    world.getTempdata().put(this.songKey, song);
                }
                this.StartBackgroundMusic(e);
            },

            Tick: function Tick(e) {
                var world = e.API.getIWorld(0);
                if (!world.getTempdata().has(this.jEnabledKey)){
                    this.TryStartup(e);
                    return;
                }
                
                var player1 = world.getAllPlayers()[0];
                var bSong = world.getTempdata().get(this.bossKey);
                if (bSong != null){
                    if (!Audio.IsPlaying(bSong)){
                        // If another BOSS song is already playing
                        var bSongCurrent = world.getTempdata().get(this.bossKeyBackup);
                        if (bSongCurrent != null) {
                            Audio.Stop(bSongCurrent);
                        }
                        if (bSong != "none")
                            Audio.Loop(bSong);
                        world.getTempdata().put(this.bossKeyBackup, bSong);
                        this.StopBackgroundMusic(e);
                    }
                    return;
                }
                else {
                    var bSongCurrent = world.getTempdata().get(this.bossKeyBackup);
                    if (bSongCurrent != null) {
                        if (bSongCurrent != "none")
                            Audio.Stop(bSongCurrent);
                        world.getTempdata().put(this.bossKeyBackup, null);
                        this.StartBackgroundMusic(e);
                    }
                }
                
                var qSong = "";
                for(var i = 0; i < JTunes.quadrants.length; i++){
                    var quad = JTunes.quadrants[i];
                    if (player1.x > quad.x1 && player1.x < quad.x2 && player1.z > quad.z1 && player1.z < quad.z2){
                        for(var j = 0; j < quad.triggers.length; j++){
                            var t = quad.triggers[j];
                            if (player1.x >= Math.min(t.x1, t.x2) && player1.x <= Math.max(t.x1, t.x2) && 
                                player1.y >= Math.min(t.y1, t.y2) && player1.y <= Math.max(t.y1, t.y2) &&
                                player1.z >= Math.min(t.z1, t.z2) && player1.z <= Math.max(t.z1, t.z2)){
                                qSong = t.song;
                                break;
                            }
                        }
                        break;   
                    }
                }

                if (qSong != "" && !Audio.IsPlaying(qSong)){
                    this.StopBackgroundMusic(e);
                    if (qSong != "none"){
                        Audio.Loop(qSong);
                    }
                    this.SetSong(e, qSong);
                }
            },

            // Stops the music, but does NOT clear stored music
            StopBackgroundMusic: function StopBackgroundMusic(e){
                var cSong = this.GetSong(e);
                if (cSong != null && Audio.IsPlaying(cSong)){
                    Audio.Stop(cSong);
                }
            },

            // Starts stored music
            StartBackgroundMusic: function StartBackgroundMusic(e){
                var cSong = this.GetSong(e);
                if (cSong != null && cSong != "none"){
                    Audio.Loop(cSong);
                }
            },

            GetSong: function GetSong(e){ return e.player.world.getTempdata().get(this.songKey); },
            SetSong: function SetSong(e, newSong){ 
                e.player.world.getTempdata().put(this.songKey, newSong);
                e.player.world.getStoreddata().put(this.songKey, newSong); 
            },
        }
    }
}());