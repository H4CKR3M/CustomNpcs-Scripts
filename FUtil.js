/* v2.0 - FileUtilities | Loadable From Anywhere | Verified 1.12.2+ (1.12.2, 1.16.5) | Written by Rimscar */

var FUtil = (function () { var _FUtil = {};

    /**
     * Copies the entire contents of one directory to another location.
     *
     * @param {string} sourcePath - The path of the directory to copy from.
     * @param {string} destPath - The destination path where the directory and its contents will be copied.
     * @returns {boolean} `true` if the operation succeeded; otherwise, `false`.
     *
     * @remarks
     * This function performs a recursive copy of all subdirectories and files under `sourcePath`.  
     * Depending on implementation, existing files in the destination may be overwritten.
     */
    _FUtil.CopyDirectory = function (sourcePath, destPath) { return P.FUtil.P.CopyDir_Helper(sourcePath, destPath); };

    /**
     * Copies a single file from one location to another.
     *
     * @param {string} sourcePath - The full path of the file to copy.
     * @param {string} destPath - The destination path for the new file.
     * @returns {boolean} `true` if the copy succeeded; otherwise, `false`.
     *
     * @remarks
     * This function performs a direct file copy. Depending on implementation,
     * it may overwrite the destination file if it already exists.
     */
    _FUtil.CopyFile = function (sourcePath, destPath) { return P.CopyFile(new java.io.File(sourcePath), destPath); };

    /**
     * Deletes a directory and its contents from the filesystem.
     *
     * @param {typeof java.io.File} folder - A folder of type 'java.io.File' to be deleted.
     *
     * @remarks
     * This function is expected to remove all files and subdirectories within the given folder.  
     * May take some time, as it "schedules" for deletion and the files are cleaned up later.
     */
    _FUtil.DeleteDirectory = function (folder) { return P.DeleteDirectory(folder); };

    /**
     * Checks whether a given file or directory exists.
     *
     * @param {string} path - The file or directory path to check.
     * @returns {boolean} `true` if the path exists; otherwise, `false`.
     */
    _FUtil.Exists = function (path) { return new java.io.File(path).exists(); };

    /**
     * Checks whether a specific file exists within a given directory.
     *
     * @param {string} directoryPath - The directory to search within.
     * @param {string} filename - The name of the file to check for.
     * @returns {boolean} `true` if the file exists in the directory; otherwise, `false`.
     */
    _FUtil.ExistsInDirectory = function (directoryPath, filename) { return P.ExistsInDirectory(directoryPath, filename); };

    /**
     * Determines whether a filename has the specified extension.
     *
     * @param {string} filename - The name of the file (with or without path).
     * @param {string} extension - The extension to check for (e.g., ".txt" or "txt").
     * @returns {boolean} `true` if the file has the given extension; otherwise, `false`.
     *
     * @example
     * IsExtension("document.txt", "txt"); // true
     * IsExtension("image.jpg", ".png");   // false
     */
    _FUtil.IsExtension = function (filename, extension) { return P.IsExtension(filename, extension); };

    /**
     * Reads the entire contents of a text file.
     *
     * @param {string} filepath - The path of the file to read.
     * @returns {Array} An array of strings, each string represents a line of text from the file.
     */
    _FUtil.ReadFile = function (filepath) { return P.BufferedRead(new java.io.File(filepath)); };

    /**
     * Writes data to a file, replacing its contents if it already exists.
     *
     * @param {string} filepath - The path of the file to write to.
     * @param {string} data - The data to write into the file.
     *
     * @remarks
     * Depending on implementation, this may create parent directories automatically
     * or throw if the directory path is invalid.
     */
    _FUtil.WriteFile = function (filepath, data) { P.WriteFile(filepath, data); };

    /**
     * Attempts to load a script file from the ECMAScript directory.
     *
     * @param {string} filename - The script filename to load.
     * @returns {boolean} True if load was successful; False otherwise.
     *
     * @remarks
     * Tries to load and execute the given script via Nashorn's `load()` function from  
     * `../world/customnpcs/ecmascript/`.  
     * If the script does not exist or fails to load, this function may silently fail.
     */
    _FUtil.TryLoad = function (filename) { return P.TryLoad(filename); };

    /**
     * Opens an image in fullscreen mode with an optional label.
     *
     * @param {string} filename - The filename of the image to display, must be placed in `../world/customnpcs`
     * @param {string} [labelText] - Optional label text to show alongside the image.
     * @param {number} [scaleW] - Optional width scale factor.
     * @param {number} [scaleH] - Optional height scale factor.
     *
     * @remarks
     * *Assets (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.OpenImageFullscreen = function (filename, labelText, scaleW, scaleH) { P.OpenImageFullscreen(filename, labelText, scaleW, scaleH); };

    /**
     * Opens an image in a new window with a specified size and optional label.
     *
     * @param {string} filename - The filename of the image to display, must be placed in `../world/customnpcs`
     * @param {string} [labelText] - Optional text label to display with the image.
     * @param {number} [width] - The desired window width.
     * @param {number} [height] - The desired window height.
     *
     * @remarks
     * *Assets (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.OpenImageNewWindow = function (filename, labelText, width, height) { P.OpenImageNewWindow(filename, labelText, width, height); };

    /**
     * Plays a video file - user must be running WINDOWS and in SINGLEPLAYER.
     *
     * @param {string} filename - The path to the video file to play, must be placed in `../world/customnpcs`
     * @returns {boolean} `true` if the video was successfully played on Windows; otherwise, `false`.
     *
     * @warning
     * Requires `AlwaysOnTop.dat` to be placed in `/world/customnpcs/scripts`
     * 
     * @remarks
     * This function is **only supported on Windows**.  
     * Will return `false` if executed on a non-Windows system or if playback fails.  
     * *Assets (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.PlayVideoSingleplayer_WindowsOnly = function (filename) { return P.PlayVideoSingleplayer_WindowsOnly(filename); };

    /**
     * Runs an executable file.
     *
     * @param {string} filename - The name of the executable to run, must be placed in `../world/customnpcs`
     *
     * @remarks
     * Executes the specified program on the host system, behavior may vary across platforms.    
     * Will run with the same permissions as Minecraft.  
     * *The executable (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.RunExecutable = function (filename) { return P.RunExecutable(filename); };

    /**
     * Copies a file to the user's desktop directory.
     *
     * @param {string} filename - The name of the file, must be placed in `../world/customnpcs`
     * @returns {boolean} True if copy success; False otherwise
     *
     * @remarks
     * The destination path is automatically resolved to the user's desktop folder.  
     * Overwrites may occur if a file with the same name already exists.  
     * *Assets (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.CopyToDesktop = function (filename) { return P.CopyToDesktop(filename); };

    /**
     * Writes a file to the local asset directory.
     *
     * @param {string} filename - The name of the file to write.
     * @param {string} data - The data to write into the file.
     *
     * @remarks
     * Creates a file with the given name and data in the local `../world/customnpcs` directory.  
     * *Assets (Videos, PNGs, etc...) must be placed in `/world/customnpcs`*
     */
    _FUtil.WriteLocalFile = function (filename, data) { P.WriteLocalFile(filename, data); };

    /**
     * Encodes a string into Base64 format.
     *
     * @param {string} string - The plain text string to encode.
     * @returns {string} The Base64-encoded representation of the input string.
     */
    _FUtil.Encrypt = function (string) { return P.Encrypt(string); };

    /**
     * Decodes a Base64 string into human-readable text.
     *
     * @param {string} stringBase64 - The Base64-encoded string to decode.
     * @returns {string} The decoded, human-readable string.
     */
    _FUtil.Decrypt = function (stringBase64) { return P.Decrypt(stringBase64); };

    /**
     * Extracts a ZIP archive into a specified directory.
     *
     * @param {string} zipPath - The path to the ZIP file to extract.
     * @param {string} destFolderPath - The destination folder where contents will be placed.
     * @returns {string[]} A list of files successfully extracted. Returns an empty list if an error occurred or nothing was extracted.
     *
     * @remarks
     * Unzips the archive and places its contents into `destFolderPath`.
     */
    _FUtil.UnzipDirectory = function (zipPath, destFolderPath) { return P.UnzipDirectory(zipPath, destFolderPath); };

    /**
     * Extracts a ZIP archive into the working directory.
     *
     * @param {string} zipPath - The path to the ZIP file to extract.
     * @returns {string[]} A list of files successfully extracted. Returns an empty list if extraction failed.
     */
    _FUtil.Unzip = function (zipPath) { return P.Unzip(zipPath); };

    /**
     * Determines whether the game is running on dedicated server hardware.
     *
     * @returns {boolean} `true` if running on a dedicated server; otherwise, `false`.
     */
    _FUtil.IsDedicatedServer = function () { return P.IsDedicatedServer(); };

    /**
     * Abruptly terminates the Java Virtual Machine (JVM).
     *
     * @returns {void}
     *
     * @remarks
     * Immediately closes Minecraft, does not save.  
     * Guarantees that the world "rolls-back"
     */
    _FUtil.TerminateJVM = function () { return P.TerminateJVM(); };

    var P = {
        CopyDir_Helper: function CopyDir_Helper(sourcePath, destPath) {
            return this.CopyDirectory(new java.io.File(sourcePath), new java.io.File(destPath));
        },

        /* Copies a directory recursively using java nio */
        CopyDirectory: function CopyDirectory(source, target) {
            if (!source.exists()) {
                return false;
            }
            if (source.isDirectory()) {
                if (!target.exists()) {
                    target.mkdir();
                }

                var listFile = source.listFiles();
                for (var i = 0; i < listFile.length; i++) {
                    var f = listFile[i];

                    var sourceFile = new java.io.File(source, f.getName());
                    var outputFile = new java.io.File(target, f.getName());
                    if (f.isDirectory()) {
                        this.CopyDirectory(sourceFile, outputFile);
                    } else {
                        this.CopyFile(sourceFile, outputFile);
                    }
                }
                return true;
            }
            return false;
        },

        CopyFile: function CopyFile(inputFile, outputFile) {
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
            if (files != null) {
                for (var i = 0; i < files.length; i++) {
                    var f = files[i];
                    if (f.isDirectory()) {
                        this.DeleteDirectory(f);
                    } else {
                        f.delete();
                    }
                }
            }
            folder.delete();
        },

        ExistsInDirectory: function ExistsInDirectory(directoryPath, filename) {
            var directory = new java.io.File(directoryPath);
            if (directory.isDirectory()) {
                var listFile = directory.listFiles();
                for (var i = 0; i < listFile.length; i++) {
                    var f = listFile[i];
                    if (f.getName().toUpperCase() == filename.toUpperCase()) {
                        return true;
                    }
                }
            }
            return false;
        },

        IsExtension: function IsExtension(filename, extension) {
            return filename.substring(filename.lastIndexOf("."), filename.length) == extension;
        },

        BufferedRead: function BufferedRead(file) {
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

        WriteFile: function WriteFile(filepath, data) {
            var f = new java.io.File(filepath);
            var fPathString = f.toString();
            var sourcePath = fPathString.substring(0, fPathString.lastIndexOf("\\"));
            if (fPathString.lastIndexOf("\\") == -1) {
                throw ("\n\nFUtil Error:\nWriteFile(filepath, data) was given an invalid file path:\n\"" + filepath + "\" is not a valid path!\n\n");
            }
            try {
                var source = new java.io.File(sourcePath);
                if (!source.exists()) {
                    source.mkdirs();
                }
                if (!f.exists()) {
                    f.createNewFile();
                }
                var pw = new java.io.PrintWriter(f);
                pw.println(data);
            } catch (ex) {
                ex.printStackTrace();
            } finally {
                pw.close();
            }
        },

        WriteLocalFile: function WriteLocalFile(filename, data) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var path = API.getWorldDir() + "/" + filename;
            this.WriteFile(path, data);
        },

        Encrypt: function Encrypt(string) {
            var encoder = Java.type('java.util.Base64').getEncoder();
            if (encoder != null) {
                var encodedBytes = encoder.encode(string.getBytes());
                return new java.lang.String(encodedBytes);
            }
        },

        Decrypt: function Decrypt(stringBase64) {
            var decoder = Java.type('java.util.Base64').getDecoder();
            if (decoder != null) {
                var decodedBytes = decoder.decode(stringBase64.getBytes());
                return new java.lang.String(decodedBytes);
            }
        },

        /* Unzips given zip into the current directory */
        Unzip: function Unzip(zipFilePath) {
            return this.UnzipDirectory(zipFilePath, new java.io.File(zipFilePath).getParent());
        },

        /* Unzips given zip into the target directory */
        UnzipDirectory: function UnzipDirectory(zipFilePath, destFolderPath) {
            var fileList = [];
            try {
                var zipFile = new java.io.File(zipFilePath);
                var inputStream = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFile))
                var entry = inputStream.getNextEntry();
                while (entry != null) {
                    var newFile = new java.io.File(destFolderPath + java.io.File.separator + entry.getName());
                    new java.io.File(newFile.getParent()).mkdirs();
                    if (!entry.isDirectory()) {
                        var outputStream = new java.io.FileOutputStream(newFile);
                        var length;
                        // @ts-ignore
                        var buffer = new Uint8Array(1024).toString().getBytes();
                        while ((length = inputStream.read(buffer)) > 0) {
                            outputStream.write(buffer, 0, length);
                        }
                    }
                    fileList.push(newFile.getAbsolutePath());
                    entry = inputStream.getNextEntry();
                }
                inputStream.closeEntry();
            } catch (ex) {
                ex.printStackTrace(java.lang.System.out);
            }
            return fileList;
        },

        IsDedicatedServer: function IsDedicatedServer() {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var world = API.getIWorlds()[0];
            if (world.getTempdata().has("DEDICATED_SERVER")) {
                return true;
            }

            var map = new java.io.File(API.getWorldDir().getParent());
            var parentDir = new java.io.File(map.getParent());
            var listFile = parentDir.listFiles();
            for (var i = 0; i < listFile.length; i++) {
                var f = listFile[i];
                if (f.getName() == "forge_server.jar" || f.getName() == "forge.jar" || f.getName() == "minecraft_server.1.12.2.jar") {
                    world.getTempdata().put("DEDICATED_SERVER", 1);
                    return true;
                }
            }
            return false;
        },

        /* Opens a file using the CMD --- File must be located in /world/customnpcs directory */
        PlayVideoSingleplayer_WindowsOnly: function PlayVideoSingleplayer_WindowsOnly(filename) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();

            // the reason this is even here is because this function <DOES NOT WORK> on multiplayer...
            if (this.IsDedicatedServer()) {
                return false;
            }

            // If the library is missing, just assume they're playing on Linux or something and don't throw an exception
            var aotfPath = API.getWorldDir() + "/scripts/AlwaysOnTop.bat";
            var aotf = new java.io.File(aotfPath);
            if (!aotf.exists()) {

                // AlwaysOnTop.dat exists, but AlwaysOnTop.bat does not? If so, copy/rename the file
                var aotDat = new java.io.File(API.getWorldDir() + "/scripts/AlwaysOnTop.dat");
                if (aotDat.exists()) {
                    this.CopyFile(aotDat, new java.io.File(aotfPath));
                }
                else {
                    API.getIWorlds()[0].broadcast("§cUnable to play video §6" + filename + "§c through §3PlayVideo_WindowsOnly");
                    API.getIWorlds()[0].broadcast("§6This is optional, but you can play the video yourself at:\n§7" + API.getWorldDir() + "\\" + filename);
                    return false;
                }
            }

            var isSupported = false;
            var supportedExt = [".mp4", ".avi", ".mov", ".mkv", ".m4v"];
            for (var i = 0; i < supportedExt.length; i++) {
                if (this.IsExtension(filename, supportedExt[i])) {
                    isSupported = true;
                }
            }
            if (!isSupported) {
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §4ERROR §2PlayVideo_WindowsOnly(filename)");
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §6" + filename + " §cis not in a supported file format!");
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §7Example of a support format: test.mp4");
                return false;
            }

            var path = API.getWorldDir() + "/" + filename;
            var f = new java.io.File(path);
            if (!f.exists()) {
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §4ERROR §2PlayVideo_WindowsOnly(filename)");
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §cUnable to Locate file:\n§7" + API.getWorldDir() + "\\" + filename);
                return false;
            }
            var cmds = java.util.Arrays.asList("cmd.exe", "/C", "start", "AlwaysOnTop.bat", path);
            var builder = new java.lang.ProcessBuilder(cmds);
            builder.directory(new java.io.File(API.getWorldDir() + "/scripts"));
            var proc = builder.start();

            return true;
        },

        /* Loads an image in fullscreen. Left-Click to close the window. - scaleW/H is the aspect ratio. If unsure, try using: 16, 9 */
        OpenImageFullscreen: function OpenImageFullscreen(filename, windowText, scaleWidth, scaleHeight) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var imgFile = new java.io.File(API.getWorldDir() + "/" + filename);
            if (!imgFile.exists()) {
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §4ERROR §2OpenImageFullscreen("
                    + "\n§8  filename, \n§8  windowText, \n§8  scaleWidth, \n§8  scaleHeight\n§2)");
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §cUnable to Locate file\n§7" + API.getWorldDir() + "\\" + filename);
                return;
            }
            try {
                var res = this.GetScreenResolution();
                var frame = new javax.swing.JFrame(windowText);
                var img = javax.imageio.ImageIO.read(imgFile);
                var newWidth = (res.height * scaleWidth) / scaleHeight; // ultrawide support
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
                    // @ts-ignore
                    actionPerformed: function actionPerformed() {
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
        OpenImageNewWindow: function OpenImageNewWindow(filename, windowText, width, height) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var imgFile = new java.io.File(API.getWorldDir() + "/" + filename);
            if (!imgFile.exists()) {
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §4ERROR §2OpenImageNewWindow("
                    + "\n§8  filename, \n§8  windowText, \n§8  width, \n§8  height\n§2)");
                API.getIWorlds()[0].broadcast("§a[§2FUtil§a] §cUnable to Locate file\n§7" + API.getWorldDir() + "\\" + filename);
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
        GetScreenResolution: function GetScreenResolution() {
            var GraphicsEnvironment = Java.type('java.awt.GraphicsEnvironment');
            var gDevice = GraphicsEnvironment.getLocalGraphicsEnvironment().getDefaultScreenDevice();
            var screenW = gDevice.getDisplayMode().getWidth();
            var screenH = gDevice.getDisplayMode().getHeight();
            return { width: screenW, height: screenH };
        },

        /* Runs .EXE/.DAT placed in /world/customnpcs - NOTE: Can also run disguised exe files [ in good faith, obviously :p ] */
        RunExecutable: function RunExecutable(filename) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var path = API.getWorldDir() + "/" + filename + ".exe";
            var exec = new java.io.File(path);
            if (!exec.exists()) {
                var datFile = new java.io.File(API.getWorldDir() + "/" + filename + ".dat");
                if (datFile.exists()) {
                    FUtil.CopyFile(datFile, new java.io.File(path));
                }
            }
            try {
                java.lang.Runtime.getRuntime().exec("\"" + exec.toPath() + "\"");
            } catch (ex) {
                ex.printStackTrace();
            }
        },

        CopyToDesktop: function CopyToDesktop(filename) {
            var API = Java.type("noppes.npcs.api.NpcAPI").Instance();
            var sourcePath = API.getWorldDir() + "/" + filename;
            var System = Java.type('java.lang.System');
            var userPath = System.getProperty("user.dir");
            var index = this.IndexOfNth(userPath.toString(), '\\', 3);
            if (index > -1) {
                var destPath = userPath.substring(0, index) + "\\desktop\\" + filename;
                return FUtil.CopyFile(sourcePath, destPath);
            }
            return false;
        },

        /* (Unsafe) System.exit alternative. Useful for adding a [Exit Game] button to a CustomGUI. */
        TerminateJVM: function TerminateJVM() {
            var Runnable = Java.type('java.lang.Runnable');
            var Printer = Java.extend(Runnable, {
                run: function () {
                    while (true) {
                        var unsafeField = Java.type('sun.misc.Unsafe').class.getDeclaredField("theUnsafe");
                        unsafeField.setAccessible(true);
                        var unsafe = unsafeField.get(null);
                        unsafe.putAddress(0, 0);
                    }
                }
            });
            var Thread = Java.type('java.lang.Thread');
            var thread = new Thread(new Printer());
            thread.start();
        },

        IndexOfNth: function IndexOfNth(str, char, index) {
            if (index <= 0) {
                throw ("\n\nFUtil Error:\nIndexOfNth(str, char, index) was given an nth number less than 1.\nEX: If you want the 2nd index, give 2\n\n");
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

        /* Convenience function for loading any script scripts folder: aka <world_name>/customnpcs/scripts/ecmascript/  */
        TryLoad: function TryLoad(filename) {
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
                    if (!f.isDirectory() && f.getName() == filename) {
                        try {
                            load(f);
                            return true;
                        } catch (ex) {
                            ex.printStackTrace(java.lang.System.out);
                            break;
                        }
                    }
                }
            }
            return false;
        },
    };
    return _FUtil;
}());