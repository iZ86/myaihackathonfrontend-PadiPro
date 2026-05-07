import { useState, type ReactNode } from "react";
import { updateUserCoordsByMobileNoAPI } from "../../features/location/api/location";
import { useAuth } from "@context/auth/useAuth";
import { LocationContext } from "./useLocation";

export function LocationProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();

  const hasLocationPermission =
    user?.coords?._latitude !== undefined &&
    user?.coords?._longitude !== undefined &&
    user?.coords?._latitude !== 0 &&
    user?.coords?._longitude !== 0;
  const latitude = user?.coords?._latitude ?? null;
  const longitude = user?.coords?._longitude ?? null;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    if (!user?.mobile_no) {
      setError("User not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    return new Promise<void>((resolve) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setIsLoading(false);
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            await updateUserCoordsByMobileNoAPI(user.mobile_no, lat, lon);

            // Update auth user state locally to unlock restricted pages immediately
            updateUser({
              coords: {
                _latitude: lat,
                _longitude: lon,
              },
            });
          } catch (err) {
            console.error("Failed to sync location to backend:", err);
            setError("Failed to save location to server. Please try again.");
          }

          setIsLoading(false);
          resolve();
        },
        (error) => {
          console.error("Location permission denied or error:", error);
          setError(
            "Location access denied. Please enable it in your browser settings to use core features.",
          );
          setIsLoading(false);
          resolve();
        },
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        hasLocationPermission,
        latitude,
        longitude,
        isLoading,
        error,
        requestLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
