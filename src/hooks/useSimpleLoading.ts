import { useState, useCallback } from 'react'

/**
 * 简化版 loading hook，不传参数时默认使用 'default' key
 */
export function useSimpleLoading() {
  const [loading, setLoading] = useState(false)

  const wrap = useCallback((fn: Function) => {
    return async (...args: any[]) => {
      setLoading(true)
      try {
        const result = await fn(...args)
        return result
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return {
    loading,
    wrap,
    setLoading
  }
}

/**
 * 带 key 的 loading hook
 */
export function useKeyLoading(key: string = 'default') {
  const [loading, setLoading] = useState(false)

  const wrap = useCallback((fn: Function) => {
    return async (...args: any[]) => {
      setLoading(true)
      try {
        const result = await fn(...args)
        return result
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return {
    loading,
    wrap,
    setLoading
  }
} 