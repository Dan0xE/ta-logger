import React from "react";
import "./App.css";
import { initializeLogger, tauriLog } from "tauri-logger";

function throwError() {
    throw new Error("This is an error");
}

initializeLogger({
    customDirName: "my-custom-dir",
    diagnosticReport: false,
});

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <button className="Buttona" onClick={() => tauriLog("addasd")}>
                    Click Me!{" "}
                </button>
                <button className="Buttona" onClick={() => throwError()}>
                    {" "}
                    Log Frontend Error
                </button>
            </header>
        </div>
    );
}

export default App;
