import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {
      id: "",
      username: "",
      email: "",
      password: "",
      name: "",
      city: "",
      website: "",
    }
  );

  const login = async (inputs) => {
    const res = await axios.post("https://social-media-api-portfolio-01-cozj.onrender.com/api/auth/login", inputs, {
      withCredentials: true,
    });
    const accessToken = res.data.accessToken;
    setCurrentUser(res.data.updatedUser);

    localStorage.setItem('accessToken', accessToken);
    // setCurrentUser(res.data)
    
  };

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log("logout", accessToken);
      await axios.post("https://social-media-api-portfolio-01-cozj.onrender.com/api/auth/logout", null, {
        headers: {
          Authorization: accessToken,
        },
        withCredentials: true,
      });
  
      // Clear the access token from storage
      localStorage.removeItem('accessToken');
  
      setCurrentUser(null);
  
      // Handle successful logout
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};