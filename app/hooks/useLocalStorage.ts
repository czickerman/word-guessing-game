import { useEffect, useState } from "react";

export function useLocalStorage(key: string, defaultValue: string) {
  const [state, setState] = useState<string>(defaultValue);

  useEffect(() => {
    setState(localStorage.getItem(key) ?? defaultValue);
  }, [key, defaultValue]);

  useEffect(() => {
    if (state && state !== defaultValue) localStorage.setItem(key, state);
  }, [state, key, defaultValue]);

  return [state, setState] as const;
}
