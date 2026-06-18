import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./apps/store"; // 💡 Aligned folder name to "apps" based on your directory log
import { SnackbarProvider } from "notistack";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure index.html has an element with id='root'");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <SnackbarProvider autoHideDuration={2000}>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </React.StrictMode>
);