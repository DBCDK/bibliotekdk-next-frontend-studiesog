import { useEffect, useRef, useState } from "react";

export default function useElementVisible(options) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  function handleIntersection(entries) {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
    if (!hasBeenSeen && entry.isIntersecting) {
      setHasBeenSeen(true);
    }
  }

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      handleIntersection,
      options
    );
    if (elementRef.current) {
      intersectionObserver.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        intersectionObserver.unobserve(elementRef.current);
      }
    };
  }, [elementRef]);

  return { elementRef, isVisible, hasBeenSeen };
}