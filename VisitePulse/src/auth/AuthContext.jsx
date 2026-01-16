import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Helper to extract role from JWT scope (e.g., "ROLE_ADMIN" -> "ADMIN")
  const parseUserFromToken = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      const scope = decoded.scope || "";
      // Trouve le rôle qui commence par ROLE_ ou prend le premier élément du scope
      const rawRole = scope.split(" ").find(s => s.startsWith("ROLE_")) || scope.split(" ")[0] || "VISITOR";
      const role = rawRole.replace("ROLE_", ""); // "ADMIN", "AGENT", etc.
      
      return {
        email: decoded.sub,
        role: role,
        rawRole: rawRole,
        // Add other claims if needed
      };
    } catch (e) {
      console.error("Failed to parse token", e);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const userData = parseUserFromToken(token);
      if (userData) {
        setUser(userData);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const newToken = response.data.token;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Decode immediately to return user info to the caller
      const userData = parseUserFromToken(newToken);
      setUser(userData);

      toast.success(t('login.success') || "Connexion réussie");
      return userData; // Return user data for redirection logic
    } catch (error) {
      console.error("Login error", error);
      toast.error(t('login.error'));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.info("Déconnexion...");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
