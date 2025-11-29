import { button } from "motion/react-m";
import { heroSlides } from "../constants";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useCooldown from "./utils/useCooldown";

const Dots = ({ sliderIndex, setSliderIndex }) => {
  const { canNavigateRef, triggerCooldown } = useCooldown();

  //Left/Right button function - 0-left 1-right
  const onButtonClick = (direction) => {
    if (!canNavigateRef.current) return;
    setSliderIndex((prev) => {
      if (direction === 1 && prev < heroSlides.length - 1) {
        triggerCooldown();
        return prev + 1;
      }
      if (direction === 0 && prev > 0) {
        triggerCooldown();
        return prev - 1;
      }
      return prev;
    });
  };

  return (
    <nav
      aria-label="Swiper navigation"
      aria-controls="Swiper"
      className="flex flex-row w-full justify-center items-center gap-4"
    >
      <button
        onClick={() => onButtonClick(0)}
        aria-label="Previous slide"
        className="btn btn-ghost text-white hover:text-black opacity-100"
      >
        <FiChevronLeft aria-hidden="true" className="w-6 h-6" />
      </button>
      {/* Dots, move to index on click */}
      <div
        role="radiogroup"
        aria-label="Select slide"
        className="flex flex-row gap-3"
      >
        {heroSlides.map((_, index) => {
          return (
            <button
              key={index}
              aria-checked={sliderIndex === index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                if (!canNavigateRef.current) return;
                triggerCooldown();
                setSliderIndex(index);
              }}
              className={`h-4 w-4 cursor-pointer rounded-full transition-colors ${
                index === sliderIndex
                  ? "bg-neutral-50 scale-125"
                  : "bg-neutral-500 scale-90"
              }`}
            />
          );
        })}
      </div>
      <button
        onClick={() => onButtonClick(1)}
        aria-label="Next slide"
        className="btn btn-ghost text-white hover:text-black"
      >
        <FiChevronRight aria-hidden="true" className="w-6 h-6" />
      </button>
    </nav>
  );
};
export default Dots;
