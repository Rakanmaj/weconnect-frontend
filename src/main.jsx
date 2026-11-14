import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PlatformSettingsProvider } from "@/lib/platform-settings";
import { MetricMotion } from "@/components/ui/metric-motion";
import { AuthProvider } from "@/lib/auth";
import App from "./App";
import "./fonts.css";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
    <PlatformSettingsProvider>
      <App />
      <MetricMotion />
    </PlatformSettingsProvider>
    </AuthProvider>
  </BrowserRouter>,
);
