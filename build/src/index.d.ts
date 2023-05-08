import LogLevel from './enums';
/**
 * Initializes the logger with the given options.
 *
 * @param {Object} options - The options for initializing the logger.
 * @param {boolean} [options.reportErrors=true] - Whether to report errors.
 * @param {string} [options.customDirName=""] - Custom directory name for logs.
 * @param {boolean} [options.diagnosticReport=true] - Whether to log diagnostic information.
 */
export declare function initializeLogger({ reportErrors, customDirName, diagnosticReport, }: {
    reportErrors?: boolean;
    customDirName?: string;
    diagnosticReport?: boolean;
}): void;
/**

Logs a message with the specified log level.
@param {any} message - The message to log.
@param {LogLevel} [level=LogLevel.INFO] - The log level.
*/
export declare function tauriLog(message: unknown, level?: LogLevel): void;
