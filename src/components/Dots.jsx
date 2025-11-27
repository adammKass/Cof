import { button } from "motion/react-m";
import { heroSlides } from "../constants";

const Dots = ({ sliderIndex, setSliderIndex }) => {
  return (
    <div className="flex flex-row w-full justify-center gap-4">
      {heroSlides.map((_, index) => {
        return (
          <button
            key={index}
            onClick={() => setSliderIndex(index)}
            className={`h-4 w-4 cursor-pointer rounded-full transition-colors ${
              index === sliderIndex ? "bg-neutral-50" : "bg-neutral-500"
            }`}
          />
        );
      })}
    </div>
  );
};
export default Dots;
