import axios from 'axios';

const fetchJson = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getTimeUpdated = (data) => {
  const { data_version } = data;
  let year = data_version.substring(0, 4);
  let month = data_version.substring(4, 6);
  let day = data_version.substring(6, 8);
  return `${day}/${month}/${year}`;
};

const setLocalStorage = (arr, name) => window.localStorage.setItem(name, JSON.stringify(arr));

const getLocalStorage = (name) => JSON.parse(window.localStorage.getItem(name));

export { fetchJson, getTimeUpdated, setLocalStorage, getLocalStorage };
