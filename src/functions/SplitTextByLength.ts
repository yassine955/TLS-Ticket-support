import { splitLines } from "./SplitLines";

export const splitTextByLength = async (text, limit) => {
  const textLines = splitLines(text);
  let posts = [];
  for (let i = 0; i < textLines.length; i++) {
    if (textLines[i].length > limit) {
      for (let j = 0; j < textLines[i].length; j += limit) {
        posts.push(textLines[i].substring(j, j + limit) + " ");
      }
    } else if (posts[0] == null) {
      posts[0] = textLines[i] + " ";
    } else if (textLines[i].length + posts[posts.length - 1].length < limit) {
      posts[posts.length - 1] += textLines[i] + " ";
    } else {
      posts.push(textLines[i] + " ");
    }
  }
  return posts;
};
