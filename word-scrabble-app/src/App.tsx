import React, { useState } from "react";
import { Letter } from "./types";
import "./App.css";

const App = () => {
  const [tiles, setTiles] = useState(Array(10).fill(""));
  const [totalScore, setTotalScore] = useState(0);

  // The function to calculate the score for each letter based on the rules
  const calculateScore = (letter: Letter): number => {
    const letterScores: Record<string, number> = {
      A: 1,
      E: 1,
      I: 1,
      O: 1,
      U: 1,
      L: 1,
      N: 1,
      S: 1,
      T: 1,
      R: 1,
      D: 2,
      G: 2,
      B: 3,
      C: 3,
      M: 3,
      P: 3,
      F: 4,
      H: 4,
      V: 4,
      W: 4,
      Y: 4,
      K: 6,
      J: 8,
      X: 8,
      Q: 10,
      Z: 10,
    };

    return letterScores[letter.toUpperCase()] || 0;
  };

  // Event handler for when the user types in a letter
  const handleTileChange = (index: number, letter: Letter) => {
    const newTiles = [...tiles];
    newTiles[index] = letter;
    setTiles(newTiles);

    // Calculate the total score in real-time
    const newTotalScore = newTiles.reduce(
      (acc, cur) => acc + calculateScore(cur),
      0
    );
    setTotalScore(newTotalScore);
  };

  // Event handler for resetting the tiles
  const handleResetTiles = () => {
    setTiles(Array(10).fill(""));
    setTotalScore(0);
  };

  // Event handler for saving the score to the backend
  const handleSaveScore = () => {
    // api to save score
  };

  // Event handler for retrieving the Top Scores from the backend
  const handleTopScore = () => {
    // api to get top scores
  };

  return (
    <div className="game-board">
      <div className="tiles-container">
        {tiles.map((letter, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={letter}
            onChange={(e) => handleTileChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="total-score">Total Score: {totalScore}</div>

      <div className="menu-container">
        <button onClick={handleResetTiles}>Reset Tiles</button>
        <button onClick={handleSaveScore}>Save Score</button>
        <button onClick={handleTopScore}>Save Score</button>
      </div>
    </div>
  );
};

export default App;
