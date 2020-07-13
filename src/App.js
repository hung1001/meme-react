import React from 'react';
import Meme from './components/Meme';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

function App() {
  return (
    <PerfectScrollbar>
      <div className='container'>
        <Meme />
      </div>
    </PerfectScrollbar>
  );
}

export default App;
