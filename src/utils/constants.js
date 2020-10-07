import en_img from 'images/locale/en.png';
import vi_img from 'images/locale/vi.png';
import ja_img from 'images/locale/ja.png';

const LOCALES = [
  {
    lang: 'en',
    desc: 'English',
    img: en_img
  },
  {
    lang: 'vi',
    desc: 'Tiếng Việt',
    img: vi_img
  },
  {
    lang: 'ja',
    desc: '日本語',
    img: ja_img
  },
];

const DATA_URL = 'https://dl.dropboxusercontent.com/s/6pdwsq5ouvq0kk7/sus.json?dl=1';

export {
  DATA_URL,
  LOCALES
};
