import { fs } from "@tauri-apps/api";
// import { writeFile } from "@tauri-apps/api/fs";
import { exit } from "@tauri-apps/api/process";

//! you need to set fs scope to $App AND Documents because you apperantly cannot use $APP durring development

let fileName: string = "";
let realDir: any;
let envChecked: boolean = false;
let content: string = "";
const logStartMessage = "Tauri Logger started";

//check if in prod env
export async function checkEnv() {
    if (envChecked) return;
    try {
        if (process.env.NODE_ENV === "production") {
            try {
                realDir = fs.BaseDirectory.App;
                envChecked = true;
            } catch (e) {
                console.log("Couldn't set path due to error: ", e);
            }
        } else if (process.env.NODE_ENV === "development") {
            try {
                realDir = fs.BaseDirectory.Document;
                envChecked = true;
            } catch (e) {
                console.log("Couldn't set path due to error: ", e);
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
        console.log("Could not create log file: ", e);
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
            console.log("Could not write to log file due to error: ", e);
        }
    };
    if (!envChecked) await checkEnv();
    if (fileName == "" || fileName == undefined) {
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

export function exitApp() {
    //!!! race condition ouch
    logger();
    setTimeout(() => {
        exit();
    }, 1000);
}

export async function tempLogger(message: string) {
    const writeTempLog = () => {
        content = content + "\n" + Date.now() + ": " + message;
    };
    writeTempLog();
    console.log(content);
}

//TODO find alternative to fs write file due to not beeing able to append to files, maybe by storing logs in memory and write them to file when app is closed(?)
//=> like having a let content = "" and then adding to it every time a new log is created
//Or maybe just trying to use fs from node modules and find a workarround there(?)
