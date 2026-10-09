import { useState, useEffect } from "react";

export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode); keep in-memory state.
    }
  }, [key, state]);

  return [state, setState];
}

