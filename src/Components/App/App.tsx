import React, {useEffect, useState} from 'react';
import Difficulty from '../Difficulty/Difficulty';
import './App.scss';

const App = () => {
  const size = 16;
  const [isStart, setIsStart] = useState(false);
  const [isRestart, setIsRestart] = useState(false);
  const [table, setTable] = useState(new Array(size).fill(new Array(size).fill({class: 'empty', live: 0})));
  const [direction, setDirection] = useState('right');
  const [apples, setApples] = useState(0);
  const [difficult, setDifficult] = useState(5);
  const [snake, setSnake] = useState({
    head: [size / 2, 0],
    length: 2
  });

  const startGame = () => {
    setIsStart(true);
    setIsRestart(false);
    let newArr = JSON.parse(JSON.stringify(new Array(size).fill(new Array(size).fill({class: 'empty', live: 0}))));
    newArr[snake.head[0]][snake.head[1] - 1] = {class: 'snake', live: 1};
    newArr[snake.head[0]][snake.head[1]] = {class: 'snake', live: 2};
    setTable(newArr);
  }

  const restartGame = () => {
    setSnake({
      head: [size / 2, 0],
      length: 2
    });
    setApples(0);
    setDirection('right');
    startGame();
  }

  const getRandom = () => {
    return {x: Math.floor(Math.random() * size), y: Math.floor(Math.random() * size)};
  }

  const changeDirection = (e: { keyCode: number }) => {
    switch (e.keyCode) {
      case 37:
        if (direction !== 'right' && direction !== 'left') {
          setDirection('left');
        }
        break;
      case 38:
        if (direction !== 'down' && direction !== 'up') {
          setDirection('up');
        }
        break;
      case 39:
        if (direction !== 'left' && direction !== 'right') {
          setDirection('right');
        }
        break;
      case 40:
        if (direction !== 'up' && direction !== 'down') {
          setDirection('down');
        }
        break;
    }
  }

  const lose = () => {
    setIsStart(false);
    setIsRestart(true);
  }

  useEffect(() => {
    isStart && setTimeout(() => {
      const headX = snake.head[1];
      const headY = snake.head[0];
      let length = snake.length;
      let newArr = JSON.parse(JSON.stringify(table));
      const reduceLive = () => {
        newArr = table.map(i => i.map((k: { class: string, live: number }) => {
          return k.class === 'snake' ? {...k, live: k.live - 1} : k;
        }));
      }
      switch (direction) {
        case 'right':
          if (headX + 1 === size || newArr[headY][headX + 1].class === 'snake') {
            lose();
          } else {
            if (newArr[headY][headX + 1].class === 'apple') {
              length++;
              setApples(apples - 1);
            } else {
              reduceLive();
            }
            newArr[headY][headX + 1] = {class: 'snake', live: length};
            setSnake({
              head: [headY, headX + 1],
              length
            });
          }
          break;
        case 'up':
          if (headY === 0 || newArr[headY - 1][headX].class === 'snake') {
            lose();
          } else {
            if (newArr[headY - 1][headX].class === 'apple') {
              length++;
              setApples(apples - 1);
            } else {
              reduceLive();
            }
            newArr[headY - 1][headX] = {class: 'snake', live: length};
            setSnake({
              head: [headY - 1, headX],
              length
            });
          }
          break;
        case 'left':
          if (headX === 0 || newArr[headY][headX - 1].class === 'snake') {
            lose();
          } else {
            if (newArr[headY][headX - 1].class === 'apple') {
              length++;
              setApples(apples - 1);
            } else {
              reduceLive();
            }
            newArr[headY][headX - 1] = {class: 'snake', live: length};
            setSnake({
              head: [headY, headX - 1],
              length
            });
          }
          break;
        case 'down':
          if (headY === size - 1 || newArr[headY + 1][headX].class === 'snake') {
            lose();
          } else {
            if (newArr[headY + 1][headX].class === 'apple') {
              length++;
              setApples(apples - 1);
            } else {
              reduceLive();
            }
            newArr[headY + 1][headX] = {class: 'snake', live: length};
            setSnake({
              head: [headY + 1, headX],
              length
            });
          }
          break;
      }
      const coords = getRandom();
      if (newArr[coords.y][coords.x].class !== 'snake' && (Math.floor(Math.random() * 100) < 10) && apples < 2) {
        newArr[coords.y][coords.x] = {class: 'apple', live: 10};
        setApples(apples + 1);
      }

      setTable(newArr.map((item: { class: string, live: number }[]) => {
        return item.map(i => {
          switch (i.class) {
            case 'snake':
              return i.live === 0 ? {class: 'empty', live: 0} : i;
            case 'apple':
              return i.live === 0 ? {class: 'empty', live: 0} : i;
            default:
              return i;
          }
        })
      }));
    }, 500 / difficult)
  }, [table])

  return (
    <div
      className='app'
      onKeyDown={changeDirection}
    >
      <Difficulty difficult={difficult} setDifficult={setDifficult} isStart={isStart}/>
      <h1 className='app-score'>Score: {(snake.length - 2) * 100}</h1>
      {isRestart && <div className='app-lose'>
        <h2>Game over!</h2>
        <h1>Your score: {(snake.length - 2) * 100}</h1>
      </div>}
      <table>
        <tbody>
        {
          table.map((item, indexTR) => (<tr key={`${indexTR + 1}`}>
            {
              item.map((itemTD: { class: string }, indexTD: number) => (
                <td
                  key={`${indexTR}-${indexTD}`}
                  className={itemTD.class}
                />
              ))
            }
          </tr>))
        }
        </tbody>
      </table>
      <button onClick={startGame} style={{zIndex: !isStart && !isRestart ? 1 : -1}}>Start</button>
      <button onClick={restartGame} style={{
        zIndex: !isRestart ? -1 : 1,
        position: 'relative',
        bottom: '35px'
      }}>
        Restart
      </button>
    </div>
  );
}

export default App;
