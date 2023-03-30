/* v0.1 - AudioJ7CK | Load Script inside INIT, Call Play/Stop/etc... from Anywhere | 1.7.10, CustomNPCs_1.7.10d(29oct17) | Written by Rimscar 
 *
 * A better multi-Track audio player to satisfy your creativity!
 * 
 * TO USE:
    * WAV files must be placed in .minecraft/customnpcs/assets/customnpcs/sounds
    * When playing a sound, write the name WITHOUT the extension: "sound" not "sound.wav"
    * either use npc.getTempData("audio").Play("sample") from anywhere -OR-
    * From Init (must be INSIDE of an object in Init), use: Audio.Play("sample.wav") */

var Audio = (function(){
    return {  

        Play: function Play(filename){ Audio.Private.StartClip(filename, false); },
        Loop: function Loop(filename){ Audio.Private.StartClip(filename, true); },
        Stop: function Stop(filename){ Audio.Private.StopClip(filename); },
        StopAll: function StopAll(){ Audio.Private.StopAllClips(); },
        IsPlaying: function IsPlaying(filename) { return Audio.Private.IsPlaying(filename); },
        PlayMCSound: function PlayMCSound(soundName, target){ Audio.Private.PlayMCSound(soundName, target); },
        Ping: function Ping() { npc.say("Pinged the audio Jack!") },

        Private: {

            clips: [],

            StartClip: function StartClip(filename, loop){
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
                
                var WAV_PATH = new File(System.getProperty("user.dir") + "/customnpcs/assets/customnpcs/sounds/" + filename + ".wav");
                var inputStream = null;
                
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
                        clip.start();   
                        if (loop) { clip.loop(999); }

                        var isClipAlreadyInside = false;
                        for(var i = 0; i < this.clips.length; i++){
                            if (this.clips[i] == clip)
                                isClipAlreadyInside = true;
                        }
                        if (!isClipAlreadyInside)
                            this.clips.push(clip);
                    }
                    
                } catch (ex) {
                    if (!foundFile) throw ("[J7CK]: Unable to locate file " + WAV_PATH);
                    ex.printStackTrace();
                } finally {
                    if (inputStream != null)
                        inputStream.close();
                }
            },

            GetClip: function GetClip(filename){ return npc.getTempData("J7CK_" + filename); },
            SetClip: function SetClip(filename, clip){ npc.setTempData("J7CK_" + filename, clip); },

            StopClip: function StopClip(filename){
                var clip = this.GetClip(filename);
                if (clip != null && clip.isOpen()){
                    clip.stop();
                    clip.close();
                    this.SetClip(filename, null);
                    for(var i = 0; i < this.clips.length; i++){
                        if (this.clips[i] == clip){
                            this.clips.splice(i, 1);
                            break;
                        }
                    }
                }
            },

            StopAllClips: function StopAllClips(){
                for(var i = 0; i < this.clips.length; i++){
                    var clip = this.clips[i];
                    if (clip != null){
                        clip.stop();
                        clip.close();
                    }
                    this.clips.shift();
                    i--;
                }
            },

            IsPlaying: function IsPlaying(filename){
                var clip = this.GetClip(filename);
                return clip != null && clip.isOpen() && clip.isRunning();
            },

            PlayMCSound: function PlayMCSound(soundName, target){
                if (target.getType() == 1)
                    npc.executeCommand("playsound " + soundName + " " + target.getName());
                else if (target.getType() == 2){
                    var np = target.getSurroundingEntities(60, 1);
                    for(var i = 0; i < np.length; i++){
                        npc.executeCommand("playsound " + soundName + " " + np[i].getName());
                    }
                }
            }
        }
    }
}());
npc.setTempData("audio", Audio);