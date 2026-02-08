import { useEffect, useState, type FC } from 'react';

export const DistractionTimer: FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timerRunning) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      if (seconds > highScore) {
        setHighScore(seconds);
      }
      setSeconds(0);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timerRunning]);

  const handleStart = (event: React.MouseEvent) => {
    event.currentTarget.setAttribute('data-ignore-interaction', 'true');
    setTimerRunning(true);
  };

  useEffect(() => {
    const handleInteraction = (event: Event) => {
      if (timerRunning && !(event.target as HTMLElement).closest('[data-ignore-interaction]')) {
        setTimerRunning(false);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('visibilitychange', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('visibilitychange', handleInteraction);
    };
  }, [timerRunning]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-xl">Time: {seconds} seconds</div>
      <div className="text-lg">High Score: {highScore} seconds</div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleStart}
        disabled={timerRunning}
      >
        {timerRunning ? 'Running...' : 'Start'}
      </button>
    </div>
  );

};
