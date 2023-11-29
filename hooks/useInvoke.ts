"use client";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

function useInvoke<T>(command: string, def: any = null, immediate = false) {
  const [loading, setLoading] = useState(false);
  const [firstFetchDone, setFirstFetchDone] = useState(false);
  const [data, setData] = useState<T>(def);
  const [error, setError] = useState<any | null>(null);
  const handle = useCallback(
    (data = {}) => {
      return new Promise<T>((res, rej) => {
        setLoading(true);
        setError(null);
        invoke<T>(command, data)
          .then((data) => {
            setData(data);
            return res(data);
          })
          .catch((err) => {
            toast(err);
            setError(err);
            return rej(err);
          })
          .finally(() => {
            setLoading(false);
            setFirstFetchDone(true);
          });
      });
    },
    [command]
  );

  useEffect(() => {
    if (immediate) handle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    loading,
    handle,
    error,
    firstFetchDone,
  };
}

export default useInvoke;
