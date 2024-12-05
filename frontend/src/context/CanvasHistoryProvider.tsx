import React, { useEffect, useState } from 'react';
import { CanvasHistoryContext } from '@/context/CanvasHistoryContext';
import { ICanvas } from '@/types/canvas';

export const CanvasHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canvasHistory, setCanvasHistory] = useState<ICanvas[] | null>(() => {
    const savedCanvasHistory = sessionStorage.getItem('canvasHistory');
    return savedCanvasHistory ? JSON.parse(savedCanvasHistory) : null;
  });

  useEffect(() => {
    if (canvasHistory) {
      sessionStorage.setItem('canvasHistory', JSON.stringify(canvasHistory));
    } else {
      sessionStorage.removeItem('canvasHistory');
    }
  }, [canvasHistory])

  return (
    <CanvasHistoryContext.Provider value={{ canvasHistory, setCanvasHistory }}>
      {children}
    </CanvasHistoryContext.Provider>
  );
};
