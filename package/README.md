# TaLog

> A frontend logger for Tauri applications, designed to log critical actions and store them locally for easy debugging and analysis.

---

## 🚨 Important Notice

Due to an SSD failure a few weeks ago, I lost all my uncommitted work, leaving behind some unorganized code in this repository. I am doing my best to update the codebase accordingly, and monitoring for any changes in the Tauri API. Additionally, the NPM Package appears to be malfunctioning, and I am working to address that issue.

---

## 🛠️ Configuration: Set Your Scopes

### For the default directory name option:

```json
"tauri": {
  "allowlist": {
    "fs": {
      "createDir": true,
      "writeFile": true,
      "scope": [
        "$DOCUMENT/YOURAPPNAME/logs"
      ]
    }
  }
}
```

### For a custom directory name, modify YOURAPPNAME accordingly:

```json
"scope": ["$DOCUMENT/YOURCUSTOMDIRNAME/logs"]
```

---

## 📝 Usage: Log Specified Actions

```ts
function criticalFunction() {
  try {
    tauriLog("critical function success");
  } catch (e) {
    tauriLog("Crashed: ", e);
  }
}
```

### Initialize the logger:

Insert the following function into your `index.js` or `index.ts` (entry) file.

```ts
initializeLogger();
```

### Log actions:

Use the following function to log actions as needed.

```ts
tauriLog(action);
```

---

## ⚙️ Options

### Frontend error logging:
Errors are logged automatically unless the option is set to **false**:

```ts
initializeLogger({
  reportErrors: false
});
```

### Diagnostic report:

A DiagnosticReport is included by **default** unless disabled (includes appName, appVersion, and the utilized tauriVersion):

```ts
initializeLogger({
  diagnosticReport: false
});
```

---

## 📁 Default Directory

By default, logs are stored in the Document folder, within a directory named after your app. The app name is retrieved from the **config file** created by Tauri:

```json
"package": {
  "productName": "your-appname"
}
```

### Custom directory:

You can also designate a **custom directory** to be created in the **Document Folder**:

```ts
initializeLogger({
  customDirName: "yourDirName"
});
```

---

## 🤝 Contributing

If you encounter any issues or wish to contribute, please feel free to do so!








