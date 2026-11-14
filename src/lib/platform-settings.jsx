import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PLATFORM_SETTINGS, calculateProjectFinancials, } from "@/lib/platform-config";
const STORAGE_KEY = "weconnect.platform-settings";
const PlatformSettingsContext = createContext(null);
export function PlatformSettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_PLATFORM_SETTINGS);
    // Read persisted values after mount so server and client markup match.
    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw)
                setSettings({ ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(raw) });
        }
        catch {
            // Ignore unreadable storage and keep defaults.
        }
    }, []);
    const persist = useCallback((next) => {
        setSettings(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
        catch {
            // Storage failures should not break the UI.
        }
    }, []);
    const updateSettings = useCallback((patch) => {
        setSettings((prev) => {
            const next = { ...prev, ...patch };
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            }
            catch {
                // Ignore.
            }
            return next;
        });
    }, []);
    const resetSettings = useCallback(() => persist(DEFAULT_PLATFORM_SETTINGS), [persist]);
    const value = useMemo(() => ({
        settings,
        updateSettings,
        resetSettings,
        financialsFor: (budget) => calculateProjectFinancials(budget, settings.projectCommissionPercentage),
    }), [settings, updateSettings, resetSettings]);
    return (<PlatformSettingsContext.Provider value={value}>{children}</PlatformSettingsContext.Provider>);
}
export function usePlatformSettings() {
    const ctx = useContext(PlatformSettingsContext);
    if (!ctx) {
        throw new Error("usePlatformSettings must be used within a PlatformSettingsProvider");
    }
    return ctx;
}
/** Convenience hook for pages that only need the money breakdown. */
export function useProjectFinancials(budget) {
    const { settings } = usePlatformSettings();
    return calculateProjectFinancials(budget, settings.projectCommissionPercentage);
}
