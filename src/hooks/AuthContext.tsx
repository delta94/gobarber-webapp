import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../data/api';
import { AuthDTO, UserDTO } from '../data/models/AuthDTO';
import { USER_INFO, TOKEN } from '../data/auth/authStorageConstants';
import { getStorageItem, setStorageItem } from '../utils/storage';

interface Auth {
  user: UserDTO;
  token: string;
}

interface AuthContextData {
  auth: Auth;
  signIn(email: string, password: string): Promise<Auth>;
}

const defaultValue = {} as AuthContextData;

const AuthContext = createContext(defaultValue);

const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC = (props: any): JSX.Element => {
  const [auth, setAuth] = useState<Auth>(() => {
    const user = getStorageItem<UserDTO>(USER_INFO);
    const token = getStorageItem<string>(TOKEN);
    if (user && token) {
      return { user, token };
    }
    return {} as Auth;
  });
  const signIn = useCallback(async (email: string, password: string) => {
    const response = await api.post<AuthDTO>('/sessions', {
      email,
      password,
    });
    const { data } = response;
    setAuth({
      user: data.user,
      token: data.token,
    });
    setStorageItem(TOKEN, data.token);
    setStorageItem(USER_INFO, data.user);
  }, []);
  return <AuthContext.Provider value={{ auth, signIn }} {...props} />;
};

export default {
  useAuth,
  AuthProvider,
};
