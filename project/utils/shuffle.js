/**
 * Fisher-Yates shuffle algorithm for randomizing an array
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
function fisherYatesShuffle(array) {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    // Pick a remaining element
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Swap it with the current element
    [shuffled[currentIndex], shuffled[randomIndex]] = 
    [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
}

module.exports = { fisherYatesShuffle };