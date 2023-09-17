import axios from 'axios';

const axiosConfig = {
  baseURL: 'https://dummyjson.com/todos',
  timeout: '2000',
  timeoutErrorMessage: 'Error fetching resource'
}

const IBaseConfig = axios.create({ ...axiosConfig })

export default IBaseConfig
