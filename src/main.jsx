import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/styles/global.css";

import App from "./App.jsx";
import { DataProvider } from "./contexts/DataContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </ToastProvider>
  </StrictMode>,
);
