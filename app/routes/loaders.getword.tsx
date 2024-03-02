import { LoaderFunctionArgs, json } from "@remix-run/node";
import { generate } from "random-words";
import { sessionCookie } from "~/cookies.server";
import getWordMeaning from "~/lib/getWordMeaning";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = (await sessionCookie.parse(request.headers.get("Cookie"))) || {};
  const refresh = new URL(request.url).searchParams.get("refresh") === "true";
  const requestPastWord = new URL(request.url).searchParams.get("requestPastWord") === "true";

  let word = cookie.word;
  const pastWord = cookie.word ?? "";
  if (refresh) word = undefined;

  if (!word) {
    word = generate({ minLength: 3, maxLength: 7 });
    cookie.word = word;
  }

  let meaning: string | undefined = undefined;
  while (!meaning) {
    meaning = await getWordMeaning(word);
  }

  const firstLetter = word.charAt(0);

  return json(
    { meaning, firstLetter, pastWord: refresh && requestPastWord ? pastWord : "" },
    { headers: { "Set-Cookie": await sessionCookie.serialize(cookie) } }
  );
}
