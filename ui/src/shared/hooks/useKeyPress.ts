import { useEffect } from "react";

type TCallbackMap = {
  [key: string]: (e: KeyboardEvent) => void;
};

export default function useKeyPress(callbacks: TCallbackMap) {
  const handleKeydown = (e: KeyboardEvent) => callbacks[e.code]?.(e);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  });
}
