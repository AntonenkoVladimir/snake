import React from 'react';
import './Difficulty.scss';

interface IDifficultProps {
  difficult: number,
  setDifficult: (i: number) => void,
  isStart: boolean
}

const Difficulty = ({difficult, setDifficult, isStart}: IDifficultProps) => {

  return (<div className='app-difficult'>
    {!isStart && <h2 onClick={() => difficult < 10 && setDifficult(difficult + 1)}>&#x21e7;</h2>}
    <h1>{difficult}</h1>
    {!isStart && <h2 onClick={() => difficult > 1 && setDifficult(difficult - 1)}>&#x21e9;</h2>}
    {isStart ? <p>Difficulty</p> : <p>Change difficulty</p>}
  </div>);
}

export default Difficulty;
