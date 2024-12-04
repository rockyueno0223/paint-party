import React, { useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { IUser } from '@/types/user';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
