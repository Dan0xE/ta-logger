import { fs } from "@tauri-apps/api";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { createDir } from "@tauri-apps/api/fs";

let app: string;
let fileName: string = "";
let content: string = "";
let appName: string = "";
let tauriVersion = "";
let appVersion = "";
let initiialited = false;
let date = "[" + new Date().toLocaleString() + "]";
let custom = false;

const logStartMessage =
    date + ": Tauri Logger started\n===================================\n";

async function diagnosticLogger() {
    const diagnosticSchema = {
        appName: (await getName()).toString() + "\n",
        tauriVersion: (await getTauriVersion()).toString() + "\n",
        appVersion: (await getVersion()).toString(),
    };
    //check env
    async function getData() {
        getName().then((name: string) => {
            appName = name;
        });
        getTauriVersion().then((version: string) => {
            tauriVersion = version;
        });
        getVersion().then((version: string) => {
            appVersion = version;
        });
    }
    getData().then(() => {
        setTimeout(() => {
            tauriLog(
                "App Information:\n" +
                    JSON.stringify(diagnosticSchema, null, 4) +
                    "\n"
            );
        }, 1000);
    });
}

export function intitializeLogger({
    reportErrors,
    customDirName,
    diagnosticReport,
}: {
    reportErrors?: boolean; // done
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

    if (reportErrors === true || reportErrors === undefined) {
        window.addEventListener("error", (event) => {
            tauriLog("Following Error Occured: " + event.message.toString());
        });
    } else {
        console.log("No Errors will be reported");
    }
    if (diagnosticReport === true || diagnosticReport === undefined) {
        diagnosticLogger();
    }
}

async function createLog() {
    try {
        if (fileName === "") {
            fileName = "log" + Date.now() + ".txt";
        } else {
            return;
        }
    } catch (e) {
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
            console.error("Could not write to log file due to error: ", e);
        }
    };
    if (fileName === "" || fileName === undefined) {
        await createLog()
            .then(() => {
                console.log("Log file created");
                console.log(fileName);
                writeToLog();
            })
            .catch((e) => {
                console.log("Could not write to log file: ", e);
            });
    } else {
        writeToLog();
    }
}

export async function tauriLog(
    message: string | object | number | boolean | undefined | null
) {
    const writeTempLog = () => {
        if (initiialited === false) {
            content = logStartMessage + "\n" + message;
            initiialited = true;
        } else {
            content = content + "\n" + date + ": " + message;
            logger();
        }
    };
    writeTempLog();
}
