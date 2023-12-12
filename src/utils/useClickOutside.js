import { useRef, useEffect } from "react";

export const useClickOutside = (callback) => {
  const domNode = useRef();

  useEffect(() => {
    const handler = (e) => {
      const portalNode = document.querySelector("#portals");
      if (
        !domNode.current.contains(e.target) &&
        !portalNode.contains(e.target)
      ) {
        callback();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return domNode;
};
