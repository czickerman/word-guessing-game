import { useState } from "react";
import { TypeAnimation } from "react-type-animation";

interface WebsiteIntroProps {
  setShowMainContent: React.Dispatch<React.SetStateAction<boolean>>;
  showMainContent: boolean;
  score: number;
}

export default function WebsiteIntro({ setShowMainContent, showMainContent, score }: WebsiteIntroProps) {
  const [animateClass, setAnimateClass] = useState("");

  const handleFinish = () => {
    setShowMainContent(true);
    setAnimateClass("animateIntro");
  };

  return (
    <div
      className={`text-yellow-300 text-xl md:text-3xl lg:text-5xl font-vt323 absolute flex flex-col ${animateClass}`}
    >
      <TypeAnimation
        sequence={["Now presenting...", 600, "The word guessing game", () => handleFinish()]}
      ></TypeAnimation>
      {showMainContent && (
        <h3 className="text-white text-sm text-center animateMainContent">Lifetime score: {score}</h3>
      )}
    </div>
  );
}
