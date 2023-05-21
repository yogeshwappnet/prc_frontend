import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { NotificationContextProvider } from "./context/NotificationContext";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <NotificationContextProvider>
        <ToastContainer />
        <App />
      </NotificationContextProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
