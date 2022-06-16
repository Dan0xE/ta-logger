import { fs } from "@tauri-apps/api";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { createDir } from "@tauri-apps/api/fs";
// import { writeFile } from "@tauri-apps/api/fs";
// TODO logger does not work on production yet lmao
//! you need to set fs scope to $App AND Documents because you apperantly cannot use $APP durring development

let fileName: string = "";
let realDir: any;
let envChecked: boolean = false;
let content: string = "";
let appName: string = "";
let tauriVersion = "";
let appVersion = "";
let initiialited = false;
let date = "[" + new Date().toLocaleString() + "]";
const logStartMessage =
    date + ": Tauri Logger started\n===================================\n";

export async function diagnosticLogger() {
    const diagnosticSchema = {
        appName: (await getName()).toString() + "\n",
        tauriVersion: (await getTauriVersion()).toString() + "\n",
        appVersion: (await getVersion()).toString(),
    };
    //check env
    async function getData() {
        getName().then((name) => {
            appName = name;
        });
        getTauriVersion().then((version) => {
            tauriVersion = version;
        });
        getVersion().then((version) => {
            appVersion = version;
        });
    }
    //is that even needed => yes it is lmao
    if (!envChecked) {
        await checkEnv().then(() => {
            getData().then(() => {
                setTimeout(() => {
                    tempLogger(
                        "App Information:\n" +
                            JSON.stringify(diagnosticSchema, null, 4) +
                            "\n"
                    );
                }, 1000);
            });
        });
    } else {
        getData().then(() => {
            tempLogger(JSON.stringify(diagnosticSchema, null, 4));
        });
    }
}

export function testError() {
    throw new Error("test error");
}


//optional! => remove later or check if folder is already existsing or creating logs folder
export function intitializeLogger({
    reportErrors,
    customDirName,
}: {
    reportErrors: boolean; // done
    customDirName?: string;
}) {
    try {
        let app: string;
        getName().then((name) => {
            app = name;
        });

        if (customDirName === "" || customDirName === undefined) {
            setTimeout(() => {
                try {
                    createDir(app, {
                        dir: fs.BaseDirectory.Document,
                    });
                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        } else {
            setTimeout(() => {
                try {
                    createDir(customDirName, {
                        dir: fs.BaseDirectory.Document,
                    });
                } catch (e) {
                    console.log(e);
                }
            }, 1000);
        }
    } catch (e) {
        console.log(e);
    }


    if (reportErrors) {
        window.addEventListener("error", (event) => {
            tempLogger("Following Error Occured: " + event.message.toString());
        });
    }
}

//check if in prod env => dont need
export async function checkEnv() {
    if (envChecked) return;
    try {
        if (process.env.NODE_ENV === "production") {
            try {
                realDir = fs.BaseDirectory.App;
                envChecked = true;
            } catch (e) {
                console.error("Couldn't set path due to error: ", e);
            }
        } else if (process.env.NODE_ENV === "development") {
            try {
                realDir = fs.BaseDirectory.Document;
                envChecked = true;
            } catch (e) {
                console.error("Couldn't set path due to error: ", e);
            }
        } else {
            realDir = fs.BaseDirectory.App;
            envChecked = true;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function createLog() {
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

export async function logger() {
    const writeToLog = () => {
        // let currMessage = Date.now() + ": " + message;
        try {
            fs.writeFile(
                {
                    path: fileName,
                    contents: content,
                },
                {
                    dir: realDir,
                }
            );
        } catch (e) {
            console.error("Could not write to log file due to error: ", e);
        }
    };
    if (!envChecked) await checkEnv();
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

export async function tempLogger(
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
    console.log(content);
}

//TODO find alternative to fs write file due to not beeing able to append to files, maybe by storing logs in memory and write them to file when app is closed(?) | DONE
//=> like having a let content = "" and then adding to it every time a new log is created
//Or maybe just trying to use fs from node modules and find a workarround there(?)
//maybe add a listener or something and check for an exit event and write the log file when that happens
//TODO make code more readable and remove unnecessary code like tempLogger and exitApp
//TODO maybe set option to set custom directory for logs + dirname if null or undefined set it to dir called logs
//TODO make report errors optional
