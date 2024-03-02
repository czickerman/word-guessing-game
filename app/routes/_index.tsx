/* eslint-disable react-hooks/exhaustive-deps */
import { type MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import WebsiteIntro from "~/components/WebsiteIntro";
import { loader as guessWord } from "./loaders.guessword";
import { loader as getWord } from "./loaders.getword";
import GuessForm from "~/components/GuessForm";
import { useToast } from "~/components/ui/use-toast";
import { useLocalStorage } from "~/hooks/useLocalStorage";

export const meta: MetaFunction = () => {
  return [
    { title: "Word guessing game" },
    { name: "description", content: "A game that let's you guess randomized words" },
  ];
};

export default function Index() {
  const { toast } = useToast();

  const [showMainContent, setShowMainContent] = useState(false);
  const [showFirstLetter, setShowFirstLetter] = useState(false);

  const guessFetcher = useFetcher<typeof guessWord>();
  const wordFetcher = useFetcher<typeof getWord>();

  const [score, setScore] = useLocalStorage("score", "0");

  useEffect(() => {
    wordFetcher.load("/loaders/getword");
  }, []);

  useEffect(() => {
    const correct = guessFetcher.data?.guessCorrect === true;
    if (correct) {
      wordFetcher.load("/loaders/getword?refresh=true");
      setScore((s) => (s && !isNaN(parseInt(s)) ? (parseInt(s) + 1).toString() : "0"));
      setShowFirstLetter(false);
    } else setShowFirstLetter(true);

    toast({
      title: correct ? "Good job" : "Try again",
      description: correct ? "You guessed it correctly" : "Incorrect word",
      variant: correct ? "default" : "destructive",
    });
  }, [guessFetcher.data?.guessId]);

  useEffect(() => {
    const pastWord = wordFetcher.data?.pastWord;
    setShowFirstLetter(false);

    if (pastWord && pastWord !== "")
      toast({
        title: "Refreshing word",
        description: `It was ${pastWord}`,
        variant: "default",
      });
  }, [wordFetcher.data?.pastWord]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <WebsiteIntro setShowMainContent={setShowMainContent} showMainContent={showMainContent} score={score ?? "0"} />
      <div className="opacity-1 animateMainContent">
        {showMainContent && (
          <div>
            <div className="text-xl md:text-3xl flex flex-col items-start">
              <h1 className="max-w-[75vw] md:max-w-[50vw]">Hint: {wordFetcher.data?.meaning ?? "Loading"}</h1>
              {showFirstLetter && <h1>First Letter: {wordFetcher.data?.firstLetter ?? "Loading"}</h1>}
              <GuessForm guessFetcher={guessFetcher} wordFetcher={wordFetcher} />
            </div>
            <a
              className="hover:underline transition-all fixed bottom-0 left-0 ml-1"
              href="https://github.com/czickerman/word-guessing-game"
            >
              View Github
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
