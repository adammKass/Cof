import { useEffect, useState } from "react";
import { heroSlides } from "../constants";
import { motion, useMotionValue, useTransform } from "motion/react";
import Dots from "./Dots";
import { FiChevronRight } from "react-icons/fi";

const DRAG_BUFFER = 100;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 800,
  damping: 200,
};

const Swiper = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  const dragX = useMotionValue(0);
  const bgX = useTransform(dragX, (x) => x * -0.25);
  const bgScale = useTransform(dragX, [-800, 0, 800], [1.2, 1, 1.2]);

  const onDragStart = () => {
    setIsDragging(true);
  };
  const onDragEnd = () => {
    setIsDragging(false);
    const x = dragX.get();
    if (x <= -DRAG_BUFFER && sliderIndex < heroSlides.length - 1) {
      setSliderIndex((prev) => prev + 1);
    } else if (x >= DRAG_BUFFER && sliderIndex > 0) {
      setSliderIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation

  useEffect(() => {
    const onKey = (e) => {
      setSliderIndex((prev) => {
        switch (e.key) {
          case "ArrowDown":
          case "ArrowRight":
          case "PageDown":
            if (prev < heroSlides.length - 1) {
              return prev + 1;
            }
            break;
          case "ArrowUp":
          case "ArrowLeft":
          case "PageUp":
            if (prev > 0) {
              return prev - 1;
            }
            break;
        }
        return prev; // no change
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Wheel navigation, experiment with requestAnimationFrame

  useEffect(() => {
    let queuedDirection = 0;
    let rafId = null;

    const onWheel = (e) => {
      e.preventDefault();
      queuedDirection += e.deltaY > 0 ? 1 : -1;

      // If we’re already waiting for the next frame, do nothing
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setSliderIndex((prev) => {
          if (queuedDirection > 0 && prev < heroSlides.length - 1) {
            return prev + 1;
          }
          if (queuedDirection < 0 && prev > 0) {
            return prev - 1;
          }
          return prev; // no change (at edge)
        });

        queuedDirection = 0;
        rafId = null;
      });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <main className="relative overflow-hidden min-h-screen">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        animate={{
          translateX: `-${sliderIndex * 100}%`,
        }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={{ x: dragX }}
        transition={SPRING_OPTIONS}
        className="flex flex-row cursor-grab active:cursor-grabbing bg-blue-400 w-screen h-screen"
      >
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="relative w-screen shrink-0 h-full overflow-hidden flex flex-col justify-center bg-amber-400 "
          >
            {/* Image container */}
            <motion.div
              style={{
                x: bgX,
              }}
              className="absolute w-full h-full top-0 scale-150 left-0 will-change-transform bg-red-400"
            >
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-full object-cover pointer-events-none "
              />
            </motion.div>
            {/* Text container */}

            <div className="content flex flex-col gap-1 z-50">
              <span className="font-sans font-light text-4xl text-white">
                {slide.heading}
              </span>
              <h1 className="font-sans text-8xl mb-2 font-light text-white uppercase">
                {slide.name}
              </h1>
              <p className="text-white md:max-w-1/2">{slide.subheading}</p>
              <a
                href={slide.path}
                className="relative group mt-2 w-fit text-white uppercase font-bold text-2xl overflow-hidden"
              >
                <span className="flex items-center gap-2">
                  {/* TEXT */}
                  <span className="relative">
                    {slide.button}

                    {/* Underline that slides out on hover */}
                    <span
                      className="
                        absolute left-0 right-0 bottom-0 h-0.5 bg-current
                        transition-all duration-300
                        group-hover:translate-x-full group-hover:opacity-0
                      "
                    />
                  </span>

                  {/* Arrow circle (hidden before hover) */}
                  <span
                    className="
                      w-8 h-8 rounded-full bg-current flex items-center justify-center
                      opacity-0 -translate-x-1.5
                      transition-all duration-300
                      group-hover:opacity-100 group-hover:translate-x-0
                    "
                  >
                    <FiChevronRight className="w-6 h-6 text-black"></FiChevronRight>
                  </span>
                </span>
              </a>
            </div>
          </div>
        ))}
      </motion.div>
      <div className="absolute bottom-[3vh] left-0 right-0 mx-auto content">
        <Dots sliderIndex={sliderIndex} setSliderIndex={setSliderIndex}></Dots>
      </div>
      <div className="pointer-events-none absolute bottom-0 top-0 left-0 w-[min(60vw,800px)] bg-linear-to-r from-orange-950/50 from-30% to-transparent to-90%" />
    </main>
  );
};
export default Swiper;
