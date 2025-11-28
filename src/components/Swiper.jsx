import { useEffect, useRef, useState } from "react";
import { heroSlides } from "../constants";
import { motion, useMotionValue, useTransform } from "motion/react";
import Dots from "./Dots";
import { FiChevronRight } from "react-icons/fi";
import { useIsMobile } from "./utils/useIsMobile";

//Setting Drag buffer, If scrolled below this threshold, do nothing, smaller on mobile

const DRAG_BUFFER = 100;
const DRAG_BUFFER_MOBILE = 30;

// Only spring keeps the position on drag, dont know why, but it works, tween resets to default position of slide

const SPRING_OPTIONS = {
  type: "spring",
  mass: 5,
  stiffness: 372,
  damping: 100,
};

const Swiper = () => {
  const [isDragging, setIsDragging] = useState(false);

  const [sliderIndex, setSliderIndex] = useState(0); //SliderIndex logic, powers whole slider animation and parallax
  const isMobile = useIsMobile();

  const dragBuffer = isMobile ? DRAG_BUFFER_MOBILE : DRAG_BUFFER;

  //Drag translate X
  const dragX = useMotionValue(0);
  const bgX = useTransform(dragX, (x) => x * -0.8);

  // Lock on Scroll and Keyboard nav, to prevent fast scrolls
  const canNavigateRef = useRef(true);
  const triggerCooldown = () => {
    canNavigateRef.current = false;
    setTimeout(() => (canNavigateRef.current = true), 800);
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  // Change sliderIndex on drag
  const onDragEnd = () => {
    setIsDragging(false);
    const x = dragX.get();
    if (x <= -dragBuffer && sliderIndex < heroSlides.length - 1) {
      triggerCooldown();
      setSliderIndex((prev) => prev + 1);
    } else if (x >= dragBuffer && sliderIndex > 0) {
      triggerCooldown();
      setSliderIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (!canNavigateRef.current) return;
      setSliderIndex((prev) => {
        switch (e.key) {
          case "ArrowDown":
          case "ArrowRight":
          case "PageDown":
            if (prev < heroSlides.length - 1) {
              triggerCooldown();
              return prev + 1;
            }
            break;
          case "ArrowUp":
          case "ArrowLeft":
          case "PageUp":
            if (prev > 0) {
              triggerCooldown();
              return prev - 1;
            }
            break;
        }
        return prev;
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
      if (!canNavigateRef.current) return;
      e.preventDefault();
      queuedDirection += e.deltaY > 0 ? 1 : -1;

      // If we’re already waiting for the next frame, do nothing
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setSliderIndex((prev) => {
          if (queuedDirection > 0 && prev < heroSlides.length - 1) {
            triggerCooldown();
            return prev + 1;
          }
          if (queuedDirection < 0 && prev > 0) {
            triggerCooldown();
            return prev - 1;
          }
          return prev;
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
    <main className="relative overflow-hidden min-h-dvh">
      {/* Slider Container*/}
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
        className="flex flex-row cursor-grab active:cursor-grabbing bg-blue-400 w-screen h-dvh"
      >
        {heroSlides.map((slide, index) => (
          // Slide container
          <div
            key={index}
            className="relative w-screen shrink-0 h-full overflow-hidden flex flex-col justify-center bg-amber-400 "
          >
            {/* Slide Image container */}
            <motion.div
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              style={{
                x: bgX,
              }}
              animate={{
                translateX: `${(index - sliderIndex) * -100 * 0.8}%`,
              }}
              transition={SPRING_OPTIONS}
            >
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-full object-cover pointer-events-none "
              />
            </motion.div>

            {/* Slide Text container */}
            <div className="content flex flex-col gap-1 z-50">
              <span className="font-sans font-light text-4xl landscape:text-2xl lg:landscape:text-4xl text-white">
                {slide.heading}
              </span>
              <h1 className="font-sans text-8xl landscape:text-6xl lg:landscape:text-8xl mb-2 font-light text-white uppercase">
                {slide.name}
              </h1>
              <p className="text-white landscape:text-sm lg:landscape:text-base md:max-w-1/2">
                {slide.subheading}
              </p>
              <a
                href={slide.path}
                className="relative group mt-2 w-fit text-white uppercase font-bold text-2xl overflow-hidden"
              >
                <span className="flex items-center gap-2">
                  <span className="relative landscape:text-base lg:landscape:text-xl">
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
      {/* Dots Pagination on bottom of screen */}
      <div className="absolute bottom-[3vh] left-0 right-0 mx-auto content">
        <Dots sliderIndex={sliderIndex} setSliderIndex={setSliderIndex}></Dots>
      </div>
      {isMobile && (
        <div className="absolute inset-0 bg-amber-950/20 pointer-events-none" />
      )}
    </main>
  );
};
export default Swiper;
