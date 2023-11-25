"use client";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useState } from "react";

function useInvoke<T>(command: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null);
  const handle = useCallback(
    (data = {}) => {
      return new Promise((res, rej) => {
        setLoading(true);
        setError(null);
        invoke<T>(command, data)
          .then((data) => {
            setData(data);
            res(data);
          })
          .catch((err) => {
            setError(err);
            rej(err);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    },
    [command]
  );

  return {
    data,
    loading,
    handle,
    error,
  };
}

export default useInvoke;
