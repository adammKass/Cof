import { heroSlides } from "../constants";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

//Not used at the moment

const Hero = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${100 * (heroSlides.length - 1)}%`]
  );

  return (
    <main
      ref={targetRef}
      className="relative w-full h-[300dvh] overflow-hidden"
    >
      <motion.div
        style={{ x, scrollSnapType: "x mandatory" }}
        className="sticky top-0 h-dvh flex flex-row snap-x snap-mandatory"
      >
        {heroSlides.map((slide, index) => (
          <div key={index} className="relative w-screen h-full shrink-0">
            <img
              src={slide.image}
              alt={slide.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/40 to-transparent"></div>
            <div className="content relative bottom-1/2 flex flex-col gap-1">
              <span className="font-sans font-light text-4xl text-white">
                {slide.heading}
              </span>
              <h1 className="font-sans text-8xl mb-2 font-light text-white uppercase">
                {slide.name}
              </h1>
              <p className="text-white lg:max-w-1/2">{slide.subheading}</p>
              <a href={slide.path} className="btn btn-accent mt-4 w-fit">
                {slide.button}
              </a>
            </div>
          </div>
        ))}
      </motion.div>
    </main>
  );
};
export default Hero;
