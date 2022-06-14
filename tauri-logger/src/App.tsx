import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { tempLogger, exitApp } from "./utils/logger";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <button
                    className="Buttona"
                    onClick={() => tempLogger("Clicked!")}
                >
                    Click Me!{" "}
                </button>
                <button className="Buttonb" onClick={() => exitApp()}>
                    Exit and save log!
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
