export class WordReducer {
  public words: { [key: string]: number } = {};

  addWord(word: string) {
    if (Object.keys(this.words).includes(word)) {
      this.words[word]++;
    } else {
      this.words[word] = 1;
    }
  }
}

export function processContent(content: string, wordReducer: WordReducer) {
  const paragraphs = content.split(`\n`);

  for (const paragraph of paragraphs) {
    processParagraph(paragraph, wordReducer);
  }
}

export function processParagraph(paragraph: string, wordReducer: WordReducer) {
  const sentences = paragraph.split(".");

  for (const sentence of sentences) {
    processSentence(sentence.trim(), wordReducer);
  }
}

export function processSentence(sentence: string, wordReducer: WordReducer) {
  const words = sentence.split(" ");

  for (const word of words) {
    const cleanedWord = processWord(word);

    if (cleanedWord) {
      wordReducer.addWord(cleanedWord);
    }
  }
}

/**
 * Processing a word from a sentence.
 *
 * 1. Remove any white spaces.
 * 2. Clear the word from special chars - ', ", ',", ! etc. etc
 * 3. Remove any number.
 * 4. Remove reference letters.
 * @param word
 */
export function processWord(word: string): string {
  const allowedCharsFormat = /[^א-ת]*/gm;
  return word.trim().replaceAll(allowedCharsFormat, "");
}
