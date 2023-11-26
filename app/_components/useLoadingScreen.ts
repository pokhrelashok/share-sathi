import { useEffect } from "react";

function useLoadingScreen() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = document.getElementById("globalLoader");
      if (loader) loader.remove();
    }
  }, []);
}

export default useLoadingScreen;
