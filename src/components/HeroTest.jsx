import { heroSlides } from "../constants";
import { animate, motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroTest = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);
  const targetRef = useRef(null);
  const snapPoints = [0, 0.5, 1];

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.67%"]);
  const bgParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const textParallax = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  //Slide update function + animation duration and easing

  const goToSlide = (i) => {
    const clamped = Math.max(0, Math.min(i, snapPoints.length - 1));
    indexRef.current = clamped;
    setCurrentIndex(clamped);

    animate(scrollYProgress, snapPoints[clamped], {
      duration: 0.55,
      ease: "easeOut",
    });
  };

  // Mobile swipe navigation logic, Hold middle click and move logic not available, too complicated

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let cooldown = false;

    const onWheel = (e) => {
      e.preventDefault();

      if (cooldown) return;
      cooldown = true;
      setTimeout(() => (cooldown = false), 450);

      if (e.deltaY > 0) goToSlide(indexRef.current + 1);
      else goToSlide(indexRef.current - 1);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Mobile swipe navigation logic

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    let startY = 0;
    let endY = 0;

    const onTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
      endY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      const diff = startY - endY;

      if (Math.abs(diff) < 30) return; // ignore small motions

      if (diff > 0) {
        // swipe up → scroll down → next slide
        goToSlide(indexRef.current + 1);
      } else {
        // swipe down → scroll up → previous
        goToSlide(indexRef.current - 1);
      }
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // Keyboard nav for accessibility

  useEffect(() => {
    const onKey = (e) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          goToSlide(indexRef.current + 1);
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          goToSlide(indexRef.current - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main ref={targetRef} className="relative w-full bg-amber-500">
      {/* Container holding swiper - overflow hidden important */}
      <div className="sticky top-0 h-dvh flex items-center overflow-hidden bg-red-500">
        <motion.div style={{ x }} className="flex h-dvh bg-blue-700">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="relative flex flex-col justify-center items-center w-screen h-full shrink-0 bg-green-600"
            >
              <motion.img
                src={slide.image}
                alt={slide.alt}
                className="absolute h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-b from-yellow-900/40 to-yellow-900/20"></div>
              <motion.div
                style={{ x: textParallax }}
                className="content flex flex-col gap-1 z-50"
              >
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
              </motion.div>
            </div>
          ))}
        </motion.div>
        <div className="absolute bottom-[2dvh] left-0 right-0 mx-auto z-60">
          <div className="join content flex flex-row justify-between w-full">
            <button
              className={`join-item btn rounded-full ${
                currentIndex === 0 ? "btn-disabled" : ""
              }`}
              onClick={() => goToSlide(indexRef.current - 1)}
            >
              <FiChevronLeft className="w-6 h-6"></FiChevronLeft>
            </button>
            <div className="flex flex-row gap-4 items-center pointer-events-auto">
              {snapPoints.map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{
                    scale: 1.2,
                    duration: 0.2,
                  }}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`
        w-3 h-3 rounded-full transition-all cursor-pointer
        ${currentIndex === i ? "bg-white scale-140 scale-x-150" : "bg-white/40"}
      `}
                ></motion.button>
              ))}
            </div>

            <button
              className={`join-item btn rounded-full ${
                currentIndex === snapPoints.length - 1 ? "btn-disabled" : ""
              }`}
              onClick={() => goToSlide(indexRef.current + 1)}
            >
              <FiChevronRight className="w-6 h-6"></FiChevronRight>
            </button>
          </div>
        </div>
      </div>
      {/* <div className="w-full h-dvh snap-start"></div>
      <div className="w-full h-dvh snap-start"></div> */}
    </main>
  );
};
export default HeroTest;
