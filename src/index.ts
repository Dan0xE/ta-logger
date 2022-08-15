import {fs} from "@tauri-apps/api";
import {getName, getTauriVersion, getVersion} from "@tauri-apps/api/app";
import {createDir} from "@tauri-apps/api/fs";
import {debugMode} from "./constants";
import LogLevel from "./enums";

let app: string;
let fileName: string = "";
let content: string = "";
let initialized = false;
let date = "[" + new Date().toLocaleString() + "]";
let custom = false;

const logStartMessage =
    date + ": Tauri Logger started\n===================================\n";

async function diagnosticLogger() {
    const diagnosticSchema = {
        appName: (await getName()).toString(),
        tauriVersion: (await getTauriVersion()).toString(),
        appVersion: (await getVersion()).toString(),
    };
    setTimeout(() => {
        tauriLog(
            "App Information:\n" +
            JSON.stringify(diagnosticSchema, null, 4) +
            "\n"
        );
    }, 1000);
}

export function initializeLogger({
                                     reportErrors,
                                     customDirName,
                                     diagnosticReport,
                                 }: {
    reportErrors?: boolean;
    customDirName?: string;
    diagnosticReport?: boolean;
}) {
    try {
        getName().then((name: string) => {
            app = name;
        });

        if (customDirName === "" || customDirName === undefined) {
            setTimeout(() => {
                try {
                    createDir(app + "./logs", {
                        dir: fs.BaseDirectory.Document,
                        recursive: true,
                    });
                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        } else {
            custom = true;
            setTimeout(() => {
                try {
                    createDir(customDirName + "./logs", {
                        dir: fs.BaseDirectory.Document,
                        recursive: true,
                    });
                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        }
    } catch (e) {
        console.log(e);
    }

    if (reportErrors || reportErrors === undefined) {
        window.addEventListener("error", (event: ErrorEvent) => {
            tauriLog("Following Error Occurred: " + event.message.toString(), 4);
        });
    } else {
        console.log("No Errors will be reported", 1);
    }
    if (diagnosticReport || diagnosticReport === undefined) {
        diagnosticLogger();
    }
}

async function createLog() {
    try {
        if (fileName === "") {
            fileName = date + "-" + app;
            fileName = fileName.replace(/[\[\]]/g, "");
            fileName = fileName.replace(/:/g, "-");
            fileName = fileName.replace(/\./g, "-") + ".log";
        } else {
            return;
        }
    } catch (e) {
        if (debugMode()) {
            throw e("Could not create log file, check your scopes!");
        }
        console.error("Could not create log file: ", e);
    }
}

async function logger() {
    const writeToLog = () => {
        try {
            if (custom) {
                fs.writeFile(
                    {
                        path: `./${custom}/logs/${fileName}`,
                        contents: content,
                    },
                    {
                        dir: fs.BaseDirectory.Document,
                    }
                );
            } else {
                fs.writeFile(
                    {
                        path: `./${app}/logs/${fileName}`,
                        contents: content,
                    },
                    {
                        dir: fs.BaseDirectory.Document,
                    }
                );
            }
        } catch (e) {
            if (debugMode()) {
                throw e("Could not write to log file, check your scopes!");
            }
            console.error("Could not write to log file due to error: ", e);
        }
    };
    if (fileName === "" || fileName === undefined) {
        await createLog()
            .then(() => {
                console.log("Log file created", fileName);
                writeToLog();
            })
            .catch((e) => {
                console.log("Could not write to log file: ", e);
            });
    } else {
        writeToLog();
    }
}



export function tauriLog(message: string, level: LogLevel = LogLevel.INFO) {
    if (!initialized) {
        initialized = true;
        content += logStartMessage;
    }
    switch (level) {
        case LogLevel.DEBUG:
            content += date + ": DEBUG: " + message + "\n";
            break;
        case LogLevel.INFO:
            content += date + ": INFO: " + message + "\n";
            break;
        case LogLevel.WARN:
            content += date + ": WARN: " + message + "\n";
            break;
        case LogLevel.ERROR:
            content += date + ": ERROR: " + message + "\n";
            break;
        case LogLevel.FATAL:
            content += date + ": FATAL: " + message + "\n";
            break;
    }
    logger();
}
