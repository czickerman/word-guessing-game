import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loader as guessWord } from "~/routes/loaders.guessword";
import { loader as getWord } from "~/routes/loaders.getword";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormControl, FormDescription, FormField, FormItem, FormMessage, FormProvider } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface GuessFormProps {
  guessFetcher: FetcherWithComponents<SerializeFrom<typeof guessWord>>;
  wordFetcher: FetcherWithComponents<SerializeFrom<typeof getWord>>;
}

const onlyLetters = new RegExp(/([A-Z])+/i);
const schema = z.object({
  guess: z.string().min(3).max(7).regex(onlyLetters, "Guess must contain only letters and no spaces"),
});

export default function GuessForm({ guessFetcher, wordFetcher }: GuessFormProps) {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { guess: "" } });

  const onSubmit = (values: z.infer<typeof schema>) => guessFetcher.load(`/loaders/guessword?guess=${values.guess}`);
  const onGiveUp = () => wordFetcher.load("loaders/getword?refresh=true&requestPastWord=true");
  const loading = guessFetcher.state != "idle" || wordFetcher.state != "idle";

  return (
    <div className="mt-6">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="guess"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter guess" {...field} />
                </FormControl>
                <FormDescription>Word will be between 3 and 7 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              Submit Guess
            </Button>
            <Button
              type="button"
              variant={"destructive"}
              className="grow"
              disabled={loading}
              onClick={() => onGiveUp()}
            >
              Give up
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
