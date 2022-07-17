## Log critical actions through your frontend like you would do with console.log and store them locally!

! Important - My SSD Fried a few weeks ago so i lost all my unpushed work, leaving me with some spaghetti code here. I will try my best to update the codebase accordingly, and will look out if there's some stuff that changed in the tauri api. Also the NPM Package seems to be broken, i am working on that !

## IMPORTANT! Don't forget to set your scopes:


**If you use the default dir-name option (see below)**

```

"tauri": {
        "allowlist": {
		"fs": {
			"createDir": true,
			"writeFile": true,
			"scope": ["$DOCUMENT/YOURAPPNAME/logs"]
			}
		}
}
```


Or if you use a **custom dir name** you will have to change the YOURAPPNAME accordingly

```
"scope": ["$DOCUMENT/YOURCUSTOMDIRNAME/logs"]
```



## This can be utilized to write logs of certain specified actions:

```
function criticalFunction() {
	try {
		tauriLog("critical function success")
	}
	catch (e)
		tauriLog("Crashed: " e)
}
```

**To use the logger, place the function**

```
initializeLogger()
```

inside your index.js/ts file


**Then use**

```
tauriLog(action)
```

**whenever you want to log something**


Errors produced by your frontend are logged automaticly unless you set the option to **false**

```
initializeLogger({
	reportErrors: false
})
```

A DiagnosticReport is also included **by default** unless turned off (includes appName, appVersion and the used tauriVersion)

```
initializeLogger({
	diagnosticReport: false
})
```



**The default directory where the logs are stored is the Document folder, inside which a directory with you app name will be created**

The app name is retrieved from the **config file** created by tauri

Example:

```
"package": {
        "productName": "your-appname",
    },
```



You can also set a **custom dir** that will be created in the **Document Folder**

```
initializeLogger({
	customDirName: "yourDirName"
})
```



If you encounter any problems or want to contribute feel free to do so!!!

[Github Repo](https://github.com/Dan0xE/tauri-logger/)
