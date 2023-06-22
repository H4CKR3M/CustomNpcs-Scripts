/* v1.5 - Automatic Content Installer | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar 
 * Requires: FUtil
 * Extracts skins/sounds, etc... to .minecraft directory IF and ONLY IF the player is missing the content pack
 * NOTE: .Minecraft becomes SERVER_ROOT if playing on a dedicated server
 */

var ACI = (function(){
    return { 
        Install: function Install()                 { ACI.P.TryInstall(); },
        IsInstalled: function IsInstalled()         { return ACI.P.Verify(); },
        Say: function Say(msg)                      { ACI.P.Say(msg); },

        P: {
            // Nicknames do not have to be accurate
            mapNickname: "§b§lMy Adventure Map",
            mapFolderNickname: "My Adventure Map",
            verificationCode: "MYADVENTUREMAP",

            /* DO NOT CHANGE - Force only 1 map to be installed at a time*/
            verificationFile: "VERIFY.acinstaller",

            TryInstall: function TryInstall() {
                if (typeof FUtil === 'undefined') { throw("\n\nACInstaller: You forgot to load the script FUtil\n\n"); }

                if (!this.Verify()){
                    this.Say("§eWarning: Content Pack not installed!");
                    this.ForceInstall();
                }
            },

            ForceInstall: function ForceInstall(){
                this.Say("§eInstalling Content Pack... ");

                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var sourcePath = API.getWorldDir() + "/CONTENT/customnpcs";
                var destPath = API.getGlobalDir();
                if (!FUtil.CopyDirectory(sourcePath, destPath)){
                    this.Say("§cUnable to find Content Pack.");
                    this.Say("§cLocate the " + this.mapNickname + "§c content pack in .minecraft/saves/" + this.mapFolderNickname + "/customnpcs/CONTENT and copy everything inside into your .minecraft directory.");
                    return false;
                }

                if (this.Verify()){
                    this.Say("§aInstalled Content Pack Successfully!");
                    if (FUtil.IsDedicatedServer()){
                        this.Say("§6You are playing on a dedicated server.");
                        this.Say("§6A restart is §eNOT §6required.");
                    }
                    else
                        this.Say("§6YOU MUST FULLY §f§lRESTART MINECRAFT§6 TO FINISH!");
                }
                else{
                    this.Say("§cFailed to install content pack automatically!");
                    this.Say("§cLocate the " + this.mapNickname + "§c content pack in .minecraft/saves/" + this.mapFolderNickname + "/customnpcs/CONTENT and copy everything inside into your .minecraft directory.");
                    this.Say("§6If you are running this on a server, you can ignore this message.");
                }
            },

            Verify: function Verify(){
                var Exception = Java.type('java.io.IOException');
                var ex = new Exception();
                try {
                    var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                    var verifyPath = API.getGlobalDir() + "/" + this.verificationFile;
                    var verifyFile = new java.io.File(verifyPath);
                    if (verifyFile.exists()){
                        var lines = java.nio.file.Files.readAllLines(java.nio.file.Paths.get(verifyPath), java.nio.charset.StandardCharsets.UTF_8);
                        if (lines.length > 0 && lines[0] == this.verificationCode){
                            return true;
                        }
                    }
                } catch (ex) {
                    ex.printStackTrace(java.lang.System.out);
                    return false;
                }
                return false;
            },

            Say: function Say(msg){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                API.getIWorld(0).broadcast("§4§l[ACI] §6" + msg);
            }
        }
    }
}());