import React from "react";
import "./App.css";
import { tauriLog } from "./utils";

function throwError() {
    throw new Error("This is an error");
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <button
                    className="Buttona"
                    onClick={() => tauriLog("Clicked!")}
                >
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
