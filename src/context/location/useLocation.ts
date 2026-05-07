import { createContext, useContext } from "react";

interface LocationState {
  hasLocationPermission: boolean;
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
}

export const LocationContext = createContext<LocationState | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
