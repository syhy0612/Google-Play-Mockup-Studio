import React, { createContext, useContext, useEffect, useState } from 'react';

export type ViewState = 'discovery' | 'search' | 'details';
export type OverlayKind = 'settings' | 'lightbox' | null;

export interface HistoryState {
  view: ViewState;
  overlay: OverlayKind;
}

const INITIAL: HistoryState = { view: 'discovery', overlay: null };

interface ContextValue {
  state: HistoryState;
  push: (next: Partial<HistoryState>) => void;
  back: () => void;
}

const HistoryStateContext = createContext<ContextValue | null>(null);

export const HistoryStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HistoryState>(INITIAL);

  useEffect(() => {
    history.replaceState(INITIAL, '');
    setState(INITIAL);

    const onPop = (e: PopStateEvent) => {
      setState((e.state as HistoryState | null) ?? INITIAL);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const push = (next: Partial<HistoryState>) => {
    setState((prev) => {
      const merged: HistoryState = { ...prev, ...next };
      history.pushState(merged, '');
      return merged;
    });
  };

  const back = () => history.back();

  return (
    <HistoryStateContext.Provider value={{ state, push, back }}>
      {children}
    </HistoryStateContext.Provider>
  );
};

export const useHistoryState = (): ContextValue => {
  const ctx = useContext(HistoryStateContext);
  if (!ctx) throw new Error('useHistoryState must be used inside HistoryStateProvider');
  return ctx;
};

export const readHistoryState = (): HistoryState =>
  (history.state as HistoryState | null) ?? INITIAL;
