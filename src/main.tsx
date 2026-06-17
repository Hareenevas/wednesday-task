import React from "react";
import { hydrateRoot } from "react-dom/client";

import "./styles.css";

import { getRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";

const router = getRouter();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error('Missing #root element. Ensure your server renders <div id="root" />.');
}

hydrateRoot(
  rootEl,
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

