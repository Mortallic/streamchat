export const EMOTES = {
  ':pepega:': '/emotes/pepega.png',
  ':pogchamp:': '/emotes/pogchamp.png',
  ':widehardo:': '/emotes/widehardo.png',
  ':pog:': '/emotes/pog.png',
  ':OMEGALUL:': '/emotes/OMEGALUL.png',
};

// Helper function to parse message content
export const parseMessage = (content) => {
  const words = content.split(' ');
  return words.map((word, index) => {
    if (EMOTES[word]) {
      return {
        type: 'emote',
        content: EMOTES[word],
        code: word,
        key: index
      };
    }
    return {
      type: 'text',
      content: word + ' ',
      key: index
    };
  });
};