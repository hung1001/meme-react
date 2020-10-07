import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import Clipboard from 'react-clipboard.js';
import GitButton from '../GitButton';
import { useTranslation } from 'react-i18next';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import MdHeart from 'react-ionicons/lib/MdHeart';
import LogoGithub from 'react-ionicons/lib/LogoGithub';
import IosBrowsersOutline from 'react-ionicons/lib/IosBrowsersOutline';
import IosInformationCircleOutline from 'react-ionicons/lib/IosInformationCircleOutline';

import { LazyImage } from '../LazyImage';
import Loading from 'components/Loading';
import ChangeLanguage from '../ChangeLanguage';

import './style.scss';

import {
  DATA_URL,
  LOCALES
} from 'utils/constants';

import {
  fetchJson,
  getTimeUpdated,
  setLocalStorage,
  getLocalStorage
} from 'utils/helpers';

const Meme = () => {
  let timer;
  const refInputURL = useRef(null);
  const [data, setData] = useState({});
  const [emo, setEmo] = useState([]);
  const [historyCopy, setHistoryCopy] = useState(() => (getLocalStorage('historyCopy') || []));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  let [tooltip, setTooltip] = useState('');
  let [query, setQuery] = useState('');
  const [imgLang, setImgLang] = useState(() => {
    const getLang = window.localStorage.getItem('lang');
    return (getLang !== null && LOCALES.filter(locale => locale.lang === getLang)[0].img) || LOCALES[0].img;
  });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    !fetchDone && fetchJson(DATA_URL)
      .then(response => {
        setData(response);
        setEmo(response.emoticons);
        setFetchDone(true);
      })
      .catch(error => console.log(error));

    setLocalStorage(historyCopy, 'historyCopy');
  }, [fetchDone, historyCopy]);

  const changeLanguage = lang => i18n.changeLanguage(lang);

  const renderIcon = (item, index) => {
    const { key, src } = item;

    const renderSearchKey = (key, value) => {
      // eslint-disable-next-line no-useless-escape
      let term = key.toLowerCase().search(value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').toLowerCase());

      return (
        <>
          {key.substr(0, term)}
          <b>{key.substr(term, value.length)}</b>
          {key.substr(term + value.length)}
        </>
      )
    };

    return (
      <div className='col d-flex' key={index}>
        <div className='Meme__item lift' style={{ zIndex: tooltip === `icon-${index + 1}` && 1 }}>
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
                <span className='tooltip-inner' role='tooltip'>{t('meme.copied')}</span>
                <span className='arrow' />
              </span>
            )
          }
        </div>
      </div>
    );
  };

  const onClipboardSuccess = (event) => {
    const now = moment().format('DD/MM/YYYY, hh:mm:ss A');
    let historyCopy = getLocalStorage('historyCopy') || [];
    let icon = {
      value: event.text,
      src: event.trigger.parentNode.previousElementSibling.previousElementSibling.src,
      time: now
    },
      id = event.trigger.parentNode.id,
      isDuplicate = historyCopy.some(item => item.value === icon.value);

    if (!isDuplicate) {
      historyCopy.unshift(icon);
    } else {
      historyCopy.forEach((item, index) => {
        if (item.value === icon.value) {
          historyCopy.splice(index, 1);
          item.time = now;
          historyCopy.unshift(item);
        }
      });
    }

    setTooltip(id);
    setHistoryCopy(historyCopy);
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

  const removeHistoryIcon = (index) => {
    return () => {
      setHistoryCopy(arr => {
        return [
          ...arr.slice(0, index),
          ...arr.slice(index + 1)
        ];
      });
    }
  };

  const renderHistoryCopy = data => {
    return data.map((icon, index) => (
      <div className='icon' key={index}>
        <span className='thumb'>
          <img className='img-fluild' src={icon.src} alt='icon' />
        </span>
        <span className='value'>
          <span className='key'>{icon.value}</span>
          <span className='time'>{icon.time}</span>
        </span>
        <span className='remove' title={t('meme.history_copy.remove')} onClick={removeHistoryIcon(index)}>×</span>
      </div>
    ))
  };

  const handleChangeLang = (locale) => {
    const { img, lang } = locale;
    changeLanguage(lang);
    setImgLang(img);
    window.localStorage.setItem('lang', lang);
  };

  if (fetchDone) {
    return (
      <div className='Meme'>
        <ChangeLanguage
          onChangeLang={handleChangeLang}
          currentLang={imgLang}
        />

        <section className="row align-items-center mt-5 mt-md-4">
          <div className="col-md">
            <h2 className='Meme__title mb-2 mb-md-0'>
              {t('meme.title')} <a href='https://chatpp.thangtd.com/' target='_blank' rel="noopener noreferrer">{t('meme.chat++')}</a>
            </h2>
          </div>
          <div className="col-md-auto">
            <div className='Meme__github'><GitButton /></div>
          </div>
        </section>

        <section className='row align-items-center my-4 py-1'>
          <div className="col-md-5">
            <div className='Meme__updated mb-2 mb-md-0'>
              {t('meme.last_updated')} <b>{getTimeUpdated(data)}</b>, {' '}
              {data.emoticons.length} {data.emoticons.length > 2 ? t('meme.icons') : t('meme.icon')}
            </div>
          </div>
          <div className="col-md-7">
            <div className='input-group'>
              <input type='text' className='form-control text-center' value={DATA_URL} readOnly ref={refInputURL} />
              <div className='input-group-append'>
                <Clipboard
                  component='button'
                  className='btn btn-primary'
                  data-clipboard-text={DATA_URL}
                  onSuccess={() => refInputURL.current.focus()}
                >
                  {t('meme.copy')}
                </Clipboard>
              </div>
            </div>
          </div>
        </section>

        <section className='Meme__search'>
          <input spellCheck='false' autoFocus className='form-control' type='search' placeholder={t('meme.input_placeholder')} onChange={handleSearch} />
          {
            (query !== '') &&
              <p className='Meme__search-query'>
                {t('meme.search.label')} <b>{query}</b>, {' '}
                {emo.length} {emo.length > 2 ? t('meme.search.results') : t('meme.search.result')}
              </p>
          }
        </section>

        <main className='Meme__body'>
          <div className='row row-cols-3 row-cols-lg-6'>
            {emo.map((item, index) => renderIcon(item, index))}
          </div>
        </main>

        <footer className='Meme__footer'>
          <p className='mb-0 mr-1'>
            {t('meme.footer.made_by')} <a href='http://fb.com/100003827888172'>{t('meme.footer.me')}</a> {' '}
            {t('meme.footer.with')} <MdHeart className='mt-n1' fontSize='20px' color='red' beat={true} />
          </p>
          <p className='d-inline-flex align-items-center mb-0'>
            {t('meme.footer.hosted_by')} <LogoGithub fontSize='19px' className='mx-1' />
            <a href='https://github.com/'>{t('meme.footer.github')}</a>
          </p>
        </footer>

        <aside className='Meme__history'>
          <Dropdown
            className='Meme__dropdown'
            direction='down'
            isOpen={dropdownOpen} toggle={() => setDropdownOpen(prevState => !prevState)}
          >
            <DropdownToggle className='Meme__dropdown-toggle'>
              <svg focusable='false' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22px' height='22px'>
                <path d='M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' />
              </svg>
            </DropdownToggle>
            <DropdownMenu className='Meme__dropdown-menu'>
              {
                historyCopy.length === 0 ?
                  <div className='empty'>
                    <IosInformationCircleOutline fontSize='24px' className='mr-1' />
                    <span>{t('meme.history_copy.empty')}</span>
                  </div>
                  :
                  <div className='icons'>
                    <div className='clear' title={t('meme.history_copy.remove_all')} onClick={() => setHistoryCopy([])}>
                      <svg version='1.1' id='Capa_1' x='0px' y='0px' viewBox='0 0 407.521 407.521' width='18px' height='18px'>
                        <g>
                          <path d='M335.94,114.944H71.581c-2.86-0.243-5.694,0.702-7.837,2.612c-2.107,2.024-3.083,4.954-2.612,7.837l27.167,236.669c3.186,26.093,25.436,45.647,51.722,45.453h131.657c27.026,0.385,49.791-20.104,52.245-47.02l22.465-236.147c0.139-2.533-0.811-5.005-2.612-6.792C341.634,115.646,338.8,114.701,335.94,114.944z M303.026,359.45c-1.642,15.909-15.366,27.803-31.347,27.167H140.022c-15.694,0.637-29.184-11.024-30.825-26.645L83.075,135.842h241.371L303.026,359.45z' />
                          <path d='M374.079,47.026H266.454V30.307c0.58-16.148-12.04-29.708-28.188-30.288c-0.53-0.019-1.061-0.024-1.591-0.014h-65.829c-16.156-0.299-29.494,12.555-29.793,28.711c-0.01,0.53-0.005,1.061,0.014,1.591v16.718H33.442c-5.771,0-10.449,4.678-10.449,10.449s4.678,10.449,10.449,10.449h340.637c5.771,0,10.449-4.678,10.449-10.449S379.849,47.026,374.079,47.026z M245.556,30.307v16.718h-83.592V30.307c-0.589-4.579,2.646-8.768,7.225-9.357c0.549-0.071,1.104-0.086,1.656-0.047h65.829c4.605-0.326,8.603,3.142,8.929,7.748C245.643,29.203,245.627,29.758,245.556,30.307z' />
                        </g>
                      </svg>
                    </div>
                    <h5 className='title'>{t('meme.history_copy.label')}</h5>
                    {renderHistoryCopy(historyCopy)}
                  </div>
              }
            </DropdownMenu>
          </Dropdown>
        </aside>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Meme;
