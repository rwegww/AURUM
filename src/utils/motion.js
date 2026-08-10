// Shared presets for content reveals. Keep stagger short on dense lesson grids.
export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

export const revealGroup = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.055, delayChildren: 0.035 } },
};

export const dialogMotion = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.99, transition: { duration: 0.16 } },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
};
