/* v1.0 - AudioJ2CK | Loadable from Anywhere* - but must also be Loaded in PlayerScript | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 *
 * A better multi-Track audio player to satisfy your creativity!
 * 
 * TO USE:
    * WAV files must be placed in .minecraft/customnpcs/assets/customnpcs/sounds/audiojack
    * When playing a WAV file, the extension is optional: "sound.wav" may be shortened to "sound"
    * 
    * Audio.Play("sound")
    * Audio.Play("sound", audioGain)
    * 
    * !!! REGARDLESS OF WHERE AUDIOJ2CK IS LOADED, YOU MUST ALSO LOAD AUDOJ2CK IN THE PLAYERSCRIPT !!!
    * !!! FAILURE TO LOAD AUTOJ2CK IN THE PLAYERSCRIPT WILL RESULT IN SONGS NOT STOPPING ON LOGOUT !!!
    */

var Audio = (function () { var _Audio = {};

    /* [Auto-Hook] : Logout */

    _Audio.Play = function (filename)           { return P.StartClip(filename, false, arguments.length > 1 ? arguments[1] : 0); };
    _Audio.Loop = function (filename)           { return P.StartClip(filename, true, arguments.length > 1 ? arguments[1] : 0); };
    _Audio.Stop = function (filename)           { return P.StopClip(filename); };
    _Audio.StopAll = function ()                { return P.StopAllClips(); };
    _Audio.IsPlaying = function (filename)      { return P.IsPlaying(filename); };
    _Audio.Ping = function ()                   { return P.Say("You have my attention!"); };

    var P = {
        debugThrowErrors: true,
        world: null,
        keyPrefix: "__J2CK_",
        keyA: "__J2CKA",
        path: "/customnpcs/assets/customnpcs/sounds/audiojack/",
        extension: ".wav",

        GetClip: function GetClip(filename) { 
            var System = Java.type("java.lang.System");
            var key = this.keyPrefix + filename;
            return System.getProperties().get(key);
        },
        SetClip: function SetClip(filename, clip) { 
            var System = Java.type("java.lang.System");
            var key = this.keyPrefix + filename;
            if (clip == null)
                System.getProperties().remove(key);
            else
                System.getProperties().put(key, clip);
        },
        GetAllFileNames: function GetAllFileNames() { 
            var System = Java.type("java.lang.System");
            return System.getProperties().get(this.keyA) != null ? System.getProperties().get(this.keyA) : [];
        },
        SetAllFileNames: function SetAllFileNames(fNames) { 
            var System = Java.type("java.lang.System");
            System.getProperties().put(this.keyA, fNames);
        },

        StartClip: function StartClip(filename, loop, gain) {
            var AudioSystem = Java.type('javax.sound.sampled.AudioSystem');

            var clipID = this.GetClipID(filename);
            var clip = this.GetClip(clipID);
            if (clip == null) {
                clip = AudioSystem.getClip();
                this.SetClip(clipID, clip);
            }

            if (clip.isOpen()) {
                clip.stop();
                clip.close();
            }

            var System = Java.type('java.lang.System');
            var File = Java.type('java.io.File');
            var Files = Java.type('java.nio.file.Files');
            var IOException = Java.type('java.io.IOException');
            var ByteArrayInputStream = Java.type('java.io.ByteArrayInputStream');

            var filenameWithExt = this.IsExtension(filename, this.extension) ? filename : filename + this.extension;
            var WAV_PATH = new File(System.getProperty("user.dir") + this.path + filenameWithExt);
            var inputStream = null;

            var validVolume = false;
            var foundFile = false;
            var ex = new IOException();
            try {

                if (!clip.isOpen()) {
                    var bytes = Files.readAllBytes(WAV_PATH.toPath());
                    var byteArrayInputStream = new ByteArrayInputStream(bytes);
                    inputStream = AudioSystem.getAudioInputStream(byteArrayInputStream);
                    foundFile = true;

                    clip.open(inputStream);
                    clip.setMicrosecondPosition(0);

                    if (gain != 0) {
                        var gainControls = clip.getControls();
                        for (var i = 0; i < gainControls.length; i++) {
                            if (gainControls[i].getType().toString() == "Master Gain") {
                                gainControls[i].setValue(gain);
                            }
                        }
                    }
                    validVolume = true;
                    clip.start();
                    if (loop) { clip.loop(999); }

                    var isClipAlreadyInside = false;
                    var fNames = this.GetAllFileNames();
                    for (var i = 0; i < fNames.length; i++) {
                        if (fNames[i] == clipID)
                            isClipAlreadyInside = true;
                    }
                    if (!isClipAlreadyInside) {
                        fNames.push(clipID);
                        this.SetAllFileNames(fNames);
                    }
                }

            } catch (ex) {
                if (this.debugThrowErrors) {
                    if (!foundFile) {
                        this.Say("Unable to locate file §f" + WAV_PATH);
                        throw ("\n\n[J2CK]: Unable to locate file " + WAV_PATH + "\n\n");
                    }
                    if (!validVolume) {
                        this.Say("Invalid volume given: §b§l" + gain + "\n§7Try something closer to 0. Like -3.0 to 3.0");
                        throw ("\n\n[J2CK]: Invalid volume given: " + gain + ". Try something closer to 0. Like -3.0 to 3.0\n\n");
                    }
                    ex.printStackTrace();
                }
            } finally {
                if (inputStream != null)
                    inputStream.close();
            }
        },

        StopClip: function StopClip(filename) {
            var clipID = this.GetClipID(filename);
            var clip = this.GetClip(clipID);
            if (clip != null && clip.isOpen()) {
                clip.stop();
                clip.close();
                this.SetClip(clipID, null);
                var fNames = this.GetAllFileNames();
                for (var i = 0; i < fNames.length; i++) {
                    if (fNames[i] == clipID) {
                        fNames.splice(i, 1);
                        this.SetAllFileNames(fNames);
                        break;
                    }
                }
            }
        },

        StopAllClips: function StopAllClips() {
            var fNames = this.GetAllFileNames();
            for (var i = 0; i < fNames.length; i++) {
                var clip = this.GetClip(fNames[i]);
                if (clip != null) {
                    clip.stop();
                    clip.close();
                    this.SetClip(fNames[i], null);
                }
                fNames.shift();
                i--;
            }
            this.SetAllFileNames(fNames);
        },

        IsPlaying: function IsPlaying(filename) {
            var clipID = this.GetClipID(filename);
            var clip = this.GetClip(clipID);
            return clip != null && clip.isOpen() && clip.isRunning();
        },

        IsExtension: function IsExtension(filename, extension) {
            return filename.substring(filename.lastIndexOf("."), filename.length) == extension;
        },

        RemoveExtension: function RemoveExtension(filename, extension) {
            if (typeof filename !== "string" || typeof extension !== "string")
                return filename;

            if (filename.toLowerCase().indexOf(extension.toLowerCase(), filename.length - extension.length) !== -1)
                return filename.slice(0, filename.length - extension.length);

            return filename;
        },

        GetClipID: function GetClipID(filename) {
            return this.RemoveExtension(filename, this.extension).toLowerCase();
        },

        Say: function Say(message) {
            var world = Java.type("noppes.npcs.api.NpcAPI").Instance().getIWorlds()[0];
            world.broadcast("§3[§b§lJ2CK§3]: §7" + message);
        }
    };

    /* [AUTO-HOOK] ---- TREAT AS PRIVATE */
    _Audio.AutoHookID = "AudioJ2CK";
    _Audio.INTERNAL_Logout = function (e) { if (e.player.world.getAllPlayers().length <= 1) P.StopAllClips(); };
    return _Audio;
}());

Audio.COPY_logout = (typeof logout === 'function' && !logout.hasOwnProperty(Audio.AutoHookID) && (Date.now() - (logout.CreatedAt || Date.now())) < 200) ? logout : function () { };
var logout = function (e) {
    Audio.COPY_logout(e);
    Audio.INTERNAL_Logout(e);
}; logout[Audio.AutoHookID] = true; logout.CreatedAt = Date.now();