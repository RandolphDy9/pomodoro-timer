function App() {
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [breakLength, setBreakLength] = React.useState(5);
  const [sessionLength, setSessionLength] = React.useState(25);
  const [timerActive, setTimerActive] = React.useState(false);
  let timer;

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
  
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerActive(false);
  };

  const handleChangeTime = (amount, type) => {
    if (type === "break") {
      if (breakLength <= 1 && amount < 0) {
        return;
      }
      setBreakLength((prev) => prev + amount);
    } else {
      if (sessionLength <= 1 && amount < 0) {
        return;
      }
      setSessionLength((prev) => prev + amount);
    }
  };

  const controlTime = () => {
    if (timerActive) {
      clearInterval(timer);
      setTimerActive(false);
    } else {
      setTimerActive(true);
      startTimer();
    }
  };

  const startTimer = () => {
    timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          // Time is up, play a sound or take any other action here
          // For example, you can add a beep sound when the timer reaches 00:00.
          // const audio = new Audio('beep.mp3');
          // audio.play();

          // If it's session time, switch to break time, and vice versa
          if (sessionLength > 0) {
            setSessionLength((prevSession) => prevSession - 1);
            setTimeLeft(breakLength * 60);
          } else {
            setSessionLength(25);
            setTimeLeft(sessionLength * 60);
          }
        }
        return prevTime > 0 ? prevTime - 1 : prevTime;
      });
    }, 1000);
  };

  React.useEffect(() => {
    const updatedTime = sessionLength * 60;
    setTimeLeft(updatedTime);
  }, [sessionLength]);

  React.useEffect(() => {
    if (timerActive && timeLeft > 0) {
      startTimer();
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [timeLeft, timerActive, breakLength, sessionLength]);

  return (
    <div
      id="timer-container"
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div id="title">Pomodoro Timer</div>
      <div id="content">
        <div className="d-flex flex-row justify-content-around">
          <div className="d-flex flex-column">
            <div id="break-label">
              <b>Break Length</b>
            </div>
            <div className="d-flex flex-row justify-content-between fs-2">
              <div
                id="break-decrement"
                onClick={() => handleChangeTime(-1, "break")}
              >
                &#8711;
              </div>
              <div id="break-length">{breakLength}</div>
              <div
                id="break-increment"
                onClick={() => handleChangeTime(1, "break")}
              >
                &#916;
              </div>
            </div>
          </div>
          <div className="d-flex flex-column">
            <div id="break-label">
              <b>Session Length</b>
            </div>
            <div className="d-flex flex-row justify-content-between fs-2">
              <div
                id="session-decrement"
                onClick={() => handleChangeTime(-1, "session")}
              >
                &#8711;
              </div>
              <div id="session-length">{sessionLength}</div>
              <div
                id="session-increment"
                onClick={() => handleChangeTime(1, "session")}
              >
                &#916;
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div id="timer-label">Session</div>
          <div id="time-left">{formatTime(timeLeft)}</div>
          {/* audio id="beep" on 00:00 time! */}
          {/* audio beep must be 1 second or longer */}
          <div className="d-flex flex-row justify-content-around">
            <div id="reset" onClick={resetTimer}>
              Reset
            </div>
            <div id="start_stop" onClick={controlTime}>
              {timerActive ? "Stop" : "Start"}
            </div>
          </div>
        </div>
      </div>
      <p>
        The 25 + 5 timer is a time management technique commonly known as the
        "Pomodoro Technique." It was developed by Francesco Cirillo in the late
        1980s and is named after a tomato-shaped kitchen timer he used during
        university.
      </p>
    </div>
  );
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
