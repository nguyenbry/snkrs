import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <div id="theme-determiner" data-theme={localStorage.getItem('toolstheme') || (() => { localStorage.setItem('toolstheme', 'dark'); return 'dark'; })()} className="fullscreen">
      <App />
    </div>
  </React.StrictMode>
);
