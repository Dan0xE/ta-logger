# TaLog

> A frontend logger for Tauri applications, designed to log critical actions and store them locally for easy debugging and analysis.

---

## 🛠️ Configuration: Set Your Scopes

### For the default directory name option:
Define the scopes in your Tauri configuration in the following manner:

```json
"tauri": {
  "allowlist": {
    "fs": {
      "createDir": true,
      "writeFile": true,
      "scope": [
        "$DOCUMENT/YOUR_APP_NAME/logs"
      ]
    }
  }
}
```

Substitue **YOUR_APP_NAME** with the name found in your tauri config

```json
"package": {
    "productName": "test-app", //<--
    ///
  },
```

### For a custom directory name:

```json
"scope": ["$DOCUMENT/CUSTOM_DIRNAME/logs"]
```

Where CUSTOM_DIRNAME is the name of the directory you want to use.
Use the directory name that you specify here and pass it to the `customDirName` option as described below.


---


## 📝 Usage: Log Actions As Required

Logging actions:
Utilize the `log`, `warning`, or `error` methods in the TauriLogger class to log significant events within your critical functions or actions:

```ts
function criticalFunction() {
  try {
    taLog.log("critical function success");
  } catch (e) {
    taLog.error("Crashed: " + e);
  }
}
```

### Initialize the logger:
First import `taLog` from the npm package.
Then invoke the `initializeLogger` method with appropriate options:

```ts
taLog.initializeLogger({
  reportErrors: true,
  customDirName: "myCustomDir",
  diagnosticReport: true,
  consoleLog: true
});
```

## ⚙️ Options

### Frontend error logging:

By default, errors are automatically logged. However, you can set the `reportErrors` option to **false** if you wish to disable automatic error logging.

### Diagnostic report:

The logger provides a diagnostic report by default, which includes the application's name, version, and the utilized Tauri version. This feature can be disabled by setting the `diagnosticReport` option to **false**.

### Console logging:
By default, logging to the console is disabled. It can be enabled by setting the `consoleLog` option to  **true**.

### Custom directory:
By passing a `customDirName` option to the `initializeLogger` method, you can specify a custom directory for your log files.

---

## 🤝 Contributing
Should you encounter any issues or wish to contribute, you're welcome to do so!











