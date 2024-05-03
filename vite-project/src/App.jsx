import { useEffect, useState } from 'react';
import './App.css';

const x = 50;
const y = 50;
const alive = 'rgb(124, 252, 0)';
const dead = 'rgb(0, 0, 0)';
const screenWidth = 600;
const screenHeight = 600;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [custom, setCustom] = useState(false);
  const [customCell, setCustomCell] = useState([]);
  const [selectedCell, setSelectedCell] = useState([]);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  // Initial grid
  useEffect(() => {
    setGrid(initialGrid());
  }, []);

  // Game of Life logic
  useEffect(() => {
    const progress = (prevGrid) => {
      const newGrid = initialGrid();
      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          const neighbors = countNeighbors(prevGrid, i, j);
          if (prevGrid[i][j] === 1) {
            if (neighbors < 2 || neighbors > 3) {
              newGrid[i][j] = 0;
            } else {
              newGrid[i][j] = 1;
            }
          } else {
            if (neighbors === 3) {
              newGrid[i][j] = 1;
            }
          }
        }
      }
      return newGrid;
    };

    const countNeighbors = (grid, i, j) => {
      let count = 0;
      for (let k = i - 1; k <= i + 1; k++) {
        for (let l = j - 1; l <= j + 1; l++) {
          if (k >= 0 && k < x && l >= 0 && l < y && !(k === i && l === j)) {
            count += grid[k][l];
          }
        }
      }
      return count;
    };

    let interval;
    if (running) {
      interval = setInterval(() => {
        setGrid((prevGrid) => progress(prevGrid));
        setGeneration((generation) => generation + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [running, generation]);

  const initialGrid = () => {
    return Array.from({ length: x }, () => Array.from({ length: y }, () => 0));
  };

  const handleRandom = () => {
    const ranCell = Array.from({ length: x }, () =>
      Array.from({ length: y }, () => (Math.random() > 0.6 ? 1 : 0))
    );
    setGrid(ranCell);
    setCustom(false);
    setSelectedCell([]);
  };

  const handleCustom = (i, j) => {
    if (custom) {
      setCustomCell((prev) => {
        const cellIndex = prev.findIndex(
          (cell) => cell[0] === i && cell[1] === j
        );
        if (cellIndex === -1) {
          // check if cell is not in the custom array
          return [...prev, [i, j]]; // add cell to array
        } else {
          const newCells = [...prev];
          newCells.splice(cellIndex, 1); // remove cell from custom array
          return newCells;
        }
      });
    }

    setSelectedCell((prev) => {
      const cellIndex = prev.findIndex(
        (cell) => cell[0] === i && cell[1] === j
      );
      if (cellIndex === -1) {
        return [...prev, [i, j]];
      } else {
        const newCells = [...prev];
        newCells.splice(cellIndex, 1);
        return newCells;
      }
    });
  };

  const cellColor = (cell, i, j) => {
    if (cell === 1) return alive;
    if (
      selectedCell.some(
        ([selectedI, selectedJ]) => selectedI === i && selectedJ === j
      )
    ) {
      return alive;
    }
    return dead;
  };

  const handleCustomApply = () => {
    setCustom(false);
    const newGrid = initialGrid();
    customCell.forEach(([i, j]) => {
      newGrid[i][j] = 1;
    });
    setGrid(newGrid);
    setSelectedCell([]);
  };

  const handleStart = () => {
    setRunning(true);
  };

  const handlePause = () => {
    setRunning(false);
  };

  const handleReset = () => {
    setGrid(initialGrid());
    setRunning(false);
    setCustom(false);
    setSelectedCell([]);
    setCustomCell([]);
    setGeneration(0);
  };

  return (
    <>
      <div
        className='App'
        style={{
          width: screenWidth,
          height: screenHeight,
          position: 'relative',
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: screenWidth / x,
                height: screenHeight / y,
                backgroundColor: cellColor(cell, i, j),
                border: '0.5px solid grey',
                boxSizing: 'border-box',
                position: 'absolute',
                top: i * (screenHeight / x),
                left: j * (screenWidth / y),
              }}
              onClick={() => {
                handleCustom(i, j);
              }}
            ></div>
          ))
        )}
      </div>
      <div className='buttons'>
        <button onClick={handleRandom}>Random</button>
        <button onClick={() => setCustom(true)}>Custom</button>
        <button onClick={handleCustomApply}>Apply Custom</button>
        <button onClick={handleStart}>Start</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleReset}>Reset</button>
        <div>Generation: {generation}</div>
      </div>
    </>
  );
};

export default App;
