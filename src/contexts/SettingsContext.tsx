import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getLocalStorageItem, setLocalStorageItem, localStorageKeys } from '../utils/localStorage';

type Unit = 'metric' | 'imperial';

type SettingsContextType = {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

type StoredSettings = {
  unit: Unit;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Load settings from localStorage on mount
  const storedSettings = getLocalStorageItem<StoredSettings>(localStorageKeys.settings, {
    unit: 'metric',
  });

  const [unit, setUnitState] = useState<Unit>(storedSettings.unit);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    setLocalStorageItem<StoredSettings>(localStorageKeys.settings, {
      unit,
    });
  }, [unit]);

  const setUnit = (newUnit: Unit) => {
    setUnitState(newUnit);
  };

  return (
    <SettingsContext.Provider
      value={{
        unit,
        setUnit,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

