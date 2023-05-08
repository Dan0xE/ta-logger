import {fs} from '@tauri-apps/api';
import {
  getName as AppName,
  getTauriVersion,
  getVersion,
} from '@tauri-apps/api/app';
import {createDir} from '@tauri-apps/api/fs';
import isDev from './constants';
import LogLevel from './enums';

let app: string | undefined = undefined;
let customDir = '';
let fileName = '';
let content = '';
let initialized = false;
const date = '[' + new Date().toLocaleString() + ']';
let custom = false;

AppName()
  .then(res => {
    app = res as string;
  })
  .catch(e => {
    if (isDev) {
      throw new Error('Failed to get App Name\n', e);
    }
    console.error('Failed to get App Name\n', e);
  });

const logStartMessage =
  date + ': Tauri Logger started\n===================================\n';

/**
 * Logs diagnostic information about the application.
 */
async function diagnosticLogger(): Promise<void> {
  const diagnosticSchema = {
    appName: app!.toString(),
    tauriVersion: (await getTauriVersion()).toString(),
    appVersion: (await getVersion()).toString(),
  };
  setTimeout(() => {
    tauriLog(
      'App Information:\n' + JSON.stringify(diagnosticSchema, null, 4) + '\n'
    );
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
export function initializeLogger({
  reportErrors = true,
  customDirName = undefined,
  diagnosticReport = true,
}: {
  reportErrors?: boolean;
  customDirName?: string;
  diagnosticReport?: boolean;
} = {}) {
  try {
    if (!customDirName) {
      createLogDirectory(app!);
    } else {
      custom = true;
      customDir = customDirName;
      createLogDirectory(customDirName);
    }
  } catch (e) {
    console.error(e);
  }

  if (reportErrors) {
    window.addEventListener('error', (event: ErrorEvent) => {
      tauriLog(
        'Following Error Occurred: ' + event.message.toString(),
        LogLevel.ERROR
      );
    });
  } else {
    console.warn('No Errors will be reported', LogLevel.INFO);
  }
  if (diagnosticReport) {
    diagnosticLogger();
  }
}

/**
 * Creates a log directory with the given directory name.
 *
 * @param {string} dirName - The directory name for the log.
 */
async function createLogDirectory(dirName: string): Promise<void> {
  try {
    await createDir(dirName + '\\logs', {
      dir: fs.BaseDirectory.Document,
      recursive: true,
    });
  } catch (e) {
    console.error(e);
  }
}

/**
 * Creates a log file with the current date and app name.
 */
async function createLog(): Promise<void> {
  try {
    if (fileName === '') {
      fileName = date + '-' + app;
      fileName = fileName.replace(/[[\]]/g, '');
      fileName = fileName.replace(/:/g, '-');
      fileName = fileName.replace(/\./g, '-') + '.log';
    } else {
      return;
    }
  } catch (e) {
    if (isDev) {
      throw new Error('Could not create log file, check your scopes!');
    }
    console.error('Could not create log file: ', e);
  }
}

/**
 * Writes the current content to the log file.
 */
async function logger(): Promise<void> {
  const writeToLog = async (): Promise<void> => {
    try {
      const path = custom
        ? `./${customDir}\\logs\\${fileName}`
        : `./${app}/logs/${fileName}`;
      console.log(path);
      await fs.writeFile(
        {
          path,
          contents: content,
        },
        {
          dir: fs.BaseDirectory.Document,
        }
      );
    } catch (e) {
      if (isDev) {
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
    } catch (e) {
      console.error('Could not write to log file: ', e);
    }
  } else {
    await writeToLog();
  }
}

/**

Logs a message with the specified log level.
@param {any} message - The message to log.
@param {LogLevel} [level=LogLevel.INFO] - The log level.
*/
export function tauriLog(
  message: unknown,
  level: LogLevel = LogLevel.INFO
): void {
  if (!initialized) {
    initialized = true;
    content += logStartMessage;
  }
  const logPrefix = date + ': ' + LogLevel[level] + ': ';
  content += logPrefix + message + '\n';
  logger();
}
