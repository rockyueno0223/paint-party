import { createContext, useContext } from 'react';
import { IUser } from '@/types/user';

interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within an UserProvider');
  }
  return context;
};
