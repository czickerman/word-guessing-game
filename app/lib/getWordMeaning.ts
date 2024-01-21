import axios from "axios";

export default async (word: string): Promise<string | undefined> => {
  return new Promise((resolve) => {
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((response) => {
      const meaning = response.data[0].meanings[0].definitions[0].definition;
      resolve(meaning ?? undefined);
    });
  });
};
