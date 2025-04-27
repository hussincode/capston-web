import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { DataProvider } from "./contexts/DataContext";

createRoot(document.getElementById("root")!).render(
  <>
    <DataProvider>
      <App />
    </DataProvider>
    <Analytics />
  </>
);
