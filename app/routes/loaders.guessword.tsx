import { LoaderFunctionArgs, json } from "@remix-run/node";
import { sessionCookie } from "~/cookies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookie = (await sessionCookie.parse(request.headers.get("Cookie"))) || {};
  const guess = new URL(request.url).searchParams.get("guess");
  const correct = cookie.word === guess;

  if (correct) {
    const score = cookie.score;
    if (!score || isNaN(parseInt(score))) {
      cookie.score = 1;
    } else {
      cookie.score = parseInt(cookie.score) + 1;
    }
  }
  return json(
    { guessCorrect: correct, guessId: Math.floor(Math.random() * 9999999) },
    { headers: { "Set-Cookie": await sessionCookie.serialize(cookie) } }
  );
}
