import { motion } from "framer-motion";

import { tabTransition } from "../utils/animation-variants";

type TabSliderProps = {
  selectedTab: string;
  tabs: string[];
};

/**
 * A component that renders an animated slider for tabs
 * The slider moves to the position of the selected tab
 */
export function TabSlider({ selectedTab, tabs }: TabSliderProps) {
  // Calculate the position of the slider based on the selected tab
  const getPosition = () => {
    const index = tabs.indexOf(selectedTab);
    if (index === -1)
      return 0;
    return `${index * 100}%`;
  };

  return (
    <motion.div
      className="absolute h-full bg-muted rounded-md z-0"
      initial={false}
      animate={{
        x: getPosition(),
        width: `${100 / tabs.length}%`,
      }}
      transition={tabTransition}
    />
  );
}
