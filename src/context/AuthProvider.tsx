import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { UserData } from "@datatypes/userType";
import { getUserByMobileNoAPI } from "@features/user/api/users";
import { AuthContext } from "./useAuth";
import { reverseGeocodeAPI } from "@features/weather/api/weathers";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserByMobileNo = useCallback(async (mobileNo: string) => {
    try {
      const response = await getUserByMobileNoAPI(
        "local-storage-auth",
        mobileNo,
      );

      if (response && response.ok) {
        const json = await response.json();
        const location = await reverseGeocodeAPI(
          json.data.coords._latitude,
          json.data.coords._longitude,
        );
        setUser({
          ...json.data,
          location,
        });
      } else {
        localStorage.removeItem("mobile_no");
        setUser(null);
      }
    } catch (err) {
      console.error("AuthContext: Failed to fetch user", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedMobile = localStorage.getItem("mobile_no");

    if (storedMobile) {
      getUserByMobileNo(storedMobile);
    } else {
      setLoading(false);
    }
  }, [getUserByMobileNo]);

  const login = async (mobileNo: string) => {
    localStorage.setItem("mobile_no", mobileNo);
    setLoading(true);
    await getUserByMobileNo(mobileNo);
  };

  const logout = () => {
    localStorage.removeItem("mobile_no");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}
