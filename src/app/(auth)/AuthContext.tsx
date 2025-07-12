'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: number;
  iat: number;
  exp: number;
}

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: DecodedToken | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await fetch('/api/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);

          const decoded = jwtDecode<DecodedToken>(data.accessToken);
          setUser(decoded);
        } else {
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Refresh failed:', err);
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessToken();
  }, []);

  const handleSetAccessToken = (token: string | null) => {
    setAccessToken(token);

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken: handleSetAccessToken,
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
