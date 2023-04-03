/* v0.2.1 - AudioJ2CK | Loadable from Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 *
 * A better multi-Track audio player to satisfy your creativity!
 * 
 * TO USE:
    * WAV files must be placed in .minecraft/customnpcs/assets/customnpcs/sounds/audiojack
    * When playing a sound, write the name WITHOUT the extension: "sound" not "sound.wav"
    * 
    * Audio.Play("sound")
    * Audio.Play("sound", audioGain)
    * 
    * !!! YOU MUST CALL Logout(e) ON PLAYER LOGOUT !!!
    */

var Audio = (function(){
    return {  
        Logout: function Logout(e) {                    if (e.player.world.getAllPlayers().length <= 1) Audio.StopAll(); },

        Play: function Play(filename){                  Audio.P.StartClip(filename, false, arguments.length > 1 ? arguments[1] : 0); },
        Loop: function Loop(filename){                  Audio.P.StartClip(filename, true, arguments.length > 1 ? arguments[1] : 0); },
        Stop: function Stop(filename){                  Audio.P.StopClip(filename); },
        StopAll: function StopAll(){                    Audio.P.StopAllClips(); },
        IsPlaying: function IsPlaying(filename) {       return Audio.P.IsPlaying(filename); },
        Ping: function Ping() {                         Audio.P.say("You have my attention!"); },

        P: {
            world: null,
            keyPrefix: "J2CK_",
            keyA: "J2CKA",
            path: "/customnpcs/assets/customnpcs/sounds/audiojack/",
            debugThrowErrors: true,

            AutoExec: function AutoExec(){
                this.world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorld(0);
            },

            GetClip: function GetClip(filename){ return this.world.getTempdata().get(this.keyPrefix + filename); },
            SetClip: function SetClip(filename, clip){  this.world.getTempdata().put(this.keyPrefix + filename, clip); },
            GetAllFileNames: function GetAllFileNames(){ return this.world.getTempdata().has(this.keyA)?this.world.getTempdata().get(this.keyA):[];},
            SetAllFileNames: function SetAllFileNames(fNames){ this.world.getTempdata().put(this.keyA, fNames); },

            StartClip: function StartClip(filename, loop, gain){
                var AudioSystem = Java.type('javax.sound.sampled.AudioSystem');
                
                var clip = this.GetClip(filename);
                if (clip == null){
                    clip = AudioSystem.getClip();
                    this.SetClip(filename, clip);
                }

                if (clip.isOpen()){
                    clip.stop();
                    clip.close();
                }

                var System = Java.type('java.lang.System');
                var File = Java.type('java.io.File');
                var Files = Java.type('java.nio.file.Files');
                var IOException = Java.type('java.io.IOException');
                var ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream');
                
                var WAV_PATH = new File(System.getProperty("user.dir") + this.path + filename + ".wav");
                var inputStream = null;
                
                var validVolume = false;
                var foundFile = false;
                var ex = new IOException();
                try {
                    
                    if (!clip.isOpen()){
                        var bytes = Files.readAllBytes(WAV_PATH.toPath());
                        var byteArrayInputStream = new ByteArrayInputStream(bytes);    
                        inputStream = AudioSystem.getAudioInputStream(byteArrayInputStream);
                        foundFile = true;
                        
                        clip.open(inputStream);
                        clip.setMicrosecondPosition(0);

                        if (gain != 0){
                            var gainControls = clip.getControls();
                            for(var i = 0; i < gainControls.length; i++){
                                if (gainControls[i].getType().toString() == "Master Gain"){
                                    gainControls[i].setValue(gain);
                                }
                            }
                        }
                        validVolume = true;
                        clip.start();   
                        if (loop) { clip.loop(999); }

                        var isClipAlreadyInside = false;
                        var fNames = this.GetAllFileNames();
                        for(var i = 0; i < fNames.length; i++){
                            if (fNames[i] == filename)
                                isClipAlreadyInside = true;
                        }
                        if (!isClipAlreadyInside){
                            fNames.push(filename);
                            this.SetAllFileNames(fNames);
                        }
                    }
                    
                } catch (ex) {
                    if (this.debugThrowErrors){
                        if (!foundFile) {
                            this.say("Unable to locate file §f" + WAV_PATH);
                            throw ("\n\n[J2CK]: Unable to locate file " + WAV_PATH + "\n\n");
                        }
                        if (!validVolume){
                            this.say("Invalid volume given: §b§l" + gain + "\n§7Try something closer to 0. Like -3.0 to 3.0");
                            throw("\n\n[J2CK]: Invalid volume given: " + gain + ". Try something closer to 0. Like -3.0 to 3.0\n\n");
                        }
                        ex.printStackTrace();
                    }
                } finally {
                    if (inputStream != null)
                        inputStream.close();
                }
            },

            StopClip: function StopClip(filename){
                var clip = this.GetClip(filename);
                if (clip != null && clip.isOpen()){
                    clip.stop();
                    clip.close();
                    this.SetClip(filename, null);
                    var fNames = this.GetAllFileNames();
                    for(var i = 0; i < fNames.length; i++){
                        if (fNames[i] == filename){
                            fNames.splice(i, 1);
                            this.SetAllFileNames(fNames);
                            break;
                        }
                    }
                }
            },

            StopAllClips: function StopAllClips(){
                var fNames = this.GetAllFileNames();
                for(var i = 0; i < fNames.length; i++){
                    var clip = this.GetClip(fNames[i]);
                    if (clip != null){
                        clip.stop();
                        clip.close();
                        this.SetClip(fNames[i], null);
                    }
                    fNames.shift();
                    i--;
                }
                this.SetAllFileNames(fNames);
            },

            IsPlaying: function IsPlaying(filename){
                var clip = this.GetClip(filename);
                return clip != null && clip.isOpen() && clip.isRunning();
            },

            say: function say(message){
                this.world.broadcast("§3[§b§lJ2CK§3]: §7" + message);
            }
        }
    }
}()); Audio.P.AutoExec();
