import { useEffect, RefObject } from "react";

export default function useOuterClick(
  ref: RefObject<HTMLElement>,
  callback: () => void,
) {
  const handleClick: EventListener = (e) => {
    if (ref?.current && !ref.current.contains(e?.target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  });
}
