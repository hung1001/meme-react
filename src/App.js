import './App.scss';

import React from 'react';
import { I18nextProvider } from 'react-i18next';

import Meme from './components/Meme';
import ScrollButton from './components/ScrollButton';
import i18n from './i18n';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className='container'>
        <Meme />
      </div>
      <ScrollButton />
    </I18nextProvider>
  );
}

export default App;
