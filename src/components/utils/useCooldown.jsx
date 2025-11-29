import { useRef } from "react";

//Hook for cooldown, needed so slides cant be scrolled too fast - parallax problems

export default function useCooldown(delay = 800) {
  const canNavigateRef = useRef(true);

  const triggerCooldown = () => {
    canNavigateRef.current = false;
    setTimeout(() => (canNavigateRef.current = true), delay);
  };

  return { canNavigateRef, triggerCooldown };
}
