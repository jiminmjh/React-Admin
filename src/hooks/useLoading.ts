/* loading状态控制，支持多个loading状态 */
import { useState, useCallback } from 'react'

type KeyType = string

interface LoadingState {
  [key: string]: boolean
}

interface UseLoadingReturn {
  loading: LoadingState
  wrap: (key: KeyType, fn: Function) => (...args: any[]) => Promise<any>
}

export function useLoading(keys?: KeyType[] | KeyType): UseLoadingReturn {
  // 如果没有传参数，默认使用 'default' 作为 key
  const keyArr = keys ? (Array.isArray(keys) ? keys : [keys]) : ['default']

  // 初始化 loading 状态
  const [loading, setLoading] = useState<LoadingState>(() => {
    const initial: LoadingState = {}
    keyArr.forEach(key => (initial[key] = false))
    return initial
  })

  // 包装异步函数，自动处理 loading 状态
  const wrap = (key: KeyType = 'default', fn: Function) => {
    return async (...args: any[]) => {
      setLoading({ ...loading, [key]: true })
      try {
        const result = await fn(...args)
        return result
      } finally {
        setLoading({ ...loading, [key]: false })
      }
    }
  }

  return {
    loading,
    wrap
  }
}

// 默认导出，支持不传参数
export default function useDefaultLoading() {
  return useLoading()
}
