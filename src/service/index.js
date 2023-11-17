import axios from 'axios';

const axiosConfig = {
  baseURL: 'https://dummyjson.com/todos',
}

const IBaseConfig = axios.create({ ...axiosConfig })

export default IBaseConfig

IBaseConfig.interceptors.request.use((req) => {
  req.meta = req.meta ?? {}
  req.meta.requestStartedAt = new Date().getTime()
  return req
})

IBaseConfig.interceptors.response.use((resp) => {
  resp.durationInMs = new Date().getTime() - resp.config.meta.requestStartedAt
  return resp
},
(resp) => {
  resp.durationInMs = new Date().getTime() - resp.config.meta.requestStartedAt
  throw resp
}
)
