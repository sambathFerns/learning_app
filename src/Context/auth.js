import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();


export const useAuth = () => {
  return useContext(AuthContext);
}


export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, [currentUser]);

  const getCurrentUser = () => {
    const currentUser = localStorage.getItem("loginResponse");
    if (currentUser) {
      setCurrentUser(currentUser);
    }
  };

  return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};
