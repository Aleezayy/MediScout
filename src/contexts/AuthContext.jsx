import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const USERS_STORAGE_KEY = 'mediscout_users';
  const CURRENT_USER_STORAGE_KEY = 'mediscout_currentUser';

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const getUsers = () => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = (username, password) => {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      toast({ title: "Login Successful", description: `Welcome back, ${user.name}!` });
      return true;
    }
    toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    return false;
  };

  const register = (userData) => {
    const users = getUsers();
    if (users.find(u => u.username === userData.username)) {
      toast({ title: "Registration Failed", description: "Username already exists.", variant: "destructive" });
      return false;
    }
    const newUser = { ...userData, id: `user_${Date.now()}`, healthRecords: [] };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    toast({ title: "Registration Successful", description: `Welcome, ${newUser.name}!` });
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };
  
  const updateUserRecords = (userId, newRecord) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        healthRecords: [...(users[userIndex].healthRecords || []), newRecord]
      };
      users[userIndex] = updatedUser;
      saveUsers(users);
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }
      return true;
    }
    return false;
  };


  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    updateUserRecords,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};