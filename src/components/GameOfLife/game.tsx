import { useState, useCallback, useRef } from 'react';

const numofRows = 20;
const numofCols = 20;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

// Pulsar pattern in a 20 x 20 grid

const pulsarPattern = [
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numofRows; i++) {
    rows.push(Array.from(Array(numofCols), () => 0));
  }
  return rows;
}

const GameOfLife = () => {
  const [grid, setGrid] = useState(() => {
    const rows = generateEmptyGrid();

    // Insert the pulsar pattern at the center of the grid
    const startRow = Math.floor(numofRows / 2) - Math.floor(pulsarPattern.length / 2);
    const startCol = Math.floor(numofCols / 2) - Math.floor(pulsarPattern[0].length / 2);

    for (let i = 0; i < pulsarPattern.length; i++) {
      for (let j = 0; j < pulsarPattern[i].length; j++) {
        rows[startRow + i][startCol + j] = pulsarPattern[i][j];
      }
    }

    return rows;
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((oldGrid) => {
      const newGrid = JSON.parse(JSON.stringify(oldGrid));
      for (let i = 0; i < numofRows; i++) {
        for (let j = 0; j < numofCols; j++) {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (newI >= 0 && newI < numofRows && newJ >= 0 && newJ < numofCols) {
              neighbors += oldGrid[newI][newJ];
            }
          });

          if (neighbors < 2 || neighbors > 3) {
            newGrid[i][j] = 0;
          } else if (oldGrid[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }
      return newGrid;
    });

    setTimeout(runSimulation, 200);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <h2>React</h2>
      <div className="flex gap-2 items-center justify-center align-middle">
        <button
          class="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-semibold leading-6 text-bgColor shadow-sm hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())} class="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-semibold leading-6 text-bgColor shadow-sm hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark">
          Clear
        </button>
        <button
          class="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-semibold leading-6 text-bgColor shadow-sm hover:bg-accent-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
          onClick={() => {
            const rows = generateEmptyGrid();
            for (let i = 0; i < numofRows; i++) {
              for (let j = 0; j < numofCols; j++) {
                rows[i][j] = Math.random() > 0.7 ? 1 : 0;
              }
            }
            setGrid(rows);
          }}>Random</button>
      </div>
      <div className="grid grid-cols-20 gap-1 mt-8">
        {grid.flatMap((rows, i) =>
          rows.flatMap((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][j] = grid[i][j] ? 0 : 1;
                setGrid(newGrid);
              }}
              className={`w-6 h-6 rounded-md shadow transition-all duration-300 transform hover:cursor-pointer hover:scale-110 ${grid[i][j] ? 'bg-accent hover:bg-accent-dark' : 'bg-accent-bg hover:brightness-50'}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default GameOfLife;
