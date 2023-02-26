import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import VendoApiClient from "./VendoApiClient";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error(
    "Failed to start Application: Missing env variable REACT_APP_API_BASE_URL"
  );
}

const api = new VendoApiClient({
  baseURL: process.env.REACT_APP_API_BASE_URL as string,
});

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App api={api} />,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
