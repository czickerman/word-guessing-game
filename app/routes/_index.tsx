/* eslint-disable react-hooks/exhaustive-deps */
import { type MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import WebsiteIntro from "~/components/WebsiteIntro";
import { loader as guessWord } from "./loaders.guessword";
import { loader as getWord } from "./loaders.getword";
import GuessForm from "~/components/GuessForm";
import { useToast } from "~/components/ui/use-toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Word guessing game" },
    { name: "description", content: "A game that let's you guess randomized words" },
  ];
};

export default function Index() {
  const { toast } = useToast();

  const [showMainContent, setShowMainContent] = useState(false);

  const guessFetcher = useFetcher<typeof guessWord>();
  const wordFetcher = useFetcher<typeof getWord>();

  useEffect(() => {
    wordFetcher.load("/loaders/getword");
  }, []);

  useEffect(() => {
    const correct = guessFetcher.data?.guessCorrect === true;
    if (correct) wordFetcher.load("/loaders/getword?refresh=true");

    toast({
      title: correct ? "Good job" : "Try again",
      description: correct ? "You guessed it correctly" : "Incorrect word",
      variant: correct ? "default" : "destructive",
    });
  }, [guessFetcher.data?.guessId]);

  useEffect(() => {
    const pastWord = wordFetcher.data?.pastWord;
    if (pastWord && pastWord !== "")
      toast({
        title: "Refreshing word",
        description: `It was ${pastWord}`,
        variant: "default",
      });
  }, [wordFetcher.data?.pastWord]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <WebsiteIntro
        setShowMainContent={setShowMainContent}
        showMainContent={showMainContent}
        score={wordFetcher.data?.score}
      />
      <div className="opacity-1 animateMainContent">
        {showMainContent && (
          <>
            <div className="text-3xl flex flex-col items-start">
              <h1 className="max-w-[75vh]">Hint: {wordFetcher.data?.meaning ?? "Loading"}</h1>
              <h1>First Letter: {wordFetcher.data?.firstLetter ?? "Loading"}</h1>
              <GuessForm guessFetcher={guessFetcher} wordFetcher={wordFetcher} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
