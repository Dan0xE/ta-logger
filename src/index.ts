import {fs} from '@tauri-apps/api';
import {
  getName as AppName,
  getTauriVersion,
  getVersion,
} from '@tauri-apps/api/app';
import {createDir} from '@tauri-apps/api/fs';
import isDev from './constants';
import LogLevel from './enums';

class TauriLogger {
  static consoleLog = false;
  static app: string | undefined = undefined;
  static customDir = '';
  static fileName = '';
  static content = '';
  static initialized = false;
  static date = '[' + new Date().toLocaleString() + ']';
  static custom = false;
  static logStartMessage =
    TauriLogger.date +
    ': Tauri Logger started\n===================================\n';

  /**
   * Constructor fetches the name of the application.
   * @throws Will throw an error if the application name cannot be fetched and the application is running in development mode.
   */
  constructor() {
    AppName()
      .then(res => {
        TauriLogger.app = res as string;
      })
      .catch(e => {
        if (isDev) {
          throw new Error('Failed to get App Name\n', e);
        }
        console.error('Failed to get App Name\n', e);
      });
  }

  /**
   * Logs diagnostic information about the application.
   * @return {Promise<void>} Promise representing the completion of the diagnostic logging.
   */

  private async diagnosticLogger() {
    const diagnosticSchema = {
      appName: TauriLogger.app!.toString(),
      tauriVersion: (await getTauriVersion()).toString(),
      appVersion: (await getVersion()).toString(),
    };
    setTimeout(() => {
      this.log(
        'App Information:\n' + JSON.stringify(diagnosticSchema, null, 4) + '\n'
      );
    }, 1000);
  }

  /**
   * Initializes the logger with the specified options.
   * @param {Object} options - Options for initializing the logger.
   * @param {boolean} options.reportErrors - Whether to report errors. Defaults to true.
   * @param {string} options.customDirName - Custom directory name for logs. Defaults to undefined.
   * @param {boolean} options.diagnosticReport - Whether to log diagnostic information. Defaults to true.
   * @param {boolean} options.consoleLog - Whether to also log to the console. Defaults to false.
   * @return {Promise<void>} Promise representing the initialization of the logger.
   */
  async initializeLogger({
    reportErrors = true,
    customDirName = undefined,
    diagnosticReport = true,
    consoleLog = false,
  }: {
    reportErrors?: boolean;
    customDirName?: string;
    diagnosticReport?: boolean;
    consoleLog?: boolean;
  } = {}) {
    TauriLogger.consoleLog = consoleLog;
    try {
      if (!customDirName) {
        TauriLogger.createLogDirectory(TauriLogger.app!);
      } else {
        TauriLogger.custom = true;
        TauriLogger.customDir = customDirName;
        TauriLogger.createLogDirectory(customDirName);
      }
    } catch (e) {
      console.error(e);
    }

    if (reportErrors) {
      window.addEventListener('error', (event: ErrorEvent) => {
        this.error('Following Error Occurred: ' + event.message.toString());
      });
    } else {
      this.log('No Errors will be reported');
    }
    if (diagnosticReport) {
      this.diagnosticLogger();
    }
  }

  /**
   * Creates a log directory with the specified name.
   * @param {string} dirName - Name of the directory to create.
   * @return {Promise<void>} Promise representing the creation of the directory.
   */
  static async createLogDirectory(dirName: string): Promise<void> {
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
   * Creates a log file named with the current date and application name.
   * @return {Promise<void>} Promise representing the creation of the log file.
   * @throws Will throw an error if the log file cannot be created and the application is running in development mode.
   */
  static async createLog(): Promise<void> {
    try {
      if (TauriLogger.fileName === '') {
        TauriLogger.fileName = TauriLogger.date + '-' + TauriLogger.app;
        TauriLogger.fileName = TauriLogger.fileName.replace(/[[\]]/g, '');
        TauriLogger.fileName = TauriLogger.fileName.replace(/:/g, '-');
        TauriLogger.fileName =
          TauriLogger.fileName.replace(/\./g, '-') + '.log';
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
   * @return {Promise<void>} Promise representing the writing of content to the log file.
   */
  private async logger() {
    const writeToLog = async (): Promise<void> => {
      try {
        const path = TauriLogger.custom
          ? `./${TauriLogger.customDir}\\logs\\${TauriLogger.fileName}`
          : `./${TauriLogger.app}/logs/${TauriLogger.fileName}`;
        await fs.writeFile(
          {
            path,
            contents: TauriLogger.content,
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
    if (!TauriLogger.fileName) {
      try {
        await TauriLogger.createLog();
        console.log('Log file created', TauriLogger.fileName);
        await writeToLog();
      } catch (e) {
        console.error('Could not write to log file: ', e);
      }
    } else {
      await writeToLog();
    }
  }

  /**
   * Logs a message with log level 'INFO'.
   * @param {...any} messages - The messages to log.
   * @return {TauriLogger} The logger instance.
   */
  log(...messages: any[]) {
    this.tauriLog(LogLevel.INFO, ...messages);
    return this;
  }
  /**
   * Logs a message with log level 'WARNING'.
   * @param {...any} messages - The messages to log.
   * @return {TauriLogger} The logger instance.
   */
  warning(...messages: any[]) {
    this.tauriLog(LogLevel.WARNING, ...messages);
    return this;
  }

  /**
   * Logs a message with log level 'ERROR'.
   * @param {...any} messages - The messages to log.
   * @return {TauriLogger} The logger instance.
   */
  error(...messages: any[]) {
    this.tauriLog(LogLevel.ERROR, ...messages);
    return this;
  }

  /**
   * Logs a message with the specified log level.
   * @param {LogLevel} level - The log level.
   * @param {...any} messages - The messages to log.
   * @return {TauriLogger} The logger instance.
   */
  private tauriLog(level: LogLevel, ...messages: any[]) {
    if (!TauriLogger.initialized) {
      TauriLogger.initialized = true;
      TauriLogger.content += TauriLogger.logStartMessage;
    }
    const logPrefix = TauriLogger.date + ': ' + LogLevel[level] + ': ';
    messages.forEach(message => {
      TauriLogger.content += logPrefix + message + '\n';
    });
    if (TauriLogger.consoleLog) {
      switch (level) {
        case LogLevel.WARNING:
          console.warn(...messages);
          break;
        case LogLevel.ERROR:
          console.error(...messages);
          break;
        default:
          console.log(...messages);
      }
    }
    this.logger();
    return this;
  }
}

const taLog = new TauriLogger();
export default taLog;
