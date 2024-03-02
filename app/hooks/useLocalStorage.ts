import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue: string) {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    setState(localStorage.getItem(key) ?? defaultValue);
  }, [key, defaultValue]);

  useEffect(() => {
    if (state) localStorage.setItem(key, state);
  }, [state, key]);

  return [state, setState] as const;
}
