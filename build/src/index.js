"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tauriLog = exports.initializeLogger = void 0;
const api_1 = require("@tauri-apps/api");
const app_1 = require("@tauri-apps/api/app");
const fs_1 = require("@tauri-apps/api/fs");
const constants_1 = require("./constants");
const enums_1 = require("./enums");
let app;
let fileName = '';
let content = '';
let initialized = false;
const date = '[' + new Date().toLocaleString() + ']';
let custom = false;
const logStartMessage = date + ': Tauri Logger started\n===================================\n';
/**
 * Logs diagnostic information about the application.
 */
async function diagnosticLogger() {
    const diagnosticSchema = {
        appName: (await (0, app_1.getName)()).toString(),
        tauriVersion: (await (0, app_1.getTauriVersion)()).toString(),
        appVersion: (await (0, app_1.getVersion)()).toString(),
    };
    setTimeout(() => {
        tauriLog('App Information:\n' + JSON.stringify(diagnosticSchema, null, 4) + '\n');
    }, 1000);
}
/**
 * Initializes the logger with the given options.
 *
 * @param {Object} options - The options for initializing the logger.
 * @param {boolean} [options.reportErrors=true] - Whether to report errors.
 * @param {string} [options.customDirName=""] - Custom directory name for logs.
 * @param {boolean} [options.diagnosticReport=true] - Whether to log diagnostic information.
 */
function initializeLogger({ reportErrors = true, customDirName = '', diagnosticReport = true, }) {
    try {
        (0, app_1.getName)().then((name) => {
            app = name;
        });
        if (!customDirName) {
            createLogDirectory(app);
        }
        else {
            custom = true;
            createLogDirectory(customDirName);
        }
    }
    catch (e) {
        console.log(e);
    }
    if (reportErrors) {
        window.addEventListener('error', (event) => {
            tauriLog('Following Error Occurred: ' + event.message.toString(), enums_1.default.ERROR);
        });
    }
    else {
        console.log('No Errors will be reported', enums_1.default.INFO);
    }
    if (diagnosticReport) {
        diagnosticLogger();
    }
}
exports.initializeLogger = initializeLogger;
/**
 * Creates a log directory with the given directory name.
 *
 * @param {string} dirName - The directory name for the log.
 */
async function createLogDirectory(dirName) {
    try {
        await (0, fs_1.createDir)(dirName + './logs', {
            dir: api_1.fs.BaseDirectory.Document,
            recursive: true,
        });
    }
    catch (e) {
        console.log(e);
    }
}
/**
 * Creates a log file with the current date and app name.
 */
async function createLog() {
    try {
        if (fileName === '') {
            fileName = date + '-' + app;
            fileName = fileName.replace(/[[\]]/g, '');
            fileName = fileName.replace(/:/g, '-');
            fileName = fileName.replace(/\./g, '-') + '.log';
        }
        else {
            return;
        }
    }
    catch (e) {
        if (constants_1.default) {
            throw new Error('Could not create log file, check your scopes!');
        }
        console.error('Could not create log file: ', e);
    }
}
/**
 * Writes the current content to the log file.
 */
async function logger() {
    const writeToLog = async () => {
        try {
            const path = custom
                ? `./${custom}/logs/${fileName}`
                : `./${app}/logs/${fileName}`;
            await api_1.fs.writeFile({
                path,
                contents: content,
            }, {
                dir: api_1.fs.BaseDirectory.Document,
            });
        }
        catch (e) {
            if (constants_1.default) {
                throw new Error('Could not write to log file, check your scopes!');
            }
            console.error('Could not write to log file due to error: ', e);
        }
    };
    if (!fileName) {
        try {
            await createLog();
            console.log('Log file created', fileName);
            await writeToLog();
        }
        catch (e) {
            console.log('Could not write to log file: ', e);
        }
    }
    else {
        await writeToLog();
    }
}
/**

Logs a message with the specified log level.
@param {any} message - The message to log.
@param {LogLevel} [level=LogLevel.INFO] - The log level.
*/
function tauriLog(message, level = enums_1.default.INFO) {
    if (!initialized) {
        initialized = true;
        content += logStartMessage;
    }
    const logPrefix = date + ': ' + enums_1.default[level] + ': ';
    content += logPrefix + message + '\n';
    logger();
}
exports.tauriLog = tauriLog;
//# sourceMappingURL=index.js.map