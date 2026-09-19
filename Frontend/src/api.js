import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const getOverview = () =>
  API.get('/overview');

export const getPredictions = (payload) =>
  API.post('/predict', payload);

export default API;