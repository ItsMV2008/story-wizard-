import React, { createContext, useContext, ReactNode, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { User } from '../types';

// Extend User to include password for storage, but don't expose it in the context's `user` object.
type StoredUser = User & { passwordHash: string };

interface AuthContextType {
  user: User | null;
  error: string | null;
  login: (credentials: Pick<User, 'email'> & { password: string }) => void;
  logout: () => void;
  signup: (userData: Omit<User, 'id'> & { password: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('storywizard-user', null);
  const [storedUsers, setStoredUsers] = useLocalStorage<StoredUser[]>('storywizard-users', []);
  const [error, setError] = useState<string | null>(null);

  const login = (credentials: Pick<User, 'email'> & { password: string }) => {
    setError(null);
    const foundUser = storedUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    // Using btoa as a simple, reversible "hash" for this simulation.
    if (foundUser && foundUser.passwordHash === btoa(credentials.password)) {
      const { passwordHash, ...userToExpose } = foundUser;
      setUser(userToExpose);
    } else {
      setError('Invalid email or password.');
    }
  };

  const signup = (userData: Omit<User, 'id'> & { password: string }) => {
    setError(null);
    const existingUser = storedUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (existingUser) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser: StoredUser = {
      id: btoa(userData.email),
      email: userData.email,
      name: userData.name || '',
      passwordHash: btoa(userData.password),
    };

    setStoredUsers([...storedUsers, newUser]);
    
    const { passwordHash, ...userToExpose } = newUser;
    setUser(userToExpose);
  }

  const logout = () => {
    setUser(null);
  };

  const value = { user, login, logout, signup, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
