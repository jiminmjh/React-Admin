import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { message, Modal } from 'antd'
import storage from '@/utils/storage'
import { refreshTokenAPI } from '@/server'
import { store } from '@/stores'
import { setToken } from '@/stores/user'

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 10
}

class HttpRequest {
  axiosIns: AxiosInstance
  queq: Array<(newToken: string) => void>
  isRefreshing: boolean

  constructor(config: AxiosRequestConfig) {
    this.axiosIns = axios.create(config)
    this.queq = []
    this.isRefreshing = false

    /** 请求拦截器 */
    this.axiosIns.interceptors.request.use(
      config => {
        const token = storage.get('token') || ''
        const refreshToken = storage.get('refreshToken') || ''

        // 没有token时，直接发出请求
        if (!token) return config

        // 请求头中追加 Authorization
        config.headers.Authorization = token

        // token要过期了,且refreshToken没过期
        if (storage.isExpired('token') && !storage.isExpired('refreshToken') && !config.url?.includes('refreshToken')) {

          if (!this.isRefreshing) {
            Modal.confirm({
              title: 'token已到期，是否重新刷新?',
              onOk() {
                // 1.发送刷新 token 的请求
                console.log('发送刷新TOKEN的请求')
                this.isRefreshing = true
                refreshTokenAPI(refreshToken).then(async result => {
                  // 1.1异步更新 token，但是不要更新 refreshToken
                  // 先执行下面 将当前请求放入 queq 队列
                  console.log('刷新TOKEN完成', result)
                  await store.dispatch(
                    setToken({ ...result, isChangeRefresh: false })
                  )
                  // 1.2重置isRefreshing
                  this.isRefreshing = false
                  // 1.3取出队列中的函数进行执行
                  this.queq.forEach(item => item(result.token))
                  // 1.4重置队列
                  this.queq = []
                })
              },
              onCancel() {
                console.log('Cancel')
              }
            })
          }

          //2.阻止当前请求的发出，将其追加到一个队列
          return new Promise(resolve => {
            this.queq.push(function(newToken) {
              // 处理旧token
              config.headers.Authorization = newToken
              resolve(config)
            })
          })

        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    /** 响应拦截器 */
    this.axiosIns.interceptors.response.use(
      response => {
        const { data: result, config } = response

        //业务状态吗判断
        if (result.code !== 1000) {
          config.toast ?? (config.toast = true)
          config.toast && message.error(result.message)
          return Promise.reject('错误')
        }
        return result.data
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  get<T = unknown>(url: string, params: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosIns.get(url, {
      ...config,
      params
    })
  }

  post<T = unknown>(url: string, data: object = {}, config: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosIns.post(url, data, {
      ...config
    })
  }
}

export default new HttpRequest(defaultConfig)
