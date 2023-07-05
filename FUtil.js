/* v1.3 - FileUtilities | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar */

var FUtil = (function(){
    return { 

        CopyDirectory: function CopyDirectory(sourcePath, destPath)                                 { return FUtil.P.CopyDir_Helper(sourcePath, destPath); },
        CopyFile: function CopyFile(sourcePath, destPath)                                           { return FUtil.P.CopyFile(new java.io.File(sourcePath), destPath); },
        DeleteDirectory: function DeleteDirectory(folder)                                           { FUtil.P.DeleteDirectory(folder); },
        Exists: function Exists(path)                                                               { return new java.io.File(path).exists(); },
        ExistsInDirectory: function ExistsInDirectory(directoryPath, filename)                      { return FUtil.P.ExistsInDirectory(directoryPath, filename); },
        IsExtension: function IsExtension(filename, extension)                                      { return FUtil.P.IsExtension(filename, extension); },
        ReadFile: function ReadFile(filepath)                                                       { return FUtil.P.BufferedRead(new java.io.File(filepath)); },

        /* Assets (Videos, PNGs, etc...) must be placed in /world/customnpcs
         * PlayVideo_WindowsOnly requires AlwaysOnTop.dat to be placed in /world/customnpcs/scripts 
         */
        OpenImageFullscreen: function OpenImageFullscreen(filename, labelText, scaleW, ScaleH)      { return FUtil.P.OpenImageFullscreen(filename, labelText, scaleW, ScaleH); },
        OpenImageNewWindow: function OpenImageNewWindow(filename, labelText, width, height)         { return FUtil.P.OpenImageNewWindow(filename, labelText, width, height); },
        PlayVideoSingleplayer_WindowsOnly: function PlayVideoSingleplayer_WindowsOnly(filename)     { return FUtil.P.PlayVideoSingleplayer_WindowsOnly(filename); },
        RunExecutable: function RunExecutable(filename)                                             { return FUtil.P.RunExecutable(filename); },
        CopyToDesktop: function CopyToDesktop(filename)                                             { return FUtil.P.CopyToDesktop(filename); },

        Encrypt: function Encrypt(string)                                                           { return FUtil.P.Encrypt(string); },
        Decrypt: function Decrypt(stringBase64)                                                     { return FUtil.P.Decrypt(stringBase64); },
        UnzipDirectory: function UnzipDirectory(zipPath, destFolderPath)                            { return FUtil.P.UnzipDirectory(zipPath, destFolderPath); },
        Unzip: function Unzip(zipPath)                                                              { return FUtil.P.Unzip(zipPath); },
        IsDedicatedServer: function IsDedicatedServer()                                             { return FUtil.P.IsDedicatedServer(); },

        P: {

            CopyDir_Helper: function CopyDir_Helper(sourcePath, destPath){
                return this.CopyDirectory(new java.io.File(sourcePath), new java.io.File(destPath));
            },

            /* Copies a directory recursively using java nio */
            CopyDirectory: function CopyDirectory(source, target){
                if (!source.exists()) {
                    return false;
                }
                if (source.isDirectory()) {
                    if (!target.exists()) {
                        target.mkdir();
                    }
        
                    var listFile = source.listFiles();
                    for(var i = 0; i < listFile.length; i++){
                        var f = listFile[i];
        
                        var sourceFile = new java.io.File(source, f.getName());
                        var outputFile = new java.io.File(target, f.getName());
                        if (f.isDirectory()) {
                            new FUtil.P.CopyDirectory(sourceFile,
                                    outputFile);
                        } else {
                            new FUtil.P.CopyFile(sourceFile, outputFile);
                        }
                    }
                    return true;
                }
                return false;
            },
        
            CopyFile: function CopyFile(inputFile, outputFile){
                var inputStream = new java.io.FileInputStream(inputFile);
                var outputStream = new java.io.FileOutputStream(outputFile);
        
                var success = false;
                var Exception = Java.type('java.io.IOException');
                var ex = new Exception();
                try {
                    java.nio.file.Files.copy(inputFile.toPath(), outputStream);
                    success = true;
                } catch (ex) {
                    ex.printStackTrace(java.lang.System.out);
                } finally {
                    outputStream.close();
                    inputStream.close();
                }
                return success;
            },

            /* May take some time... really just "schedules" for deletion and the files are cleaned up later */
            DeleteDirectory: function DeleteDirectory(folder) {
                var files = folder.listFiles();
                if(files != null) {
                    for(var i = 0; i < files.length; i++){
                        var f = files[i];
                        if(f.isDirectory()) {
                            this.DeleteDirectory(f);
                        } else {
                            f.delete();
                        }
                    }
                }
                folder.delete();
            },

            ExistsInDirectory: function ExistsInDirectory(directoryPath, filename){
                var directory = new java.io.File(directoryPath);
                if (directory.isDirectory()){
                    var listFile = directory.listFiles();
                    for(var i = 0; i < listFile.length; i++){
                        var f = listFile[i];
                        if (f.getName().toUpperCase() == filename.toUpperCase()){
                            return true;
                        }
                    }
                }
                return false;
            },

            IsExtension: function IsExtension(filename, extension){
                return filename.substring(filename.lastIndexOf("."), filename.length) == extension;
            },

            BufferedRead: function BufferedRead(file){
                var resultStr = [];
                var reader = null;
                try {
                    reader = new java.io.BufferedReader(new java.io.FileReader(file));
                    var line;
                    while ((line = reader.readLine()) != null) {
                        resultStr.push(line);
                    }
                } catch (e) {
                    e.printStackTrace();
                } finally {
                    try {
                        if (reader != null)
                            reader.close();
                    } catch (e) {
                        e.printStackTrace();
                    }
                }
                return resultStr;
            },

            Encrypt: function Encrypt(string){
                var encoder = Java.type('java.util.Base64').getEncoder();
                if (encoder != null){
                    var encodedBytes = encoder.encode(string.getBytes());
                    return new java.lang.String(encodedBytes);
                }
            },

            Decrypt: function Decrypt(stringBase64){
                var decoder = Java.type('java.util.Base64').getDecoder();
                if (decoder != null){
                    var decodedBytes = decoder.decode(stringBase64.getBytes());
                    return new java.lang.String(decodedBytes);
                }
            },

            /* Unzips given zip into the current directory */
            Unzip: function Unzip(zipFilePath){
                this.UnzipDirectory(zipFilePath, new java.io.File(zipFilePath).getParent());
            },

            /* Unzips given zip into the target directory */
            UnzipDirectory: function UnzipDirectory(zipFilePath, destFolderPath){
                try {
                    var zipFile = new java.io.File(zipFilePath);
                    var inputStream = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFile))
                    var fileList = [];
                    var entry = inputStream.getNextEntry();
                    while (entry != null) {
                        var newFile = new java.io.File(destFolderPath + java.io.File.separator + entry.getName());
                        new java.io.File(newFile.getParent()).mkdirs();
                        if (!entry.isDirectory()) {
                            var outputStream = new java.io.FileOutputStream(newFile);
                            var length;
                            var buffer = new Uint8Array(1024).toString().getBytes();
                            while ((length = inputStream.read(buffer)) > 0) {
                                outputStream.write(buffer, 0, length);
                            }
                        }
                        fileList.push(newFile.getAbsolutePath());
                        entry = inputStream.getNextEntry();
                    }
                    inputStream.closeEntry();
                    return fileList;
                } catch (ex) {
                    ex.printStackTrace(java.lang.System.out);
                }
            },

            IsDedicatedServer: function IsDedicatedServer(){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var world = API.getIWorld(0);
                if (world.getTempdata().has("DEDICATED_SERVER")){
                    return true;
                }

                var map = new java.io.File(API.getWorldDir().getParent());
                var parentDir = new java.io.File(map.getParent());
                var listFile = parentDir.listFiles();
                for(var i = 0; i < listFile.length; i++){
                    var f = listFile[i];
                    if (f.getName() == "forge_server.jar" || f.getName() == "forge.jar" || f.getName() == "minecraft_server.1.12.2.jar"){
                        world.getTempdata().put("DEDICATED_SERVER", 1);
                        return true;
                    }
                }
                return false;
            },

            /* Opens a file using the CMD --- File must be located in /world/customnpcs directory */
            PlayVideoSingleplayer_WindowsOnly: function PlayVideoSingleplayer_WindowsOnly(filename){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();

                // the reason this is even here is because this function <DOES NOT WORK> on multiplayer...
                if (this.IsDedicatedServer()){
                    return false;
                }

                // If the library is missing, just assume they're playing on Linux or something and don't throw an exception
                var aotfPath = API.getWorldDir() + "/scripts/AlwaysOnTop.bat";
                var aotf = new java.io.File(aotfPath);
                if (!aotf.exists()) {

                    // AlwaysOnTop.dat exists, but AlwaysOnTop.bat does not? If so, copy/rename the file
                    var aotDat = new java.io.File(API.getWorldDir() + "/scripts/AlwaysOnTop.dat");
                    if (aotDat.exists()){
                        this.CopyFile(aotDat, new java.io.File(aotfPath));
                    }
                    else{
                        API.getIWorld(0).broadcast("§cUnable to play video §6" + filename + "§c through §3PlayVideo_WindowsOnly");
                        API.getIWorld(0).broadcast("§6This is optional, but you can play the video yourself at:\n§7" + API.getWorldDir() + "\\" + filename);
                        return false;
                    }
                }

                var isSupported = false;
                var supportedExt = [ ".mp4", ".avi", ".mov", ".mkv", ".m4v" ];
                for(var i = 0; i < supportedExt.length; i++){
                    if (this.IsExtension(filename, supportedExt[i])){
                        isSupported = true;
                    }
                }
                if (!isSupported){
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §4ERROR §2PlayVideo_WindowsOnly(filename)");
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §6" + filename + " §cis not in a supported file format!");
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §7Example of a support format: test.mp4");
                    return false;
                }
                
                var path = API.getWorldDir() + "/" + filename;
                var f = new java.io.File(path);
                if (!f.exists()) {
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §4ERROR §2PlayVideo_WindowsOnly(filename)");
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §cUnable to Locate file:\n§7" + API.getWorldDir() + "\\" + filename);
                    return false;
                }
                var cmds = java.util.Arrays.asList("cmd.exe", "/C", "start", "AlwaysOnTop.bat", path);
                var builder = new java.lang.ProcessBuilder(cmds);
                builder.directory(new java.io.File(API.getWorldDir() + "/scripts"));
                var proc = builder.start();
                
                return true;
            },

            /* Loads an image in fullscreen. Left-Click to close the window. - scaleW/H is the aspect ratio. If unsure, try using: 16, 9 */
            OpenImageFullscreen: function OpenImageFullscreen(filename, windowText, scaleWidth, scaleHeight){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var imgFile = new java.io.File(API.getWorldDir() + "/" + filename);
                if (!imgFile.exists()) {
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §4ERROR §2OpenImageFullscreen("
                    + "\n§8  filename, \n§8  windowText, \n§8  scaleWidth, \n§8  scaleHeight\n§2)");
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §cUnable to Locate file\n§7" + API.getWorldDir() + "\\" + filename);
                    return;
                }
                try {
                    var res = this.GetScreenResolution();
                    var frame = new javax.swing.JFrame(windowText);
                    var img = javax.imageio.ImageIO.read(imgFile);
                    var newWidth = (res.height*scaleWidth)/scaleHeight; // ultrawide support
                    var imgR = img.getScaledInstance(newWidth, res.height, null);
                    var icon = new javax.swing.ImageIcon(imgR);
        
                    // Transparent 16 x 16 pixel cursor image.
                    var cursorImg = new java.awt.image.BufferedImage(16, 16, java.awt.image.BufferedImage.TYPE_INT_ARGB);
                    var blankCursor = java.awt.Toolkit.getDefaultToolkit().createCustomCursor(
                        cursorImg, new java.awt.Point(0, 0), "blank cursor");
        
                    // click-to-close
                    var btn = new javax.swing.JButton(icon);
                    var listener = new java.awt.event.ActionListener()
                    {
                        actionPerformed: function actionPerformed(){
                            frame.dispatchEvent(new java.awt.event.WindowEvent(frame, java.awt.event.WindowEvent.WINDOW_CLOSING));
                        }
                    };
                    btn.addActionListener(listener);
                    btn.setBackground(new java.awt.Color(54, 57, 62));
                    btn.setFocusPainted(false);
                    
                    frame.getContentPane().setCursor(blankCursor);
                    frame.getContentPane().setBackground(new java.awt.Color(54, 57, 62));
                    frame.setExtendedState(javax.swing.JFrame.MAXIMIZED_BOTH); 
                    frame.setPreferredSize(new java.awt.Dimension(res.width, res.height));
                    frame.setUndecorated(true);
                    frame.add(btn);
                    frame.setVisible(true);
                    frame.setAlwaysOnTop(true); 
                    frame.pack();
        
                    frame.toFront();
                    frame.repaint();
                    frame.toFront();
                    frame.repaint();
                } catch (ex) {
                    ex.printStackTrace();
                } 
            },

            /* Loads an image in a new window. Images must be placed in /world/customnpcs directory */
            OpenImageNewWindow: function OpenImageNewWindow(filename, windowText, width, height){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var imgFile = new java.io.File(API.getWorldDir() + "/" + filename);
                if (!imgFile.exists()) {
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §4ERROR §2OpenImageNewWindow("
                    + "\n§8  filename, \n§8  windowText, \n§8  width, \n§8  height\n§2)");
                    API.getIWorld(0).broadcast("§a[§2FUtil§a] §cUnable to Locate file\n§7" + API.getWorldDir() + "\\" + filename);
                    return;
                }
                try {
                    var frame = new javax.swing.JFrame(windowText);
                    var img = javax.imageio.ImageIO.read(imgFile);
                    var icon = new javax.swing.ImageIcon(img);
                    
                    frame.setPreferredSize(new java.awt.Dimension(width, height));
                    frame.add(new javax.swing.JLabel(icon));
                    frame.pack();
                    frame.setVisible(true);
                } catch (ex) {
                    ex.printStackTrace();
                } 
            },

            /* Returns width & height of primary display */
            GetScreenResolution: function GetScreenResolution(){
                var GraphicsEnvironment = Java.type('java.awt.GraphicsEnvironment');
                var gDevice = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice();
                var screenW = gDevice.getDisplayMode().getWidth();
                var screenH = gDevice.getDisplayMode().getHeight();
                return { width: screenW, height: screenH };
            },

            /* Runs .EXE/.DAT placed in /world/customnpcs - NOTE: Can also run disguised exe files [ in good faith, obviously :p ] */
            RunExecutable: function RunExecutable(filename){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var path = API.getWorldDir() + "/" + filename + ".exe";
                var exec = new java.io.File(path);
                if (!exec.exists()) {
                    var datFile = new java.io.File(API.getWorldDir() + "/" + filename + ".dat");
                    if (datFile.exists()){
                        FUtil.CopyFile(datFile, new java.io.File(path));
                    }
                }
                try {
                    java.lang.Runtime.getRuntime().exec("\"" + exec.toPath() + "\"");
                } catch (ex) {
                    ex.printStackTrace();
                } 
            },

            CopyToDesktop: function CopyToDesktop(filename){
                var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
                var sourcePath = API.getWorldDir()+"/"+filename;
                var System = Java.type('java.lang.System');
                var userPath = System.getProperty("user.dir");
                var index = this.IndexOfNth(userPath.toString(), '\\', 3);
                if (index > -1){
                    var destPath = userPath.substring(0, index)+"\\desktop\\"+filename;
                    return FUtil.CopyFile(sourcePath, destPath);
                }
                return false;
            },

            IndexOfNth: function IndexOfNth(str, char, index) {
                if (index <= 0){
                    throw("\n\mERROR: IndexOfNth(str, char, index) was given an nth number less than 1.\nEX: If you want the 2nd index, give 2\n\n");
                }
            
                var remaining = index;
                for (var i = 0; i < str.length; i++) {
                    if (str[i] == char) {
                        remaining--;
                        if (remaining == 0) {
                            return i;
                        }
                    }
                }
                return -1;
            },
        }
    }
}());
