import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Clipboard from 'react-clipboard.js';
import GitHubButton from 'react-github-btn';

import MdHeart from 'react-ionicons/lib/MdHeart';
import IosBrowsersOutline from 'react-ionicons/lib/IosBrowsersOutline';

import { LazyImage } from '../LazyImage';
import './Meme.scss';

const fetchJson = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const Meme = () => {
  let timer;
  const [data, setData] = useState({});
  const [emo, setEmo] = useState([]);
  const [fetchDone, setFetchDone] = useState(false);
  let [tooltip, setTooltip] = useState('');
  let [query, setQuery] = useState('');

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

    const renderSearchKey = (key, value) => {
      // eslint-disable-next-line no-useless-escape
      let term = key.search(value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));

      return (
        <>
          {key.substr(0, term)}
          <b>{key.substr(term, value.length)}</b>
          {key.substr(term + value.length)}
        </>
      )
    };

    return (
      (ignore === undefined) && (
        <div className='col d-flex' key={index}>
          <div className='Meme__item lift'>
            <LazyImage className='Meme__img' src={src} alt='icon' />
            <span className='Meme__sub'>
              {(query !== '') ? renderSearchKey(key, query) : key}
            </span>
            <span className='Meme__action' id={`icon-${index + 1}`}>
              <Clipboard
                component='span'
                className='Meme__copy'
                data-clipboard-text={key}
                onSuccess={onClipboardSuccess}
              >
                <IosBrowsersOutline fontSize='16px' />
              </Clipboard>
            </span>
            {
              (tooltip === `icon-${index + 1}`) && (
                <span className='tooltip show bs-tooltip-bottom'>
                  <span className='tooltip-inner' role='tooltip'>Copied</span>
                  <span className='arrow' />
                </span>
              )
            }
          </div>
        </div>
      )
    );
  };

  const onClipboardSuccess = (event) => {
    setTooltip(event.trigger.parentNode.id);
    timer !== null && clearTimeout(timer);
    timer = setTimeout(() => setTooltip(''), 1800);
    return () => clearTimeout(timer);
  };

  const handleSearch = (event) => {
    let searchQuery = event.target.value.toLowerCase();
    const filterIcons = data.emoticons.filter(item => item.key.toLowerCase().indexOf(searchQuery) !== -1);
    setQuery(searchQuery);
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
          <input spellCheck='false' autoFocus className='form-control' type='search' placeholder='Search icon...' onChange={handleSearch} />
          {(query !== '') && <p className='Meme__search-query'>Filter by: <b>{query}</b>, {emo.length} {emo.length > 2 ? 'results' : 'result'}</p>}
        </div>
        <div className='Meme__body'>
          <div className='row row-cols-3 row-cols-lg-6'>
            {emo.map((item, index) => renderIcon(item, index))}
          </div>
        </div>
        <footer className='Meme__footer'>
          Made by <a href='http://fb.com/100003827888172'>Hung1001</a> with <MdHeart className='mt-n1' fontSize='20px' color='red' beat={true} />
        </footer>
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
