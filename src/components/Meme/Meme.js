import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Clipboard from 'react-clipboard.js';
import GitHubButton from 'react-github-btn';

import MdHeart from 'react-ionicons/lib/MdHeart';
import MdCheckmark from 'react-ionicons/lib/MdCheckmark';
import IosBrowsersOutline from 'react-ionicons/lib/IosBrowsersOutline';

import { LazyImage } from '../LazyImage';
import './Meme.scss';

const fetchJson = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const Meme = () => {
  const [data, setData] = useState({});
  const [emo, setEmo] = useState([]);
  const [fetchDone, setFetchDone] = useState(false);
  const [tooltip, setTooltip] = useState({});
  let [label, setLabel] = useState('');

  useEffect(() => {
    fetchJson('https://dl.dropboxusercontent.com/s/6pdwsq5ouvq0kk7/sus.json?dl=1')
      .then(response => {
        setData(response);
        setEmo(response.emoticons);
        setFetchDone(true);
      })
      .catch(error => console.log(error));
  }, []);

  const getTimeUpdated = data => {
    const { data_version } = data;
    let year = data_version.substring(0, 4);
    let month = data_version.substring(4, 6);
    let day = data_version.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  const renderIcon = (item, index) => {
    const { key, src, ignore } = item;

    return (
      (ignore === undefined) && (
        <div className='col d-flex' key={index}>
          <div className='Meme__item lift'>
            <LazyImage className='Meme__img' src={src} alt='icon' />
            <span className='Meme__sub'>{key}</span>
            <Clipboard component='span' className='Meme__copy' title={`Copy ${key}`} data-clipboard-text={key} onSuccess={onClipboardSuccess}>
              <IosBrowsersOutline fontSize='16px' />
            </Clipboard>
          </div>
        </div>
      )
    );
  };

  const onClipboardSuccess = (event) => {
    setTooltip({
      show: true,
      text: event.text,
    });

    let timer = setTimeout(() => {
      setTooltip({
        show: false,
        text: '',
      });
    }, 2500);

    return () => clearTimeout(timer);
  };

  const handleSearch = (event) => {
    let searchQuery = event.target.value.toLowerCase();
    const filterIcons = data.emoticons.filter((item) => item.key.toLowerCase().indexOf(searchQuery) !== -1);
    setLabel(searchQuery);
    setEmo(filterIcons);
  };

  if (fetchDone) {
    return (
      <div className='Meme'>
        <div className='Meme__github'>
          <GitHubButton
            href='https://github.com/hung1001'
            data-show-count='true'
            aria-label='Follow @hung1001 on GitHub'
          >
            Follow @hung1001
          </GitHubButton>
          <GitHubButton
            href='https://github.com/hung1001/meme-react'
            data-icon='octicon-star'
            data-show-count='true'
            aria-label='Star hung1001/meme-react on GitHub'
          >
            Star
          </GitHubButton>
          <GitHubButton
            href='https://github.com/hung1001/meme-react/fork'
            data-icon='octicon-repo-forked'
            data-show-count='true'
            aria-label='Fork hung1001/meme-react on GitHub'
          >
            Fork
          </GitHubButton>
        </div>
        <div className='Meme__heading'>
          <h2 className='Meme__title'>Meme collections</h2>
          <div className='Meme__updated'>
            Last updated: {getTimeUpdated(data)}, {data.emoticons.length} icons
        </div>
        </div>
        <div className='Meme__search'>
          <input autoFocus className='form-control' type='search' placeholder='Search icon...' onChange={handleSearch} />
          {
            (label !== '') && <p className='Meme__search-label'>Filter by: <b>{label}</b>, {emo.length} {emo.length > 2 ? 'results' : 'result'}</p>
          }
        </div>
        <div className='Meme__body'>
          <div className='row row-cols-3 row-cols-lg-6'>
            {emo.map((item, index) => renderIcon(item, index))}
          </div>
        </div>
        <footer className='Meme__footer'>
          Made by <a href='http://fb.com/100003827888172'>Hung1001</a> with <MdHeart className='mt-n1' fontSize='20px' color='red' beat={true} />
        </footer>
        {
          tooltip.show && (
            <div className='Meme__alert alert alert-success'>
              <span>Copied <b>{tooltip.text}</b> to clipboard</span>
              <MdCheckmark fontSize='20px' />
            </div>
          )
        }
      </div>
    );
  } else {
    return (
      <div className='Meme Meme--loading'>
        <div className='lds-ring'>
          <div /><div /><div /><div />
        </div>
      </div>
    );
  }
};

export default Meme;
