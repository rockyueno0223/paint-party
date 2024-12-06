import { createContext, useContext } from 'react';
import {ICanvas } from '@/types/canvas';

interface CanvasHistoryContextType {
  canvasHistory: ICanvas[] | null;
  setCanvasHistory: React.Dispatch<React.SetStateAction<ICanvas[] | null>>;
}

export const CanvasHistoryContext = createContext<CanvasHistoryContextType | undefined>(undefined);

export const useCanvasHistoryContext = () => {
  const context = useContext(CanvasHistoryContext);
  if (!context) {
    throw new Error('useCanvasHistoryContext must be used within an CanvasHistoryProvider');
  }
  return context;
};
