import './style.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { LOCALES } from 'utils/constants';

function ChangeLanguage(props) {
  const { currentLang, onChangeLang } = props;
  const { t } = useTranslation();

  const handleChangeLang = (locale) => {
    return () => {
      onChangeLang(locale);
    };
  };

  return (
    <nav className="Meme-nav">
      <div className="Meme-nav__dropdown">
        <div className="Meme-nav__current">
          <span className="text">{t('meme.lang')}</span>
          <img className="img-fluid" src={currentLang} alt="flag" />
        </div>
        <ul className="Meme-nav__list">
          {
            LOCALES.map(locale => (
              <li
                key={locale.lang}
                className="Meme-nav__item"
                onClick={handleChangeLang(locale)}
              >
                <img className="img-fluid" src={locale.img} alt="flag" />
                <span className="text">{locale.desc}</span>
              </li>
            ))
          }
        </ul>
      </div>
    </nav>
  );
}

export default ChangeLanguage;
