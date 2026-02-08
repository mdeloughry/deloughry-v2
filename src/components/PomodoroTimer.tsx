import { useState, useEffect } from 'react';

type TimerData = {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
};


const PomodoroTimer = () => {
  const timerConfig = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  };

  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [sessions, setSessions] = useState(0);
  const [remainingTime, setRemainingTime] = useState(timerConfig.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const [timerData, setTimerData] = useState<TimerData>({
    pomodoro: 0,
    shortBreak: 0,
    longBreak: 0,
  });

  const showNotification = () => {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notifications");
    } else if (Notification.permission === "granted") {
      new Notification(`Pomodoro Timer - ${mode}`, {
        body: `${mode} Timer is complete!`,
        icon: '/512x512.png'
      });
    };
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setRemainingTime(timerConfig[newMode] * 60);
  };


  const startTimer = () => {
    if (intervalId) return;
    setIsRunning(true);
    const newIntervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const stopTimer = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    setIntervalId(null);
    setIsRunning(false);
  };

  const playAudio = () => {
    if (isSoundOn) {
      const audioEl = document.getElementById("timer-sound") as HTMLAudioElement;
      audioEl.play();
    }
  };

  const requestNotificationPermission = () => {
    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notifications");
    } else if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (remainingTime <= 0) {
      playAudio();
      showNotification();
      stopTimer();

      if (mode === 'pomodoro') {
        timerData.pomodoro += 1;
        setSessions((prevSessions) => prevSessions + 1);
        if (sessions % timerConfig.longBreakInterval === 0 && sessions > 1) {
          switchMode('longBreak');
        } else {
          switchMode('shortBreak');
        }
      } else {
        timerData[mode] += 1;
        switchMode('pomodoro');
      }

      setTimerData(timerData);
      startTimer();
    }
  }, [remainingTime]);

  return (
    <div className="container mx-auto align-middle justify-center flex flex-col">
      <audio id="timer-sound">
        <source src="https://onlineclock.net/audio/options/default.mp3"></source>
      </audio>
      {/* Timer display */}
      <div className={`text-20xl text-center ${mode === 'pomodoro'
        ? 'text-red-500 animate-pulse'
        : mode === 'shortBreak'
          ? 'text-blue-500 animate-pulse'
          : 'text-blue-800 animate-pulse'
        } shadow-md`}
      >
        {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          minimumFractionDigits: 0,
        })}
      </div>

      {/* Mode buttons */}
      <div className="flex space-x-4 mb-4 justify-center">
        <button className="flex items-center justify-center rounded-lg bg-red-500 ring-red-400  px-4 py-2 text-white transition-all hover:ring-2" onClick={() => switchMode('pomodoro')}>Pomodoro</button>
        <button className="flex items-center justify-center rounded-lg bg-blue-500 ring-blue-400  px-4 py-2 text-white transition-all hover:ring-2" onClick={() => switchMode('shortBreak')}>Short Break</button>
        <button className="flex items-center justify-center rounded-lg bg-blue-800 ring-blue-400  px-4 py-2 text-white transition-all hover:ring-2" onClick={() => switchMode('longBreak')}>Long Break</button>
      </div>

      {/* Start/Stop button */}
      <button className={`flex items-center justify-center rounded-lg  bg-zinc-200 p-2 ring-zinc-400 transition-all hover:ring-2 dark:bg-zinc-700  ${isRunning ? 'bg-opacity-50' : ''}`} onClick={isRunning ? stopTimer : startTimer}>
        {isRunning ? 'Stop' : 'Start'}
      </button>

      <button
        className="flex items-center justify-center rounded-lg bg-gray-300 ring-gray-400 px-4 py-2 text-gray-800 transition-all hover:ring-2"
        onClick={toggleSound}
      >
        {isSoundOn ? "Sound On" : "Sound Off"}
      </button>

      <div className="mt-4 flex flex-col text-center justify-center">
        <p>Completed Timers:</p>
        <p>Pomodoro: {timerData.pomodoro}</p>
        <p>Short Break: {timerData.shortBreak}</p>
        <p>Long Break: {timerData.longBreak}</p>
      </div>
    </div>
  );


};

export default PomodoroTimer;
