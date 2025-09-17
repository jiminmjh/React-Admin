import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import storage from '@/utils/storage'
import { refreshTokenAPI } from '@/server'
import { store } from '@/stores'
import { setToken } from '@/stores/user'

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000 * 10
}

class HttpRequest {
  /**
 * private:  设为私有防止外部直接访问和修改，确保请求的一致性和安全性
 */
  private axiosIns: AxiosInstance
  private queq: Array<(newToken: string) => void>
  private isRefreshing: boolean

  constructor(config: AxiosRequestConfig) {
    this.axiosIns = axios.create(config)
    this.queq = []
    this.isRefreshing = false

    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  private setupRequestInterceptor(): any {
    this.axiosIns.interceptors.request.use(
      (config:any) => {
        const token = storage.get('token') || ''
        const refreshToken = storage.get('refreshToken') || ''

        // 没有token时，直接发出请求
        if (!token) return config

        // 请求头中追加 Authorization
        config.headers.Authorization = token

        // token要过期了,且refreshToken没过期
        if (storage.isExpired('token') && !config.url?.includes('refreshToken')) {
          if (!storage.isExpired('refreshToken')) {
            return this.handleTokenRefresh(config, refreshToken)
          } else {
            this.handleLoginExpired()
          }
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  private setupResponseInterceptor(): void {
    this.axiosIns.interceptors.response.use(
      response => {
        const { data: result, config } = response

        //业务状态码判断
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

  /**
   * 处理token刷新逻辑
   * 将token刷新的复杂逻辑封装为私有方法，避免代码重复，提高可维护性
   * @param config - 当前请求配置
   * @param refreshToken - 刷新token
   * @returns Promise<AxiosRequestConfig> - 返回更新后的请求配置
   */
  private handleTokenRefresh(config: AxiosRequestConfig, refreshToken: string): Promise<AxiosRequestConfig> {
    if (!this.isRefreshing) {
      // 1.发送刷新 token 的请求
      console.log('发送刷新TOKEN的请求')
      this.isRefreshing = true
      refreshTokenAPI(refreshToken).then(async result => {
        // 1.1异步更新 token，但是不要更新 refreshToken
        // 先执行下面 将当前请求放入 queq 队列
        console.log('刷新TOKEN完成', result)
        await store.dispatch(setToken({ ...result, isChangeRefresh: false }))

        // 1.2重置isRefreshing
        this.isRefreshing = false

        // 1.3取出队列中的函数进行执行
        this.queq.forEach(item => item(result.token))

        // 1.4重置队列
        this.queq = []
      })
    }

    //2.阻止当前请求的发出，将其追加到一个队列
    return new Promise(resolve => {
      this.queq.push(function (newToken) {
        // 处理旧token
        config.headers.Authorization = newToken
        resolve(config)
      })
    })
  }

  /**
   * 处理登录过期逻辑
   * 封装登录过期时的处理逻辑，统一管理用户登录状态
   */
  private handleLoginExpired(): void {
    message.error('登录已过期，请重新登录')
    storage.clearAll()
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
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
