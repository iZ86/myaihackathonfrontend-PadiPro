import { createContext, useContext } from 'react';
import type { UserData } from '@datatypes/userType';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (mobileNo: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || !context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};