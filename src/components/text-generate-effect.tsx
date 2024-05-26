import React, { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "../cn";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          const isBreakAfter = word === "beans,"; // Check if the word is 'beans,' to insert a break after
          return (
            <React.Fragment key={idx}>
              <motion.span
                className="dark:text-white text-center text-white mb-4 text-4xl opacity-0 uppercase font-semibold leading-[50px]"
              >
                {word}{" "}
              </motion.span>
              {isBreakAfter && <br />} {/* Conditionally render a line break */}
            </React.Fragment>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};