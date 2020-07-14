import React from 'react';
import Meme from './components/Meme/Meme';
import ScrollButton from './components/ScrollButton';
import './App.scss';

function App() {
  return (
    <>
      <div className='container'>
        <Meme />
      </div>
      <ScrollButton />
    </>
  );
}

export default App;
